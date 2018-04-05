const {fork} = require('child_process')
    , utils  = require('../modules/utils')
/*
 * @dev   Function called by cron once a day to pick up any entries the
 *        event watcher may have missed. Requires at least one entry to
 *        already be in the database for the raffle in question.
 * 
 * @param _period The period of days to look over.
 * 
 * @param _path   The path to the js file the forked process runs. Defaults
 *                to correct path relative to this file.
 * 
 * @param _weekNo The desired week number (defaults to current week)
 */
const init = (_period, _path, _weekNo) => {
  const period   = _period == undefined ? 7 : _period,
        getOrac  = _path   == undefined ? fork("./getweeklyeventsprocess") : fork(_path),
        raffleID = _weekNo == undefined ? (utils.getWeekNo() - 1) : _weekNo
  console.log(`getWeeklyEvents Process Spawned on ${utils.getTime()}`)
  getOrac.send([raffleID, period])
  getOrac.on("message", msg => {
    if (msg == "Complete!" || msg == "Errored!") {
      getOrac.kill()
      console.log(`getWeeklyEvents process killed with status: ${msg}, on: ${utils.getTime()}`)
    } else {
      console.log(`getWeeklyEvents process says: ${msg}`)
    }
  })
}

module.exports = {
  init: init
}
