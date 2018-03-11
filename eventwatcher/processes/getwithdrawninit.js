const {fork} = require('child_process'),
      utils  = require('../modules/utils')
/*
> import x from 'getwithdrawninit'
> x()
*/
/* Init withdrawn process - defaults to 6 hour period & correct path */
export default (_period, _path) => {
  const period = _period == undefined ? 6 : _period,
        getWithdrawals = _path == undefined ? fork("./getwithdrawnprocess") : fork(_path)
  console.log("getWithdrawals Process Spawned on", utils.getTime())
  getWithdrawals.send(period)
  getWithdrawals.on("message", msg => {
    if(msg == "Complete!" || msg == "Errored!") {//process itself emails error reports...
      getWithdrawals.kill()
      console.log("getWithdrawals process killed with status: ", msg, " on: ", utils.getTime())
    } else {
      console.log("getWithdrawals process says: ", msg)
    }
  })
}

