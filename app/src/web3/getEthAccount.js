const getAccounts = () => {
  return new Promise((resolve, reject) => {
    window.web3.eth.getAccounts((err,res) => {
      if (err) return reject(err)
      if (res.length !== 0 && res[0].length > 0) return resolve(res[0])
      return reject(new Error ("Ethereum account locked!"))
    })
  })
}

const raceAccounts = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {reject(new Error('Unable to retrieve ethereum account!'))}, 2000)
  })
}

/* Returns either the primary eth account or null */
export default () => {
  return new Promise((resolve, reject) => {
    /* Race because getEthAccounts() doesn't run if the main account is locked in metamask :/ */
    Promise.race([getAccounts(),raceAccounts()])
    .then(res => {resolve(res)})
    .catch(err => {return reject(err)})
  })
}
