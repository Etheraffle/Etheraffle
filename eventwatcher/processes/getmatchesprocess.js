//const lupus = require('lupus')
const mongo     = require('../modules/mongo')
    , utils     = require('../modules/utils')
    , getTktPrc = require('../modules/get_tkt_price')
    , getEntry  = require('../modules/getsingleentry')

process.on('message', (wObj) => {
  start(wObj)
})
process.on('unhandledRejection', err => {//catches errors in my catches :/
  console.log('unhandledRejection', err.stack)//TODO: remove!
})
function start(_wObj) {
  return mongo.init()
  .then(result => {
    if (!result) throw new Error('Mongo init() returned false!')
    return mongo.getEntriesArr(_wObj.raffleID)
    .then(entriesArr => {
      _wObj['entriesArr'] = entriesArr == null  ? [] : entriesArr
      return _wObj.numEntries > 0 ? getOrderedEntries(_wObj) : captureZeroDetails(_wObj)
    })
  }).catch(err => {
    utils.errorHandler('start', 'getMatches', _wObj, err)
    process.send('Errored!')
  })
}
/* Capture non-entered raffle details into db */
function captureZeroDetails(_wObj) {
  _wObj['matches'] = [0,0,0,0,0,0,0]//set zeroed out non-existent details...
  _wObj['winningAmounts'] = [0,0,0,0,0,0,0]
  return mongo.updateResults(_wObj)
  .then(res => {
    if (!res) throw new Error('Mongo update returned false!')
    console.log('Zero details captured successfully via child process.')
    return process.send('Complete')
  }).catch(err => {
    utils.errorHandler('captureZeroDetails', 'getMatches', _wObj, err)
    process.send('Errored!')
  })
}
/* Capture raffle details into db */
function captureRaffleDetails(_wObj) {
  return getMatchesArr(_wObj)
  .then(matchesArr => {
    _wObj['matches'] = matchesArr
    console.log(`Get matches array in captureRaffleDetails: ${matchesArr}, on ${utils.getTime()}`)
    return getWinningAmounts(matchesArr, _wObj.prizePool)
    .then(winningAmounts => {
      _wObj['winningAmounts'] = winningAmounts
      return mongo.updateResults(_wObj)
      .then(result => {
        if (!result) throw new Error('Error: In captureRaffleDetails,  updateResults() returned false!')
        console.log('Raffle details captured succesfully via child process.')
        return process.send('Complete')
      })
    })
  }).catch(err => {
    utils.errorHandler('captureRaffleDetails', 'getMatches', _wObj, err)
    process.send('Errored!')
  })
}
/* Orders entries array via their baked in entry number */
function getOrderedEntries(_wObj) {
  const missingNo = [], orderedEntries = new Array(_wObj.numEntries).fill(null)
  for (let i = 0; i < _wObj.entriesArr.length; i++) {//Create array with entries in their entryNum-1 index position...
    orderedEntries[(_wObj.entriesArr[i][6]) - 1] = _wObj.entriesArr[i]
  }
  for (let i = 0; i < _wObj.numEntries; i++) {//Create array containing entryNums of absent entries...
    if (orderedEntries[i] == null) missingNo.push(i + 1)//Plus one ∴ array contains entryNums, not indices!
  }
  return missingNo.length == 0 ? captureRaffleDetails(_wObj) : getMissingEntries(_wObj, missingNo)
}
/* Get missing entries via past events from smart contract*/
function getMissingEntries(_wObj, _missingNo) {
  const promises = [], promRes = []
  return utils.getBlockNum()
  .then(blockStart => {
    for (let i = 0; i < _missingNo.length; i++) {
      promises.push(getEntry(blockStart, _wObj.raffleID, _missingNo[i]))
    }
    return Promise.all(promises)
    .then(promArr => {
      for (let i = 0; i < promArr.length; i++) {//remove any nulls...
        if (promArr[i] != null) promRes.push(promArr[i])
      }
      return mongo.bulkUpdate(promRes)
      .then(res => {
        if (!res) throw new Error('Bulk updates function in Mongo didn\'t return true!')
        return mongo.getEntriesArr(_wObj.raffleID)
        .then(newEntriesArr => {
          //if db returns null for some reason, no error thrown and the cycle is started again...
          //need to rethink, and handle this error somehow!
          if (newEntriesArr != null) _wObj['entriesArr'] = newEntriesArr
          return newEntriesArr.length != _wObj.numEntries ? getOrderedEntries(_wObj) : captureRaffleDetails(_wObj)
        })
      })
    })
  }).catch(err => {
    utils.errorHandler('getMissingEntries', 'getMatches', _wObj + _missingNo, err)
    process.send('Errored!')
  })
}
/* Build array of number of 6 match wins, 5 match wins etc */
function getMatchesArr(_wObj) {
  return new Promise ((resolve, reject) => {
    const matchesArr = [0,0,0,0,0,0,0]
    for (let n = 0; n < _wObj.entriesArr.length; n++) {
      let matches = 0
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          if (_wObj.entriesArr[n][i] == _wObj.winningNumbers[j]) {
            matches++
            break
          }
        }
      }
      matchesArr[matches]++
      if (n == _wObj.entriesArr.length - 1) {
        let sum = matchesArr.reduce((a, b) => a + b, 0)
        return _wObj.entriesArr.length == sum ? resolve(matchesArr) : resolve([0,0,0,0,0,0,0])
      }
    }
  })
}
/* Get matches array using an asynchronous, non-blocking Lupus loop - SLOW! */
function getMatchesArrLupus(_wObj) {
  return new Promise ((resolve, reject) => {
    var matchesArr = [0,0,0,0,0,0,0]
    //Lupus allows very large async looping...
    lupus(0, _wObj.entriesArr.length, function(n) {
      var matches = 0
      for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
          if (_wObj.entriesArr[n][i] == _wObj.winningNumbers[j]) {
            matches++
            break
          }
        }
      }
      matchesArr[matches]++
      //console.log('Matches array in lupus loop: ', matchesArr)
    },function() {//after loop finished...
      let sum = matchesArr.reduce((a, b) => a + b, 0)
      if (_wObj.entriesArr.length == sum) {
        return resolve(matchesArr)
      } else {
        return resolve([0,0,0,0,0,0,0])
      }
    })
  })
}
/* Calculate prizes based on number of winners in each tier */
const getWinningAmounts = (_matches, _prizePool) => {
  //let getTktPrc = () => Promise.resolve(3000000000000000) // For unit testing so I don't need web3 TODO: comment out!
  return getTktPrc().then(tktPrice => {
    return new Promise((resolve, reject) => {
      const pctOfPool = [0, 0, 0, 520, 114, 47, 319] // ppt
          , odds = [0, 0, 0, 56, 1032, 54200, 13983816] // Rounded down to nearest whole number
          , oddsSingle   = (_matchesIndex) => { return tktPrice * odds[_matchesIndex] }
          , oddsTotal    = (_numWinners, _matchesIndex) => { return oddsSingle(_matchesIndex) * _numWinners }
          , splitsTotal  = (_numWinners, _matchesIndex) => { return splitsSingle(_numWinners, _matchesIndex) * _numWinners }
          , splitsSingle = (_numWinners, _matchesIndex) => { return (_prizePool * pctOfPool[_matchesIndex]) / (_numWinners * 1000) }
          , payOuts = _matches.map((e,i) => i < 3 ? 0 : e == 0 ? 0 : oddsTotal(_matches[i],i) <= splitsTotal(_matches[i],i) ? oddsSingle(i) : splitsSingle(_matches[i],i))
          , total = payOuts.reduce((acc,e,i) => acc + (e * _matches[i]))
      //console.log('payOuts arr:', payOuts, ', total:', total)
      return total <= _prizePool ? resolve(payOuts) : reject(new Error('Sum of wins greater than prize pool!'))
    })
  }).catch(err => utils.errorHandler('getWinningAmounts', 'get_matches_process', `matchesArr: ${_matches} & prizePool: ${_prizePool}`, err))
}