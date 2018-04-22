const utils    = require('../modules/utils')
    , getQuery = require('../modules/getquerysentevent')
    , getRecl  = require('../modules/getreclaimedevent')
    , getWNums = require('../modules/getwinningnumbersevent')
    , getFunds = require('../modules/getfundsdisbursedevent')
    , getCBack = require('../modules/getoraclizecallbackevent')
    , getPAdd  = require('../modules/getprizepooladditionevent')
    , getPPUp  = require('../modules/getprizepoolsupdatedevent')
process.on('message', ([_raffleID, _period]) => {
  start(_raffleID, _period)
})
process.on('unhandledRejection', err => {
  console.log('unhandledRejection', err.stack)//TODO: remove!
})
const start = (_raffleID, _period) => {
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
    .then(all => {
      let arr  = all.map(x => { return x == null ? `None found in the last ${_period} days!` : JSON.stringify(x).replace(/,/g,'<br/>') })
        , subj = `Weekly events from the past: ${_period} days for raffleID: ${_raffleID}`,
          body = `<b>Queries Sent: </b><br><br> ${arr[0]}
                  <b><br><br>Callbacks Received: </b><br><br> ${arr[1]}
                  <b><br><br>Winning Numbers: </b><br><br> ${arr[5]}
                  <b><br><br>PrizePools Updated: </b><br><br> ${arr[6]}
                  <b><br><br>Funds Disbursed: </b><br><br> ${arr[2]}
                  <b><br><br>Funds Reclaimed: </b><br><br> ${arr[3]}
                  <b><br><br>Prize Pool Additions: </b><br><br> ${arr[4]}`
      utils.sendEmail(subj, body, 'weekly').then(res => {
        return res ? process.send('Complete!') : process.send('Errored - send email returned false!')
      })
    })
  }).catch(err => {
    console.log('Error in getWeeklyEventsProcess: ', err)
    utils.errorHandler('start', 'getWeeklyEventsProcess', `RaffleID: ${_raffleID}`, err)
    return process.send('Errored!')
  })
}
