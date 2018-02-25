const mongo   = require('mongodb').MongoClient,
      object  = require('mongodb').ObjectID,
      apikeys = require('./apikeys'),
      utils   = require('./utils')

/* Setup Connection */
let db
const init = function(){
  return new Promise((resolve, reject) => {
    mongo.connect(apikeys.mongo, (err, database) => {
      if(err) return reject(false)//will hit the catch and email me
      db = database
      console.log("App Database Initialised on", utils.getTime())
      return resolve(true)
    })
  })
}
init().catch(err => utils.errorHandler("init", "App's Mongo", "None", err))//TODO: kill cluster to force reboot?

/* Api Key Check (Smart Contract) */
const checkKey = function(_key) {
  if(typeof _key != "string") return false
  return db.collection("apikeys").findOne({apikey: _key})
  .then(results => {
    return results != null ? true : false
  }).catch(err => utils.errorHandler("checkKey", "Mongo", _key, err))
}

/* Update user details on withdraw (Front End) */
const updateOnWithdraw = function (_data) {
  let temp = _data.entryNumArr.split(',')//Arr comes through as string out of table data...
  for (a in temp){
    temp[a] = parseInt(temp[a], 10)
  }
  const obj1 = {}, obj2 = {}, obj3 = {}
  obj1["ethAdd"] = _data.ethAdd
  obj1["entries." + _data.raffleID] = temp
  obj2["$each"] = [_data.txHash, _data.timeStamp]//these extend the withdrawn array so front end is aware.
  obj3["entries." + _data.raffleID + ".$"] = obj2
  return db.collection("ethAdd").update(obj1, {$push : obj3})
  .then(results => {
    return results.result.nModified == 1 ? true : false
  }).catch(err => utils.errorHandler("updateOnWithdraw", "Mongo", _data, err))
}

/* Get user's raffle results (front end) */
const getResults = function(_ethAdd){
  return db.collection("ethAdd").findOne({"ethAdd" : _ethAdd})
  .then(results => {
    if(results == null || results.raffleIDs == undefined) return null
    const promises = []
    for(let i = 0; i < results.raffleIDs.length; i++){
      promises.push(getRaffleResults(results.raffleIDs[i]))
    }
    return Promise.all(promises)
    .then(promiseRes => {
      const raffleResultsObj = {}
      for(let i = 0; i < promiseRes.length; i++){
        raffleResultsObj[results.raffleIDs[i]] = promiseRes[i]
      }
      if(Object.keys(raffleResultsObj).length != results.raffleIDs.length) return null
      return {
        entries:          results.entries,
        raffleIDs:        results.raffleIDs,
        raffleResultsObj: raffleResultsObj
      }
    })
  }).catch(err => utils.errorHandler("getResults", "Mongo", _ethAdd, err))
}

/* Get user's individual raffle results (internal function) */
const getRaffleResults = function(_raffleID){
  return db.collection("entries").findOne({"raffleID" : _raffleID},{"_id" : 0, "resultsArr" : 1})
  .then(results => {
    if(results.resultsArr == undefined) return {timeStamp: null}//raffle not yet drawn...
    return {
      winningNumbers: results.resultsArr.winningNumbers,
      winningAmounts: results.resultsArr.winningAmounts,
      timeStamp: results.resultsArr.timeStamp
    }
  }).catch(err => utils.errorHandler("getRaffleResults", "Mongo", _raffleID, err))
}

/* Get Matches Array (Smart Contract) */
const getMatchesArr = function (_raffleID) {
  return db.collection("entries").findOne({"raffleID" : _raffleID},{_id:0, "resultsArr.matches":1})
  .then(results => {
    let body = "For raffle: " + _raffleID + "<br><br>At time: " + utils.getTime()
    if(results == null || results.resultsArr == undefined){
      let subject = "Alert! [0,0,0,0] matches array sent to contract! (DB results == null)"
      utils.sendEmail(subject, body)
      return [0,0,0,0]
    }
    matchesArr = results.resultsArr.matches.slice(3)//only need matches for 3,4,5 & 6...
    if(matchesArr.length != 4){//to make sure something of the correct length is sent to the contract...
      let subject = "Alert! [0,0,0,0] matches array sent to contract! (DB arr.length != 4)"
      utils.sendEmail(subject, body)
      return [0,0,0,0]
    } else {
      let subject = "Matches Array: " + matchesArr + " successfully sent to smart contract!"
      utils.sendEmail(subject, body)
      console.log("Matches array successfully sent to contract: ", matchesArr)
      return matchesArr
    }
  }).catch(err => utils.errorHandler("getMatchesArr", "Mongo", _raffleID, err))
}

module.exports = {
  getMatchesArr:    getMatchesArr,
  checkKey:         checkKey,
  getResults:       getResults,
  updateOnWithdraw: updateOnWithdraw,
  init:             init
}
