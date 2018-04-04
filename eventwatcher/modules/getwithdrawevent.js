const getWeb3 = require('./getweb3')
/* Period in hours, and assumes block time of ~ 15s */
module.exports = (_period, _latestBlock) => {
  let block = _latestBlock - Math.trunc((_period * 60 * 60) / 15)
  return new Promise((resolve, reject) => {
    getWeb3.etheraffle.LogWithdraw({},{fromBlock: block, toBlock: 'latest'}).get((err, res) => {
      if (err) return reject(new Error("Error retrieving withdraw events!" + err))
      if (res.length == 0) return resolve(null)
      let arr = []
      for (let i = 0; i < res.length; i++) {
        let obj = {
          timeStamp: JSON.parse(res[i].args.atTime),
          raffleID : JSON.parse(res[i].args.forRaffle),
          entryNum : JSON.parse(res[i].args.forEntryNumber),
          ethAdd   : res[i].args.toWhom
        }
        arr.push(obj)
      }
      return resolve(arr)
    })
  })
}