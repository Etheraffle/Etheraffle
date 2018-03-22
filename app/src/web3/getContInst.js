import etheraffleSatContract from './etheraffleSatContract'

/* Returns the instantiated contract for use in transactions */
export default (_which) => {
  return new Promise((resolve, reject) => {
    let cont
    if (_which === "Saturday") cont = etheraffleSatContract
    let cAdd  = cont.cAdd
      , cABI  = window.web3.eth.contract(cont.ABI)
      , cInst = cABI.at(cAdd)
    return resolve(cInst)
  })
}
