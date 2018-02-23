import Web3 from 'web3'

/* Returns live web3 object or an error. */
export default () => {
  return new Promise((resolve, reject) => {
    let web3 = window.web3
    if(typeof web3 !== undefined) web3 = new Web3(web3.currentProvider)
    else web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    if(typeof web3 !== undefined && web3.isConnected() === true) return resolve(web3)
    return reject(new Error("Cannot connect to web3!"))
  })
}
