import cont from './promoContract'
/* Returns the instantiated contract for use in transactions */
export default (_web3) => {
  return new Promise((resolve, reject) => {
    let cAdd  = cont.cAdd
      , cABI  = _web3.eth.contract(cont.ABI)
    return resolve(cABI.at(cAdd))
  })
}
