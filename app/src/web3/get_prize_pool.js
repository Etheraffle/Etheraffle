import getContInst from './get_cont_inst'
/* Returns either the prizePool or rejects with err */
export default (_web3, _which) => {
  return new Promise((resolve, reject) => {
    getContInst(_web3, _which).then(etheraffle => {
      etheraffle.prizePool.call((err, res) => {
        return !err ? resolve(JSON.parse(res)) : reject(err)
      })
    }).catch(err => {
      return reject(err)
    })
  })
}
