import utils from '../components/utils'
import freeCont from './free_lot_contract'
import satCont from './etheraffle_sat_contract'
/* Returns the instantiated contract for use in transactions */
export default (_web3, _which, _weekNo = utils.getExactWeekNo()) => {
  return new Promise((resolve, reject) => {
    let cont
    if (_which === 'Free') cont = freeCont()
    else if (_which === 'Saturday' || _which === 5) cont = satCont(_weekNo)
    let cAdd  = cont.cAdd
      , cABI  = _web3.eth.contract(cont.ABI)
    return resolve(cABI.at(cAdd))
  })
}
