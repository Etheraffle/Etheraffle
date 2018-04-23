const assert     = require('assert')
    //, getMatches = require('../getmatchesprocess')

const runTests = () => {
  //run tests....
}
// Psuedo Unit tests for getWinningAmounts:
// getWinningAmounts([0,0,0,1,0,0,0],2000000000000000000).then(res => console.log(res))
// = payouts arr: [0,0,0,168000000000000000,0,0,0], total: 168000000000000000 - CORRECT! (using odds not splits!)
//
// getWinningAmounts([0,0,0,10,5,2,1],1000000000000000000).then(res => console.log(res))
// = payOuts arr: [0,0,0,52000000000000000,22800000000000000,23500000000000000,319000000000000000], total: 1000000000000000000 - CORRECT (using splits not odds)
module.exports = runTests()
