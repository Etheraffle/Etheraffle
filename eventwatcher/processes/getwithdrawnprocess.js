const mongo   = require('../modules/mongo')
    , utils   = require('../modules/utils')
    , getWdEv = require('../modules/getwithdrawevent')
    , getFree = require('../modules/get_free_go_event')

process.on('message', period => {
  start(period)
})
process.on('unhandledRejection', err => {//catches errors in catches :p
  console.log('unhandledRejection', err.stack)//TODO: remove!
})

function start(_period) {
  return mongo.init()
  .then(bool => {
    if (bool != true) throw new Error("Mongo init() returned false!")
    return utils.getBlockNum()
    .then(block => {
      let p1 = getWdEv(_period, block)
        , p2 = getFree(_period, block)
      Promise.all(([p1,p2])).then(([r1,r2]) => {
        if (!r1 && !r2) {
          process.send(`No withdrawal events found in the last ${_period} hour period.`)
          return process.send('Complete!')
        }
        let arr = !r1 ? r2 : !r2 ? r1 : r1.concat(r2) //avoids concatting a null if one array is missing
        let promises = []
        for (let i = 0; i < arr.length; i++) {promises.push(mongo.updateOnWithdraw(arr[i]))}
        return Promise.all(promises)
        .then(proms => { // The mongo function doesn't return anything, and it deals with any errors...
          process.send(`All ${proms.length} withdrawal events found from past ${_period} hours sent to Mongo for processing.`)
          return process.send('Complete!')
        })
      })
    })
  }).catch(err => {
    console.log(`Error in getWithdrawnProcess start: ${err}`)
    utils.errorHandler('start', 'getWithdrawnProcess', `RaffleID: ${_raffleID}`, err)
    return process.send('Errored!')
  })
}
