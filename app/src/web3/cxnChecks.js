/* Returns empty upon succesful connection checks, else rejects with error */
export default () => {
  return new Promise((resolve, reject) => {
    if (window.web3 === undefined) return reject(new Error('No ethereum connection detected'))
    if (!window.web3.isConnected()) return reject(new Error('No ethereum connection detected'))
    if (window.ethAdd === undefined) return reject(new Error('No ethereum account detected'))
    if (window.ethAdd === null) return reject(new Error('Ethereum account locked'))
    if (window.web3.version.network > 1) return reject(new Error('Test network detected'))
    return resolve()
  })
}
