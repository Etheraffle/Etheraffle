import getContInst    from './get_cont_inst'
import getTicketPrice from './get_ticket_price'
import utils          from '../components/utils'
import satCont        from './etheraffle_sat_contract'
/* Sorts entry numbers then enters raffle. Returns txHash or rejects with error */
export default (_web3, _which, _user, _eNums) => {
  return new Promise((resolve, reject) => {
    let cont
    if (_which === 'Saturday' || _which === 5) cont = satCont()
    getTicketPrice(_web3, _which).then(price => {
      getContInst(_web3, _which).then(etheraffle => {
        let eNums = utils.sortEnums(_eNums)
          , data  = etheraffle.enterRaffle.getData(eNums, 0)
        _web3.eth.sendTransaction({
          data:  data,
          from:  _user,
          value: price,
          to:    cont.cAdd,
          gas:   cont.gasForEntry
        },(err, txHash) => {
          return !err ? resolve(txHash) : reject(err)
        })
      })
    }).catch(err => {
      return reject(err)
    })
  })
}
