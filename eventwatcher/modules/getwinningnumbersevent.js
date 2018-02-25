const moment  = require('moment'),
      getWeb3 = require('./getweb3')

//event LogWinningNumbers(uint indexed forRaffle, uint numberOfEntries, uint[] wNumbers, uint currentPrizePool, uint randomSerialNo, uint atTime);
/* Period in days, assumes block time of ~ 15s */
module.exports = function(_latestBlock, _period){
  let block = _latestBlock - Math.trunc((_period * 24 * 60 * 60) / 15)
  return new Promise ((resolve, reject) => {
    return getWeb3.etheraffle.LogWinningNumbers({},{fromBlock: block, toBlock: "latest"}).get((err,res) => {
      if(err || res.length == 0) return resolve(null)
      const resArr = []
      for(i = 0; i < res.length; i++) {
        obj = {
          wNumbers:     res[i].args.wNumbers,
          forRaffle:    JSON.parse(res[i].args.forRaffle),
          numEntries:   JSON.parse(res[i].args.numberOfEntries),
          prizePool:    JSON.parse(res[i].args.currentPrizePool),
          randomSerial: JSON.parse(res[i].args.randomSerialNo),
          atTime:       moment.unix(JSON.parse(res[i].args.atTime)).format('dddd, MMMM Do, YYYY HH:mm:ss')
        }
        resArr.push(obj)
      if(i + 1 == res.length) return resolve(resArr)
      }
    })
  })
}