const {fork} = require('child_process'),
      utils  = require('../modules/utils')
/*
This method is called in the main eventwatcher.js file via a daily cron job. Can also be run when needed via node in this directory:
$ const whatever = require('./getweeklyeventsinit')
$ whatever.manualInit(args)
*/
const manualInit = function(_weekNo, _period) {
  init(_weekNo, './getweeklyeventsprocess', _period)//path relative to this file...
}

/* Already running processes call this function instead of the above one */
const init = function(_weekNo, _path, _period) {
  const period   = _period == undefined ? 7 : _period,
        raffleID = _weekNo == undefined ? (utils.getWeekNo() - 1) : _weekNo,
        getOrac  = _path   == undefined ? fork("./processes/getweeklyeventsprocess") : fork(_path)
  console.log("getWeeklyEvents Process Spawned on", utils.getTime())
  getOrac.send([raffleID, period])
  getOrac.on("message", msg => {
    if(msg == "Complete!" || msg == "Errored!"){//process itself emails error reports...
      getOrac.kill()
      console.log("getWeeklyEvents process killed with status: ", msg, " on: ", utils.getTime())
    } else {
      console.log("getWeeklyEvents process says: ", msg)
    }
  })
}

module.exports = {
  init:       init,
  manualInit: manualInit
}
