const moment = require('moment')
    , utils  = require('../modules/utils')

module.exports = _data => {
  let time     = moment.unix(JSON.parse(_data.args.atTime)).format('dddd, MMMM Do, YYYY h:mm:ss A'),
      subject  = 'WARNING - Contract functions paused!'
  switch(JSON.parse(_data.args.identifier)) {
    case 1:
      body = `Oraclize total was greater than the prize pool!<br><br>At: ${time}`
      break
    case 2:
      body = `Number of winners string was fewer than 4 long when setting payouts!<br><br>At: ${time}`
      break
    case 3:
      body = `Raffle unclaimed prize pool was larger than available prize pool when setting payouts!<br><br>At: ${time}`
      break
    case 4:
      body = `New raffle number was same as the previous raffle number in newRaffle function!<br><br>At: ${time}`
      break
    case 5:
      body = `Withdrawn prize was greater than that raffle\'s unclaimed prize pool!<br><br>At: ${time}`
      break
    case 6:
      body = `Profit in disbursal was greater than available prize pool!<br><br>At: ${time}`
  }
  return utils.sendEmail(subject, body)
}
