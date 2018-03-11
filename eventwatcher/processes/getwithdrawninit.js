const {fork} = require('child_process'),
      utils  = require('../modules/utils')
/*
This method is called in the main eventwatcher.js file via a daily cron job. Can also be run when needed via node in this directory:
$ const whatever = require('./getmissingprocess')
$ whatever.manualInit(args)
*/
/* To run this process via the command line per above (period (# of hours) can be ommitted safely) */
const manualInit = function(_period) {
  init(_period, './getwithdrawnprocess')//path relative to this file...
}

/* Already running processes call this function (Defaults to 6 hour period)*/
const init = function(_period, _path) {
  const period = _period == undefined ? 6 : _period
  const getWithdrawals = _path == undefined ? fork("./getwithdrawnprocess") : fork(_path)
  console.log("getWithdrawals Process Spawned on", utils.getTime())
  getWithdrawals.send(period)
  getWithdrawals.on("message", msg => {
    if(msg == "Complete!" || msg == "Errored!"){//process itself emails error reports...
      getWithdrawals.kill()
      console.log("getWithdrawals process killed with status: ", msg, " on: ", utils.getTime())
    } else {
      console.log("getWithdrawals process says: ", msg)
    }
  })
}

module.exports = {
  init:       init,
  manualInit: manualInit
}
