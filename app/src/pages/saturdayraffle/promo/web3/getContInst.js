import cont from './promoContract'

/* Returns the instantiated contract for use in transactions */
export default () => {
  return new Promise((resolve, reject) => {
    let cAdd  = cont.cAdd
      , cABI  = window.web3.eth.contract(cont.ABI)
    return resolve(cABI.at(cAdd))
  })
}
