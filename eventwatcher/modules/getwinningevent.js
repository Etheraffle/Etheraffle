const getWeb3 = require('./getweb3')
/* Period in days, assumes block time of ~ 15s */
module.exports = (_latestBlock, _raffleID, _period) => {
  let block = _latestBlock - Math.trunc((_period * 24 * 60 * 60) / 15)
  return new Promise ((resolve, reject) => {
    return getWeb3.etheraffle.LogWinningNumbers({forRaffle: _raffleID},{fromBlock: block, toBlock: "latest"}).get((err,res) => {
      if(err || res.length == 0 || JSON.parse(res[0].args.forRaffle) != _raffleID) return resolve(null)
      const winningNumbers = [0,0,0,0,0,0]
      for(let i = 0; i < 6; i++){winningNumbers[i] = JSON.parse(res[0].args.wNumbers[i])}
      const numEntries = JSON.parse(res[0].args.numberOfEntries),
            prizePool  = JSON.parse(res[0].args.currentPrizePool),
            obj        = {
              raffleID:       _raffleID,
              winningNumbers: winningNumbers,
              numEntries:     numEntries,
              prizePool:      prizePool
            }
      return resolve(obj)
    })
  })
}
