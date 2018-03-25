const moment  = require('moment')
    , getWeb3 = require('./getweb3')
/* Period in days, assumes block time of ~ 15s */
module.exports = (_latestBlock, _period) => {
  let block = _latestBlock - Math.trunc((_period * 24 * 60 * 60) / 15)
  return new Promise ((resolve, reject) => {
    return getWeb3.etheraffle.LogPrizePoolsUpdated({},{fromBlock: block, toBlock: "latest"}).get((err,res) => {
      if(err || res.length == 0) return resolve(null)
      return resolve(
        res.map(x => {
          return obj = {
            forRaffle:          JSON.parse(x.args.forRaffle),
            newPrizePool:       JSON.parse(x.args.newMainPrizePool),
            unclaimedPrizePool: JSON.parse(x.args.unclaimedPrizePool),
            threeMatchWinAmt:   JSON.parse(x.args.threeMatchWinAmt),
            fourMatchWinAmt:    JSON.parse(x.args.fourMatchWinAmt),
            fiveMatchWinAmt:    JSON.parse(x.args.fiveMatchWinAmt),
            sixMatchWinAmt:     JSON.parse(x.args.sixMatchwinAmt),//note lower case W, solicism in smart contract!
            atTime:             moment.unix(JSON.parse(x.args.atTime)).format('dddd, MMMM Do, YYYY HH:mm:ss')
          }
        })
      )
    })
  })
}

