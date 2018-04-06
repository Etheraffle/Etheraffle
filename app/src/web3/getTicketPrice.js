import getContInst from './getContInst'
/* Returns either the ticket price or rejects with error */
export default (_web3, _which) => {
  return new Promise((resolve, reject) => {
    if (_web3 === null || _web3.isConnected() === false)
      return reject(new Error("Failed to retrieve tktPrice - no web3 connection!"))
    getContInst(_which)
    .then(etheraffle => {
      etheraffle.tktPrice.call((err, res) => {
        return !err ? resolve(JSON.parse(res)) : reject(err)
      })
    }).catch(err => {
      return reject(err)
    })
  })
}
