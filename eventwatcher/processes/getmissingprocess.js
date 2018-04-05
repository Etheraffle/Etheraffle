//const lupus = require('lupus')
const mongo         = require('../modules/mongo')
    , utils         = require('../modules/utils')
    , getEntry      = require('../modules/getsingleentry')
    , getNumEntries = require('../modules/getrafflenumentries')

process.on('message', raffleID => {
  fillMissingEntries(raffleID)
})

process.on('unhandledRejection', err => {//catches errors in my catches :/
  console.log('unhandledRejection', err.stack)//TODO: remove!
})

/* Run daily via cron. It checks for missing entries then retrieves them from the blockchain before inserting to db */
function fillMissingEntries(_raffleID) {
  return mongo.init()
  .then(res => {
    if (res != true) throw new Error("Mongo init() returned false!")
    let p1 = mongo.getEntriesArr(_raffleID), p2 = getNumEntries(_raffleID)
    return Promise.all([p1,p2])
    .then(([entriesArr, numEntries]) => {
      //console.log("entriesArr: ", entriesArr, "numEntries: ", numEntries)
      if (numEntries == 0){
        process.send("No entries found for raffle: " + _raffleID)
        return process.send("Complete!")
      }
      if (entriesArr != null && entriesArr.length > numEntries){
        process.send("entriesArr.length is greater than raffleNumEntries!")
        return process.send('Errored!')
      }
      if (entriesArr == null){
        process.send('Mongo entriesArr returned null!')
        return process.send('Errored!')
      }
      return getMissingEntryNums(entriesArr, numEntries)
      .then(missingNo => {
        if (missingNo.length == 0){
          process.send(`No missing entries for raffle: ${_raffleID}`)
          return process.send("Complete!")
        }
        return getMissingEntries( _raffleID, missingNo)
        .then(res => {
          if (res != true) return process.send("Errored!")
          process.send("Missing entries filled succesfully!")
          return process.send("Complete!")
        })
      })
    })
  }).catch(err => {
    utils.errorHandler("fillMissingEntries", "getMissingEntries", _raffleID, err)
    process.send(`getMissingProcess errored: ${err}`)
    return process.send("Errored!")
  })
}
/* Loop over entries array finding absent entries */
function getMissingEntryNums(_entriesArr, _numEntries) {
  return new Promise((resolve,reject) => {
    let tempArr = new Array(_numEntries), missingNo = []
    for (let i = 0; i < _entriesArr.length; i++){//create array filled with undefined or entryNums
      tempArr[_entriesArr[i][6] - 1] = _entriesArr[i][6]
    }
    for (let i = 0; i < tempArr.length; i++){//push into missingNo the index of the undefineds(note i = 1!!!)
      if (tempArr[i] == undefined) missingNo.push(i + 1)
    }
    return resolve(missingNo)
  })
}
/* Use missing entries array to seach blockchain for those entries */
function getMissingEntries(_raffleID, _missingNo) {
  const promises = [], promRes = []
  return utils.getBlockNum()
  .then(blockStart => {
    for (let i = 0; i < _missingNo.length; i++){
      promises.push(getEntry(blockStart, _raffleID, _missingNo[i]))
    }
    return Promise.all(promises)
    .then(promArr => {
      for (let i = 0; i < promArr.length; i++){//remove any nulls...
        if (promArr[i] != null) promRes.push(promArr[i])
      }
      return mongo.bulkUpdate(promRes)
      .then(res => {
        return res == true ? true : false
      })
    })
  }).catch(err => {
    utils.errorHandler("getMissingEntries", "getMissingEntries", `${_raffleID} + ${_missingNo}`, err)
    return process.send("Errored!")
  })
}
