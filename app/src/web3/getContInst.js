import etheraffleSatContract from './etheraffleSatContract'

/* Returns the instantiated contract for use in transactions */
export default (_which) => {
  return new Promise((resolve, reject) => {
    //if(window.web3 === null || window.web3.isConnected() === false)
      //return reject(new Error("Failed to instantiate contract - no web3 connection!"))
    let cont
    if(_which === "Saturday") cont = etheraffleSatContract
    let cAdd  = cont.cAdd,
        cABI  = window.web3.eth.contract(cont.ABI),
        cInst = cABI.at(cAdd)
    return resolve(cInst)
  })
}
