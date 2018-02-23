const getAccounts = () => {
  return new Promise((resolve, reject) => {
    window.web3.eth.getAccounts((err,res) => {
      if(err) return reject(err)
      if(res.length !== 0 && res[0].length > 0) return resolve(res[0])
      return reject(new Error ("Ethereum account locked!"))
    })
  })
}

const raceAccounts = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {reject(new Error('Unable to retreive ethereum account!'))}, 1000)
  })
}

/* Returns either the primary eth account or null */
export default () => {
  return new Promise((resolve, reject) => {
    //if(window.web3 === null || window.web3 === undefined || window.web3.isConnected() === false)
      //return reject(new Error("Failed to retrieve eth accounts, no web3 connection!"))
    /* Race because getEthAccounts() doesn't run if the main account is locked in metamask :/ */
    Promise.race([getAccounts(),raceAccounts()])
    .then(res => {resolve(res)})
    .catch(err => {return reject(err)})
  })
}
