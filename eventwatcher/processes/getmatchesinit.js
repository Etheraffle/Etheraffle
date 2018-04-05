const {fork}      = require('child_process')
    , utils       = require('../modules/utils')
    , getWinEvent = require('../modules/getwinningevent')
/*
> const x = require('/getmatchesinit')
> x.manualInit(args)
*/
/* For running via node manually... _period is number of days to search over... */
const manualInit = (_weekNo, _period) => {
  const period   = _period == undefined ? 7 : _period,
        raffleID = _weekNo == undefined ? utils.getWeekNo() : _weekNo
  return utils.getBlockNum()
  .then(block => {
    return getWinEvent(block, raffleID, period)
    .then(obj => {
      if (obj == null) throw new Error("getWinningEvent module returned null!")
      return init(obj, './getmatchesprocess')
    })
  }).catch(err => utils.errorHandler("manualInit", "getMatchesInit", _weekNo, err))
}
/* Else running processes call this function instead */
const init = (_wObj, _path) => {
  const getMatches = _path == undefined ? fork('./getmatchesprocess') : fork(_path)
  console.log(`getMatches Process Spawned on: ${utils.getTime()}`)
  getMatches.send(_wObj)
  getMatches.on('message', msg => {
    if (msg == "Complete" || msg == "Errored!"){
      getMatches.kill()
      console.log(`getMatches process killed with status: ${msg} on: ${utils.getTime()}`)
    } else {
      console.log(`getMatches process says: ${msg}`)
    }
  })
}

module.exports = {
  init:       init,
  manualInit: manualInit
}
