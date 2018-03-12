const getMatches = require('../processes/getmatchesinit')

module.exports = (_data) => {
  const winningNums = [0,0,0,0,0,0],
        raffleID    = JSON.parse(_data.args.forRaffle),
        numEntries  = JSON.parse(_data.args.numberOfEntries),
        prizePool   = JSON.parse(_data.args.currentPrizePool)
  for(let i = 0; i < 6; i++){winningNums[i] = JSON.parse(_data.args.wNumbers[i])}
  const obj = {
    raffleID: raffleID,
    winningNumbers: winningNums,
    numEntries: numEntries,
    prizePool: prizePool
  }
  return getMatches.init(obj, './etheraffle/eventwatcher/processes/getmatchesprocess')
}
