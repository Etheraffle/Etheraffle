const {fork} = require('child_process')
    , utils  = require('../modules/utils')
/*
 * @dev   Function called by cron once a day to pick up any entries the
 *        event watcher may have missed. Requires at least one entry to
 *        already be in the database for the raffle in question.
 * 
 * @param _period   The period of days to look over.
 * 
 * @param _path     The path to the js file the forked process runs. 
 *                  Defaults to correct path relative to this file.
 * 
 * @param _weekNo   The desired week number - defaults to week prior  
 *                  to the current week.
 */
const init = (_period = 7, _path = './getweeklyeventsprocess', _weekNo = utils.getWeekNo() - 1) => {
  const getOrac  = fork(_path)
  console.log(`getWeeklyEvents Process Spawned on ${utils.getTime()} for week number: ${_weekNo}`)
  getOrac.send([_weekNo, _period])
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
