const getWeb3 = require('./getweb3')

module.exports = (_qID) => {
  return new Promise((resolve, reject) => {
    getWeb3.etheraffle.qID.call(_qID, (err,res) => {
      return !err ? resolve(res) : resolve([])
    })
  })
}
