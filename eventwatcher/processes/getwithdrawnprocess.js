const mongo   = require('../modules/mongo')
    , utils   = require('../modules/utils')
    , getWdEv = require('../modules/getwithdrawevent')

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
      return getWdEv(_period, block)
      .then(arr => {
        if (arr == null){
          process.send(`No withdrawal events found in the last ${_period} hour period.`)
          return process.send('Complete!')
        }
        let promises = []
        for (let i = 0; i < arr.length; i++){promises.push(mongo.updateOnWithdraw(arr[i]))}
        return Promise.all(promises)
        .then(proms => {//the mongo function doesn't return anything, and it deals with any errors...
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
