import getContInst    from './get_cont_inst'
import utils          from '../components/utils'
import satCont        from './etheraffle_sat_contract'
/* Sorts entry numbers then enters raffle for free. Returns txHash or rejects with error */
export default (_web3, _which, _user, _eNums) => {
  return new Promise((resolve, reject) => {
    let cont
    if (_which === 'Saturday' || _which === 5) cont = satCont()
    getContInst(_web3, _which).then(etheraffle => {
      let eNums = utils.sortEnums(_eNums)
        , data  = etheraffle.enterFreeRaffle.getData(eNums, 0)
      _web3.eth.sendTransaction({
        data:  data,
        from:  _user,
        to:    cont.cAdd,
        gas:   cont.gasForEntry
      },(err, txHash) => {
        return !err ? resolve(txHash) : reject(err)
      })
    })
  })
}
