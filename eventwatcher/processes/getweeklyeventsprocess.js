const utils    = require('../modules/utils')
    , getQuery = require('../modules/getquerysentevent')
    , getCBack = require('../modules/getoraclizecallbackevent')
    , getFunds = require('../modules/getfundsdisbursedevent')
    , getRecl  = require('../modules/getreclaimedevent')
    , getPAdd  = require('../modules/getprizepooladditionevent')
    , getWNums = require('../modules/getwinningnumbersevent')
    , getPPUp  = require('../modules/getprizepoolsupdatedevent')

process.on('message', ([_raffleID, _period]) => {
  start(_raffleID, _period)
})
process.on('unhandledRejection', err => {
  console.log('unhandledRejection', err.stack)//TODO: remove!
})

function start(_raffleID, _period) {
  return utils.getBlockNum()
  .then(block => {
    let p1 = getQuery(block, _period)
      , p2 = getCBack(block, _period, _raffleID)
      , p3 = getFunds(block, _period)
      , p4 = getRecl(block, _period)
      , p5 = getPAdd(block, _period)
      , p6 = getWNums(block, _period)
      , p7 = getPPUp(block, _period)
    return Promise.all([p1,p2,p3,p4,p5,p6,p7])
    .then(([r1,r2,r3,r4,r5,r6,r7]) => {
      let qs   = r1 == null ? 'None found in last ' + _period + ' days!' : JSON.stringify(r1),
          cb   = r2 == null ? 'None found in last ' + _period + ' days!' : JSON.stringify(r2),
          fd   = r3 == null ? 'None found in last ' + _period + ' days!' : JSON.stringify(r3),
          rc   = r4 == null ? 'None found in last ' + _period + ' days!' : JSON.stringify(r4),
          pp   = r5 == null ? 'None found in last ' + _period + ' days!' : JSON.stringify(r5),
          wn   = r6 == null ? 'None found in last ' + _period + ' days!' : JSON.stringify(r6),
          up   = r7 == null ? 'None found in last ' + _period + ' days!' : JSON.stringify(r7),
          subj = 'Weekly events from the past: ' + _period + ' days for raffleID: ' + _raffleID,
          body = '<b>Queries Sent: </b><br><br>' + qs +
                 '<b><br><br>Callbacks Received: </b><br><br>' + cb +
                 '<b><br><br>Winning Numbers: </b><br><br>' + wn +
                 '<b><br><br>PrizePools Updated: </b><br><br>' + up +
                 '<b><br><br>Funds Disbursed: </b><br><br>' + fd +
                 '<b><br><br>Funds Reclaimed: </b><br><br>' + rc +
                 '<b><br><br>Prize Pool Additions: </b><br><br>' + pp
      utils.sendEmail(subj, body, 'weekly').then(res => {
        if(res) return process.send('Complete!')
        process.send('Send email returned false!')
        return process.send('Errored!')
      })
    })
  }).catch(err => {
    console.log('Error in getWeeklyEventsProcess: ', err)
    utils.errorHandler('start', 'getWeeklyEventsProcess', 'RaffleID : ' + _raffleID, err)
    return process.send('Errored!')
  })
}
