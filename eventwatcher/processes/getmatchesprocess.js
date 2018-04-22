//const lupus = require('lupus')
const mongo    = require('../modules/mongo')
    , utils    = require('../modules/utils')
    , getEntry = require('../modules/getsingleentry')

process.on('message', (wObj) => {
  start(wObj)
})
process.on('unhandledRejection', err => {//catches errors in my catches :/
  console.log('unhandledRejection', err.stack)//TODO: remove!
})
function start(_wObj) {
  return mongo.init()
  .then(result => {
    if (result != true) throw new Error('Mongo init() returned false!')
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
    if (res != true) throw new Error('Mongo update returned false!')
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
        if (result != true) throw new Error('Error: In captureRaffleDetails,  updateResults() returned false!')
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
        if (res != true) throw new Error('Bulk updates function in Mongo didn\'t return true!')
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
/* Build array of number of 6match wins, 5 match wins etc */
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
function getWinningAmounts(_matchesArr, _prizePool) {
  return new Promise ((resolve, reject) => {//soldity truncates division...
    const percentOfPool = [520, 114, 47, 319]//ppt
    const winningAmounts = [0,0,0,0,0,0,0]
    if (_matchesArr[6] != 0) winningAmounts[6] = Math.trunc((_prizePool * percentOfPool[3]) / (1000 * _matchesArr[6]))
    if (_matchesArr[5] != 0) winningAmounts[5] = Math.trunc((_prizePool * percentOfPool[2]) / (1000 * _matchesArr[5]))
    if (_matchesArr[4] != 0) winningAmounts[4] = Math.trunc((_prizePool * percentOfPool[1]) / (1000 * _matchesArr[4]))
    if (_matchesArr[3] != 0) winningAmounts[3] = Math.trunc((_prizePool * percentOfPool[0]) / (1000 * _matchesArr[3]))
    let sum =
    (
    (winningAmounts[6] * _matchesArr[6]) +
    (winningAmounts[5] * _matchesArr[5]) +
    (winningAmounts[4] * _matchesArr[4]) +
    (winningAmounts[3] * _matchesArr[3])
    )
    console.log(`Sum: ${sum}`)
    return sum <= _prizePool ? resolve(winningAmounts) : resolve([0,0,0,0,0,0,0,0])
  })
}
 /* Psuedo unit test....
  getWinningAmounts([0,0,0,10,5,2,1],1000000000000000000).then(res => console.log(res))
  returns: [0,0,0,52000000000000000,22800000000000000,23500000000000000,319000000000000000 ]
  Sum: 1000000000000000000


  getWinningAmounts([0,0,0,1,0,0,0],2000000000000000000).then(res => console.log(res))
  returns [ 0, 0, 0, 1040000000000000000, 0, 0, 0 ] // which is BAD hence the switch of method!
  Sum: 1040000000000000000
  */
}

// WIP to bring in line with solidity!
const getWinAmts = (_matchesArr, _prizePool) => {
  return new Promise((resolve, reject) => {
    const pctOfPool = [0, 0, 0, 520, 114, 47, 319] // ppt
        , odds = [0, 0, 0, 56, 1032, 54200, 13983816] // Rounded down to nearest whole number
        , winAmts = _matchesArr.map((x,i) => { return i < 3 ? 0 : x == 0 ? 0 : Math.trunc((_prizePool * pctOfPool[i]) / (1000 * _matchesArr[i]))})
        , sum = winAmts.reduce((acc, val, i) => { return acc + (val * _matchesArr[i])})
        console.log(`Sum: ${sum}`)
        return sum <= _prizePool ? resolve(winAmts) : reject(new Error('Sum of wins greater than prize pool!'))
  })
}
const oddsTotal = (_numWinners, _matchesIndex) => {
  return oddsSingle(_matchesIndex) * _numWinners;
}
const splitsTotal = (_numWinners, _matchesIndex) => {
  return splitsSingle(_numWinners, _matchesIndex) * _numWinners;
}
const oddsSingle = (_matchesIndex) => {
  return tktPrice * odds[_matchesIndex];
}
const splitsSingle = (_numWinners, _matchesIndex) => {
  return (prizePool * pctOfPool[_matchesIndex]) / (_numWinners * 1000);
}

/* Batch version of getMatches - UNFINISHED! */
/*
//The getMatches function seems to crash after a million or so goes? Chunk it up? Refeed it the previous matchesArr to continue where it left off? Maybe store the chunks then pull them out & match individually?
function batchMatches(_wObj) {
  return new Promise((resolve, reject) => {
    var chunk = 100000
    var iterations = Math.trunc(_wObj.entriesArr.length / chunk)
    if (_wObj.entriesArr.length % chunk > 0 )
      iterations += 1
    var pieces = []
    for (var i = 0; i < iterations; i++) {
      //chunk up array and store pieces in pieces..
      pieces.push(_wObj.entriesArr.slice((i * chunk), ((i * chunk) + chunk)))
    }
    console.log('Length: ', pieces.length)

    function sequentialPromises(arr, index = 0) {
      var matches = [0,0,0,0,0,0,0]
      var time = 0;
      if (index >= arr.length) {
        return Promise.resolve()
      } else {
        time = utils.getTimeStamp()
        return getMatchesArr(arr[index], _wObj.winningNumbers)
        .then(r => {
          console.log
          (
            'Got matches: ', r,
            ', from iteration: ', index + 1,
            ' of: ', arr.length,
            '. Time taken: ', (utils.getTimeStamp() - time)
          )
          return sequentialPromises(arr, index + 1)
        })
      }
    }
    /*
    sequentialPromises(pieces)
    .then(() => {
      console.log('done')
      return resolve()
    })
  })
  */
/*
    sequentialPromises(pieces)
    //how does .then work here? I'm confused!!
    .then(results => {
      var complete = []
      //Check each piece's match array totals the number of arrays thrown at it...
      for (var i = 0; i < results.length; i++) {
        let sum = results[i].reduce((a, b) => a + b, 0)//WILL FAIL IF PROMISEREPEAT TIMES OUT!
        if (sum == pieces[i].length) {
          complete.push(results[i])
        } else {
          complete.push([0,0,0,0,0,0,0])//push empty array so final count will not error, but won't pass
        }
      }
      //if (complete.length == iterations) {
      //sum the individual match arrays to a final one...
      var finalMatches = [0,0,0,0,0,0,0]
      for (var i = 0; i < complete.length; i++) {
        for (var j = 0; j < finalMatches.length; j++) {
          finalMatches[j] += complete[i][j]
        }
      }
      let sum = finalMatches.reduce((a, b) => a + b, 0)
      if (_wObj.entriesArr.length == sum) {
        return resolve(finalMatches)
      } else {//
        //handle this better? start again? I don't know?
        return reject([0,0,0,0,0,0,0])
      }
    })
  }).catch(err => {
    utils.errorHandler('batchMatches', 'getMatches', _wObj, err)
    process.send('Errored!')
  })
}
*/
