/* Returns primary account or false if locked */
export default _web3 => {
  return new Promise((resolve, reject) => {
    _web3.eth.getAccounts((err,res) => {
      if (err) return reject(err)
      if (res.length !== 0 && res[0].length > 0) return resolve(res[0])
      return resolve(false)// locked
    })
  })
}
