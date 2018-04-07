/* Returns primary eth account or rejects with err */
const getAccounts = _web3 => {
  return new Promise((resolve, reject) => {
    /* 2 secs since getAccounts may not run if Metamask is locked */
    setTimeout(() => {reject(new Error('Unable to retrieve ethereum account!'))}, 2000)
    _web3.eth.getAccounts((err,res) => {
      if (err) return reject(err)
      if (res.length !== 0 && res[0].length > 0) return resolve(res[0])
      return reject(new Error ("Ethereum account locked!"))
    })
  })
}
/* Returns primary eth account or false */
export default _web3 => {
  return new Promise ((resolve, reject) => {
    return getAccounts(_web3)
    .then(res => resolve(res))
    .catch(err => resolve(false))
  })
}