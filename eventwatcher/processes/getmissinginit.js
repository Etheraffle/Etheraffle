const {fork} = require('child_process'),
      utils  = require('../modules/utils')
/*
This method is called in the main eventwatcher.js file via a daily cron job. Can also be run when needed via node in this directory:
$ const whatever = require('./getmissinginit')
$ whatever.manualInit(args)
*/
/* To run this process via the command line per above... */
const manualInit = function(_weekNo){
  init(_weekNo, './getmissingprocess')//path relative to this file...
}

/* Already running processes call this function */
const init = function (_weekNo, _path){//requires at least one entry already in db!
  console.log("Week number according to function: ", utils.getWeekNo())
  const raffleID = _weekNo == undefined ? utils.getWeekNo() : _weekNo
  const getMissingEntries = _path == undefined ? fork("./processes/getmissingprocess") : fork(_path)
  console.log("getMissingEntries Process Spawned on", utils.getTime())
  getMissingEntries.send(raffleID)
  getMissingEntries.on("message", msg => {
    if(msg == "Complete!" || msg == "Errored!"){//process emails error reports...
      getMissingEntries.kill()
      console.log("getMissingEntries process killed with status: ", msg, " on: ", utils.getTime())
    } else {
      console.log("getMissingEntries process says: ", msg)
    }
  })
}

module.exports = {
  init:       init,
  manualInit: manualInit
}
