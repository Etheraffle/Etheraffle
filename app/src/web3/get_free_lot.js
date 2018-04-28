import getContInst from './get_cont_inst'
/* Returns either the prizePool or rejects with err */
export default (_web3, _ethAdd, _which = 'Free') => {
  return new Promise((resolve, reject) => {
    getContInst(_web3, _which).then(freeLOT => {
      freeLOT.balanceOf.call(_ethAdd, (err, res) => {
        return !err ? resolve(JSON.parse(res)) : reject(err)
      })
    }).catch(err => {
      return reject(err)
    })
  })
}
