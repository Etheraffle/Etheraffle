const {fork} = require('child_process'),
      utils  = require('../modules/utils')
/*
This method is called in the main eventwatcher.js file via a daily cron job. Can also be run when needed via node in this directory:
> const whatever = require('./getmissinginit')
> whatever.init(args)
*/
/* Already running processes call this function */
const init = (_weekNo, _path) => {//requires at least one entry already in db!
  console.log("Week number according to function: ", utils.getWeekNo())
  const raffleID = _weekNo == undefined ? utils.getWeekNo() : _weekNo,
        getMissingEntries = _path == undefined ? fork("./getmissingprocess") : fork(_path)
  console.log("getMissingEntries Process Spawned on", utils.getTime())
  getMissingEntries.send(raffleID)
  getMissingEntries.on("message", msg => {
    if(msg == "Complete!" || msg == "Errored!") {
      getMissingEntries.kill()
      console.log("getMissingEntries process killed with status: ", msg, " on: ", utils.getTime())
    } else {
      console.log("getMissingEntries process says: ", msg)
    }
  })
}

module.exports = {
  init: init
}
