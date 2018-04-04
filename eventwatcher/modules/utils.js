const moment  = require('moment')
    , apikeys = require('./apikeys')
    , getWeb3 = require('./getweb3')
    , mailgun = require('mailgun-js')({apiKey: apikeys.mailgun, domain: apikeys.myDomain})

/* (Human Readable Timestamp */
const getTime = () => {
  return moment().format('dddd, MMMM Do, YYYY HH:mm:ss')
}

/* Get UNIX Timestamp */
const getTimeStamp = () => {
  return parseInt(moment.utc().format("X"), 10)
}

/* Error Handler */
const errorHandler = (_funcName, _fileName, _funcData, _err) => {
  let subject = "Error in " + _funcName + " function in file " + _fileName + "!"
  let body = "On: " + getTime() + "<br><br>Error: " + _err + "<br><br>Function Data: " + JSON.stringify(_funcData)
  sendEmail(subject,body)
}

/* Get Block Number */
const getBlockNum = () => {
  return new Promise((resolve, reject) => {
    getWeb3.web3.eth.getBlockNumber((err, res) => {
      return !err ? resolve(res) : reject(err)
    })
  })
}

/* Get Week Number (as defined by Etheraffle's birthday!)*/
const getWeekNo = () => {
  const birthday = 1500249600, weekDur = 604800, raffleEndTime = 500400
  let week = Math.trunc((moment.utc().format("X") - birthday) / weekDur)
  if (moment.utc().format('X') - ((week * weekDur) + birthday) > raffleEndTime) week++
  return week
}

/* Mail Gun */
const sendEmail = (_subjectStr, _htmlStr, _address) => {
  return new Promise((resolve,reject) => {
    let _add = _address == undefined ? 'admin' : _address
    console.log("Send email triggered! Subject: ", _subjectStr, "Body: ", _htmlStr)
    const emailData = {
      from: "Etheraffle API <api@etheraffle.com>",
      to: _add + "@etheraffle.com",
      subject: _subjectStr,
      html: _htmlStr
    }
    mailgun.messages().send(emailData, (err, body) => {
      if (!err) return resolve(true)
      console.log("Error sending email! Subject: ", _subjectStr, ", body:", _htmlStr, ", error: ", err)
      return resolve(false)
    })
  })
}

module.exports = {
  getTime:      getTime,
  sendEmail:    sendEmail,
  getWeekNo:    getWeekNo,
  getBlockNum:  getBlockNum,
  getTimeStamp: getTimeStamp,
  errorHandler: errorHandler
}
