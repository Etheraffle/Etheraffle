const getWeb3 = require('./getweb3')

module.exports = (_raffleID) => {
  return new Promise ((resolve, reject) => {
    getWeb3.etheraffle.raffle.call(_raffleID, (err, res) => {
      if(err) return reject(new Error("Couldn't retrieve number of entries for raffle: " + _raffleID + err))
      return resolve(JSON.parse(res[3]))
    })
  })
}
