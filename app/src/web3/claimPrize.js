import getContInst from './getContInst'
import satCont     from './etheraffleSatContract'

/* Returns txHash or rejects with error */
export default (_web3, _which, _user, _raffleID, _entryNum) => {
  return new Promise((resolve, reject) => {
    let cont
    if (_which === "Saturday" || _which === 5) cont = satCont
    getContInst(_web3, _which)
    .then(etheraffle => {
      let data  = etheraffle.withdrawWinnings.getData(_raffleID, _entryNum)
      _web3.eth.sendTransaction({
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
