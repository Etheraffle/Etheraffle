const moment = require('moment')

module.exports = _data => {
  const obj = {
    raffleID:           JSON.parse(_data.args.forRaffle),
    sixMatchWin:        JSON.parse(_data.args.sixMatchwinAmt),
    fiveMatchWin:       JSON.parse(_data.args.fiveMatchWinAmt),
    fourMatchWin:       JSON.parse(_data.args.fourMatchWinAmt),
    threeMatchWin:      JSON.parse(_data.args.threeMatchWinAmt),
    prizePool:          JSON.parse(_data.args.newMainPrizePool),
    unclaimedPrizePool: JSON.parse(_data.args.unclaimedPrizePool),
    atTime:             moment.unix(JSON.parse(_data.args.atTime)).format('dddd, MMMM Do, YYYY h:mm:ss A')
  }
  return console.log("PrizePool event watcher: ", obj)
}
