const moment  = require('moment')
    , getWeb3 = require('./getweb3')
/* Period in days, assumes block time of ~ 15s */
module.exports = (_latestBlock, _period) => {
  let block = _latestBlock - Math.trunc((_period * 24 * 60 * 60) / 15)
  return new Promise ((resolve, reject) => {
    return getWeb3.etheraffle.LogWinningNumbers({},{fromBlock: block, toBlock: "latest"}).get((err,res) => {
      if (err || res.length == 0) return resolve(null)
      return resolve(
        res.map(x => {
          return obj = {
            wNumbers:     x.args.wNumbers,
            forRaffle:    JSON.parse(x.args.forRaffle),
            numEntries:   JSON.parse(x.args.numberOfEntries),
            prizePool:    JSON.parse(x.args.currentPrizePool),
            randomSerial: JSON.parse(x.args.randomSerialNo),
            atTime:       moment.unix(JSON.parse(x.args.atTime)).format('dddd, MMMM Do, YYYY HH:mm:ss')
          }
        })
      )
    })
  })
}