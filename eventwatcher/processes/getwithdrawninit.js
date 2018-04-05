const {fork} = require('child_process')
    , utils  = require('../modules/utils')
/*
 * @dev   Function called by a cron job in eventwatcher js every three hours 
 *        to examine the contract for any prize withdrawals. Use this method 
 *        in stead of adding a new listener due to lower frequency of prize 
 *        withdrawals not really requiring listening out for.
 * 
 * @param _period     Number of hours to look over, defaults to 6
 * 
 * @param _path       Path to file the forked process will run - defaults 
 *                    to path relative to this file.
 */
const init = (_period = 6, _path = './getwithdrawnprocess') => {
  const getWithdrawals = fork(_path)
  console.log(`getWithdrawals Process Spawned on ${utils.getTime()}`)
  getWithdrawals.send(_period)
  getWithdrawals.on("message", msg => {
    if (msg == "Complete!" || msg == "Errored!") {//process itself emails error reports...
      getWithdrawals.kill()
      console.log(`getWithdrawals process killed with status: ${msg}, on: ${utils.getTime()}`)
    } else {
      console.log(`getWithdrawals process says: ${msg}`)
    }
  })
}

module.exports = {
  init: init
}
