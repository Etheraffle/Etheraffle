const { fork }    = require('child_process')
    , utils       = require('../modules/utils')
    , getWinEvent = require('../modules/getwinningevent')
/* 
 * @dev   For running via node manually if required. 
 * 
 * @param _weekNo   Week number to search in, defaults to current week
 * 
 * @param _period   Number of days to search over, defaults to seven.
 */
const manualInit = (_weekNo = utils.getWeekNo(), _period = 7) => {
  return utils.getBlockNum()
  .then(block => {
    return getWinEvent(block, _weekNo, _period)
    .then(obj => {
      if (obj == null) throw new Error("getWinningEvent module returned null!")
      return init(obj)
    })
  }).catch(err => utils.errorHandler("manualInit", "getMatchesInit", _weekNo, err))
}
/* 
 * @dev   Running processes call this function instead since it'll 
 *        already have the winning numbers object. Plus the relative
 *        path to fork changes depending on file calling it. 
 * 
 * @param _wObj     Winning numbers object from the blockchain
 * 
 * @param _path     Path to the js file the fork process will run
 */
const init = (_wObj, _path = './getmatchesprocess') => {
  const getMatches = fork(_path)
  console.log(`getMatches Process Spawned on: ${utils.getTime()}`)
  getMatches.send(_wObj)
  getMatches.on('message', msg => {
    if (msg == "Complete" || msg == "Errored!") {
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
