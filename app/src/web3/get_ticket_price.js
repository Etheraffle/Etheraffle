import getContInst from './get_cont_inst'
/* Returns either the ticket price or rejects with error */
export default (_web3, _which) => {
  return new Promise((resolve, reject) => {
    getContInst(_web3, _which).then(etheraffle => {
      etheraffle.tktPrice.call((err, res) => {
        return !err ? resolve(JSON.parse(res)) : reject(err)
      })
    }).catch(err => {
      return reject(err)
    })
  })
}
