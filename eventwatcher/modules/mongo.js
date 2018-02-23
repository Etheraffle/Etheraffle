const moment  = require('moment'),
      mongo   = require('mongodb').MongoClient,
      object  = require('mongodb').ObjectID,
      apikeys = require('./apikeys'),
      utils   = require('./utils'),
      cron    = require('node-cron')

/*Setup Connection & Initialize Batch Operations*/
let bulkEthAdd, bulkEntries, db, batchSize = 5, counter = 0
const init = function(){
  return new Promise((resolve, reject) => {
    mongo.connect(apikeys.mongo, (err, database) => {
      if(err) utils.errorHandler("mongo.connect", "Mongo", "None", err), process.exit(1)
      db          = database
      bulkEthAdd  = database.collection("ethAdd").initializeUnorderedBulkOp()
      bulkEntries = database.collection("entries").initializeUnorderedBulkOp()
      console.log("Bulk Ops Initialised")
      return resolve(true)
    })
  })
}
init().catch(err => utils.errorHandler("init", "Mongo", "None", err))

/* Setup Cron Job */
cron.schedule('*/5 * * * *', function(){
  drainQueue().catch(err => utils.errorHandler("cron.schedule", "Mongo", "None", err))
})

/* Drain BulkOperations Queue */
const drainQueue = function(){
  return new Promise((resolve, reject) => {
    if(bulkEntries == undefined || bulkEntries.s.currentUpdateBatch == null) return resolve(true)
    let p1 = bulkEntries.execute(), p2 = bulkEthAdd.execute()
    return Promise.all([p1,p2])
    .then(([r1,r2]) => {
      if(r1.ok != 1 || r2.ok != 1) throw new Error("Error draining entries queue! Entries: " + r1 + ", EthAdd: " + r2)
      bulkEntries = db.collection("entries").initializeUnorderedBulkOp()
      bulkEthAdd = db.collection("ethAdd").initializeUnorderedBulkOp()
      counter = 0
      return resolve(true)
    }).catch(err => {
      utils.errorHandler("drainQueue", "Mongo", "None", err)
      return resolve(false)
    })
  })
}

/* Batch Insert Entries & EthAdd */
const batchInsertion = function(_data){
  bulkEthAdd.find({"ethAdd":_data.ethAdd}).upsert().update({$addToSet:_data.obj})
  bulkEntries.find({"raffleID":_data.raffleID}).upsert().update({$addToSet:{"entriesArr":_data.chosenNumbers}})
  counter++
  if(counter % batchSize != 0) return
  else return drainQueue()
  .then(result => {
    if(result != true) throw new Error("Error in batchEthAdd Mongo function!: " + JSON.stringify(result))
    else return
  }).catch(err => utils.errorHandler("batchInsertion", "Mongo", _data, err))
}

/* Bulk Update Eth Add & Entries (used by child process) */
const bulkUpdate = function(_arr){
  let bEth = db.collection("ethAdd").initializeUnorderedBulkOp()
  let bEnt = db.collection("entries").initializeUnorderedBulkOp()
  for(let i = 0; i < _arr.length; i++){
    let obj = {}, entriesStr = "entries." + _arr[i].raffleID
    obj[entriesStr] = _arr[i].chosenNumbers
    obj["raffleIDs"] = _arr[i].raffleID
    bEth.find({"ethAdd" : _arr[i].ethAdd}).upsert().update({$addToSet : obj})
    bEnt.find({"raffleID":_arr[i].raffleID}).upsert().update({$addToSet:{"entriesArr":_arr[i].chosenNumbers}})
  }
  return Promise.all([bEth.execute(),bEnt.execute()])
  .then(([r1,r2]) => {
    if(r1.ok != 1 || r2.ok != 1) throw new Error("Error executing bulkUpdate! ethAdd: " + r1 + ", entries: " + r2)
    return true
  }).catch(err => utils.errorHandler("bulkUpdate", "Mongo", _arr, err))
}

/* Get Entries Array returns either entriesArr or empty array, or null on error (for child process) */
const getEntriesArr = function(_raffleID){
  return db.collection("entries").findOne({"raffleID" : _raffleID},{"_id" : 0, "entriesArr" : 1})
  .then(result => {
    return result == null ? [] : result.entriesArr == undefined ? [] : result.entriesArr
    //return result == null || result.entriesArr == undefined ? null : result.entriesArr
  }).catch(err => {
    utils.errorHandler("getEntriesArr", "Mongo", _raffleID, err)
    return null
  })
}

/* Update Entries With Results (Child Process) */
const updateResults = function(_wObj){
  return db.collection("entries").update({"raffleID" : _wObj.raffleID},
    {$set :
      {"entriesArr" :                 _wObj.entriesArr,
        "resultsArr.prizePool" :      _wObj.prizePool,
        "resultsArr.matches" :        _wObj.matches,
        "resultsArr.winningNumbers" : _wObj.winningNumbers,
        "resultsArr.winningAmounts" : _wObj.winningAmounts,
        "resultsArr.timeStamp" :      utils.getTimeStamp()}},{upsert : true})
  .then(res => {
    //return result.result.nModified == 1 || result.result.ok == 1 ? true : false
    return res.result.nModified == 1 ? true : res.result.ok == 1 ? true : false
  }).catch(err => {
    utils.errorHandler("updateResults", "Mongo", _wObj, err)
    return false
  })
}

/* Returns nothing. Updates db if user withdraws manually instead of via the website... */
const updateOnWithdraw = function(_data){
  return getUserEntries(_data.ethAdd, _data.raffleID)
  .then(arr => {
    let i, obj1 = {}, obj2 = {}, obj3 = {}
    if(arr == null) throw new Error("Successful withdrawal event but unable to find ethAdd's entries!")
    for(i = 0; i < arr.length; i++){//find index of this specific entry...
      if(arr[i][7] == _data.entryNum) break
    }
    if(arr[i].length > 8) return//user withdrawal already captured by front end
    obj1["ethAdd"] = _data.ethAdd
    obj1["entries." + _data.raffleID] = arr[i]
    obj2["$each"] = ['Not captured due to manual withdrawal', _data.timeStamp]
    obj3["entries." + _data.raffleID + ".$"] = obj2
    return db.collection("ethAdd").update(obj1, {$push : obj3})
    .then(results => {
      if(results.result.nModified != 1) throw new Error("Can't update user ethAdd after successful withdraw event!")
    })
  }).catch(err => utils.errorHandler("updateOnWithdraw(withdrawEventWatcher)", "Mongo", _data, err))
}

/* Returns array of entries for user/raffle combo, or null */
const getUserEntries = function(_ethAdd, _raffleID){
  let obj = {}, string = 'entries.' + _raffleID
  obj['_id'] = 0
  obj[string] = 1
  return db.collection('ethAdd').findOne({'ethAdd': _ethAdd}, obj)
  .then(res => {
    return res == null ? null : res.entries[_raffleID] == undefined ? null : res.entries[_raffleID]
  }).catch(err => {
    utils.errorHandler("getUserEntries", "Mongo", "ethAdd:" + _ethAdd + " raffleID: " + _raffleID, err)
    return null
  })
}

module.exports = {
  drainQueue:       drainQueue,
  batchInsertion:   batchInsertion,
  getEntriesArr:    getEntriesArr,
  updateResults:    updateResults,
  updateOnWithdraw: updateOnWithdraw,
  bulkUpdate:       bulkUpdate,
  init:             init
}
