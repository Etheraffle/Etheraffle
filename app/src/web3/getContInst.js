import etheraffleSatContract from './etheraffleSatContract'
/* Returns the instantiated contract for use in transactions */
export default (_web3, _which) => {
  return new Promise((resolve, reject) => {
    let cont
    if (_which === "Saturday") cont = etheraffleSatContract
    let cAdd  = cont.cAdd
      , cABI  = _web3.eth.contract(cont.ABI)
      , cInst = cABI.at(cAdd)
    return resolve(cInst)
  })
}
