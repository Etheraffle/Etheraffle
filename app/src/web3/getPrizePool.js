import getContInst from './getContInst'

/* Returns either the prizePool or rejects with err */
export default (_which) => {
  return new Promise((resolve, reject) => {
    if(window.web3 === null || window.web3.isConnected() === false)
      return reject(new Error("Failed to retrieve prizePool - no web3 connection!"))
    return getContInst(_which)
    .then(etheraffle => {
      etheraffle.prizePool.call((err, res) => {
        return !err ? resolve(JSON.parse(res)) : reject(err)
      })
    }).catch(err => {
      return reject(err)
    })
  })
}
