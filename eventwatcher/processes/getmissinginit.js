const {fork} = require('child_process')
    , utils  = require('../modules/utils')
/*
This method is called in the main eventwatcher.js file via a daily cron job. Can also be run when needed via node in this directory:
> const whatever = require('./getmissinginit')
> whatever.init(args)
*/
const init = (_path, _weekNo) => { //requires at least one entry already in db!
  console.log("Week number according to function: ", utils.getWeekNo())
  const getMissingEntries = _path == undefined ? fork("./getmissingprocess") : fork(_path),
        raffleID = _weekNo == undefined ? utils.getWeekNo() : _weekNo
  console.log("getMissingEntries Process Spawned on", utils.getTime())
  getMissingEntries.send(raffleID)
  getMissingEntries.on("message", msg => {
    if (msg == "Complete!" || msg == "Errored!") {
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
