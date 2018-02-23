import getContInst from './getContInst'
import satCont     from './etheraffleSatContract'

/* Returns txHash or rejects with error */
export default (_which, _user, _raffleID, _entryNum) => {
  return new Promise((resolve, reject) => {
    //if(window.web3 === null || window.web3.isConnected() === false)
      //return reject(new Error("Failed to claim prize - no web3 connection!"))
    let cont
    if(_which === "Saturday") cont = satCont
    getContInst(_which)
    .then(etheraffle => {
      let data  = etheraffle.withdrawWinnings.getData(_raffleID, _entryNum)
      window.web3.eth.sendTransaction({
        from: _user,
        to:   cont.cAdd,
        data: data,
        gas:  cont.gasForWithdraw
      },(err, txHash) => {
        return !err ? resolve(txHash) : reject(err)
      })
    }).catch(err => {
      return reject(err)
    })
  })
}
