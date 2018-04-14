import etheraffleSatContract from './etheraffle_sat_contract'
/* Returns the instantiated contract for use in transactions */
export default (_web3, _which) => {
  return new Promise((resolve, reject) => {
    let cont
    if (_which === 'Saturday' || _which === 5) cont = etheraffleSatContract
    let cAdd  = cont.cAdd
      , cABI  = _web3.eth.contract(cont.ABI)
      , cInst = cABI.at(cAdd)
    return resolve(cInst)
  })
}