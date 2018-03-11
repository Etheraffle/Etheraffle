const cron                = require('node-cron'),
      utils               = require('./modules/utils'),
      getMissing          = require('./processes/getmissinginit'),
      getWithdrawn        = require('./processes/getwithdrawninit'),
      getOrac             = require('./processes/getweeklyeventsinit')
      ticketBought        = require('./eventhandlers/ticketbought'),
      winningNums         = require('./eventhandlers/winningnums'),
      prizePools          = require('./eventhandlers/prizepools'),
      withdrawal          = require('./eventhandlers/withdrawal'),
      paused              = require('./eventhandlers/functionspaused'),
      web3Connect         = require('./modules/getweb3'),
      web3                = web3Connect.web3,
      etheraffle          = web3Connect.etheraffle,
      ticketBoughtEvent   = etheraffle.LogTicketBought(),
      winningNumbersEvent = etheraffle.LogWinningNumbers(),
      prizePoolsEvent     = etheraffle.LogPrizePoolsUpdated(),
      withdrawEvent       = etheraffle.LogWithdraw(),
      functionsPaused     = etheraffle.LogFunctionsPaused()
/*
Notes:

If this is run as a cluster, the cron jobs will get executed for each cluster there is running. So if needs be, function them out to their own file!

All process.exit points also send an email warning of what happened.

*/
//process.on('warning', e => console.warn(e.stack))
process.on('unhandledRejection', err => console.log('unhandledRejection', err.stack))//TODO: remove!
require('events').EventEmitter.defaultMaxListeners = 15
//require('events').EventEmitter.prototype._maxListeners = 100;
//process.setMaxListeners(Infinity)
//process.setMaxListeners(0)
//emitter.setMaxListeners(Infinity)

/* Email alert when proces starts... */
/*
const init = () => {
  utils.sendEmail('Eventwatcher process powered on!', 'At time: ' + utils.getTime())
}
*/

/* Test for live eth connection */
const block = web3.eth.getBlockNumber((err, res) => {
  return !err ? console.log("Block:",res,"on",utils.getTime()) : console.log("Error retrieving block number: ", err)
})

/* The Event Watchers */
ticketBoughtEvent.watch((err, res) => {
  if(err) return utils.errorHandler("ticketBoughtEvent", "eventwatcher", res, err), process.exit(1)
  return ticketBought(res)
})
winningNumbersEvent.watch((err, res) => {
  if(err) return utils.errorHandler("winningNumbersEvent", "API", "None", err), process.exit(1)
  return winningNums(res)
})
withdrawEvent.watch((err, res) => {
  if(err) return utils.errorHandler("withdrawEvent", "API", "None", err), process.exit(1)
  return withdrawal(res)
})
functionsPaused.watch((err, res) => {
  if(err) return utils.errorHandler("functionsPaused", "API", "None", err), process.exit(1)
  return paused(res)
})
prizePoolsEvent.watch((err, res) => {//TODO: what is this function for?
  if(err) return utils.errorHandler("prizePoolsEvent", "API", "None", err), process.exit(1)
  return prizePools(res)
})
/* Cron Jobs */
/* Retrieves any missing entries once a day @ 5:30 am */
cron.schedule('30 5 * * *', function() {
  console.log("Cron: getMissingProcess() Begun on", utils.getTime())
  return getMissing.init()
})
/* Retrieves any manual withdrawals, runs every 3 hours */
//cron.schedule('0 */3 * * *', function() {
cron.schedule('10 9 * * *', function() {
  console.log("Cron: getWithdrawnProcess() Begun on", utils.getTime())
  return getWithdrawn.init(6,'./processes/getwithdrawnprocess')
})
/* Retrieves any weekly events, runs 5am Sunday morning. */
cron.schedule('0 5 * * 0', function() {
  console.log("Cron: getOraclizeEventsProcess() Begun on", utils.getTime())
  return getOrac.init()
})
