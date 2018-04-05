const {fork} = require('child_process')
    , utils  = require('../modules/utils')
/*
 * @dev   Function called by cron once a day to pick up any entries the
 *        event watcher may have missed. Requires at least one entry to
 *        already be in the database for the raffle in question.
 * 
 * @param _path   The path to the js file the forked process runs. Defaults
 *                to correct path relative to this file.
 * 
 * @param _weekNo The desired week number (defaults to current week)
 */
const init = (_path = './getmissingprocess', _weekNo = utils.getWeekNo()) => {
  const getMissingEntries = fork(_path)
  console.log(`getMissingEntries Process Spawned on ${utils.getTime()} for week number: ${_weekNo}`)
  getMissingEntries.send(_weekNo)
  getMissingEntries.on("message", msg => {
    if (msg == "Complete!" || msg == "Errored!") {
      getMissingEntries.kill()
      console.log(`getMissingEntries process killed with status: ${msg} on: ${utils.getTime()}`)
    } else {
      console.log(`getMissingEntries process says: ${msg}`)
    }
  })
}
module.exports = {
  init: init
}
