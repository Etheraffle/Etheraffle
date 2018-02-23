const moment  = require('moment'),
      getWeb3 = require('./getweb3')

//event LogPrizePoolsUpdated(uint newMainPrizePool, uint indexed forRaffle, uint unclaimedPrizePool, uint threeMatchWinAmt, uint fourMatchWinAmt, uint fiveMatchWinAmt, uint sixMatchwinAmt, uint atTime);
/* Period in days, assumes block time of ~ 15s */
module.exports = function(_latestBlock, _period){
  let block = _latestBlock - Math.trunc((_period * 24 * 60 * 60) / 15)
  return new Promise ((resolve, reject) => {
    return getWeb3.etheraffle.LogPrizePoolsUpdated({},{fromBlock: block, toBlock: "latest"}).get((err,res) => {
      if(err || res.length == 0) return resolve(null)
      const resArr = []
      for(i = 0; i < res.length; i++) {
        obj = {
          forRaffle:          JSON.parse(res[i].args.forRaffle),
          newPrizePool:       JSON.parse(res[i].args.newMainPrizePool),
          unclaimedPrizePool: JSON.parse(res[i].args.unclaimedPrizePool),
          threeMatchWinAmt:   JSON.parse(res[i].args.threeMatchWinAmt),
          fourMatchWinAmt:    JSON.parse(res[i].args.fourMatchWinAmt),
          fiveMatchWinAmt:    JSON.parse(res[i].args.fiveMatchWinAmt),
          sixMatchWinAmt:     JSON.parse(res[i].args.sixMatchwinAmt),//note lower case W, made solicism in smart contract!
          atTime:             moment.unix(JSON.parse(res[i].args.atTime)).format('dddd, MMMM Do, YYYY HH:mm:ss')
        }
        resArr.push(obj)
      if(i + 1 == res.length) return resolve(resArr)
      }
    })
  })
}
