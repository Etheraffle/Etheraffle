const cron                = require('node-cron')
    , utils               = require('./modules/utils')
    , web3Connect         = require('./modules/getweb3')
    , getMissing          = require('./processes/getmissinginit')
    , withdrawal          = require('./eventhandlers/withdrawal')
    , prizePools          = require('./eventhandlers/prizepools')
    , winningNums         = require('./eventhandlers/winningnums')
    , ticketBought        = require('./eventhandlers/ticketbought')
    , getWithdrawn        = require('./processes/getwithdrawninit')
    , getOrac             = require('./processes/getweeklyeventsinit')
    , paused              = require('./eventhandlers/functionspaused')
    , web3                = web3Connect.web3
    , etheraffle          = web3Connect.etheraffle
    , withdrawEvent       = etheraffle.LogWithdraw()
    , ticketBoughtEvent   = etheraffle.LogTicketBought()
    , winningNumbersEvent = etheraffle.LogWinningNumbers()
    , functionsPaused     = etheraffle.LogFunctionsPaused()
    , prizePoolsEvent     = etheraffle.LogPrizePoolsUpdated()
/*
Notes:
If this is run as a cluster, the cron jobs will get executed for each cluster there is running. 
So if needs be, function them out to their own file!
All process.exit points also send an email warning of what happened.
*/
//process.on('warning', e => console.warn(e.stack))
process.on('unhandledRejection', err => console.log('unhandledRejection', err.stack))//TODO: remove!
require('events').EventEmitter.defaultMaxListeners = 30
/* Test for live eth connection */
const block = web3.eth.getBlockNumber((err, res) => {
  return !err ? console.log(`Block: ${res} on ${utils.getTime()}`) : console.log(`Error retrieving block number: ${err}`)
})
/* The Event Watchers */
ticketBoughtEvent.watch((err, res) => {
  if (err) return utils.errorHandler("ticketBoughtEvent", "eventwatcher", res, err), process.exit(1)
  return ticketBought(res)
})
winningNumbersEvent.watch((err, res) => {
  if (err) return utils.errorHandler("winningNumbersEvent", "API", "None", err), process.exit(1)
  return winningNums(res)
})
withdrawEvent.watch((err, res) => {
  if (err) return utils.errorHandler("withdrawEvent", "API", "None", err), process.exit(1)
  return withdrawal(res)
})
functionsPaused.watch((err, res) => {
  if (err) return utils.errorHandler("functionsPaused", "API", "None", err), process.exit(1)
  return paused(res)
})
prizePoolsEvent.watch((err, res) => {//TODO: what is this function for?
  if (err) return utils.errorHandler("prizePoolsEvent", "API", "None", err), process.exit(1)
  return prizePools(res)
})
/* Cron Jobs */
/* Retrieves any missing entries, runs every 10 minutes starting at 0 mins past the hour */
cron.schedule('0-59/10 * * * *', () => {
  console.log(`Cron: getMissingProcess() Begun on ${utils.getTime()}`)
  return getMissing.init("./etheraffle/eventwatcher/processes/getmissingprocess")
})
/* Retrieves any manual withdrawals, runs every 10 minutes starting at 5 mins past the hour */
cron.schedule('5-59/10 * * * *', () => {
  console.log(`Cron: getWithdrawnProcess() Begun on ${utils.getTime()}`)
  return getWithdrawn.init(1,'./etheraffle/eventwatcher/processes/getwithdrawnprocess')
})
/* Retrieves any weekly events, runs 1am Sunday morning. */
cron.schedule('0 1 * * 0', () => {
  console.log(`Cron: getOraclizeEventsProcess() Begun on ${utils.getTime()}`)
  return getOrac.init(7, "./etheraffle/eventwatcher/processes/getweeklyeventsprocess")
})
