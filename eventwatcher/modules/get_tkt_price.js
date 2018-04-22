const getWeb3 = require('./getweb3')

module.exports = () => {
  return new Promise ((resolve, reject) => {
    getWeb3.etheraffle.tktPrice.call((err, res) => {
      if (err) return reject(new Error(`Couldn't retrieve ticket price from contract, error: ${err.msg}`))
      return resolve(JSON.parse(res))
    })
  })
}
