const moment = require('moment'),
      apikeys = require('./apikeys'),
      mailgun = require('mailgun-js')({apiKey: apikeys.mailgun, domain: apikeys.myDomain})

/* Get human readable timestamp */
const getTime = function(){
  return moment().format('dddd, MMMM Do, YYYY HH:mm:ss')
}

/* Get UNIX Timestamp */
const getTimeStamp = function(){
  return parseInt(moment.utc().format("X"), 10)
}

/* Generic error handler, sends emails re the errors */
const errorHandler = function(_funcName, _fileName, _funcData, _err){
  let subject = "Error in " + _funcName + " function in file " + _fileName + "!"
  let body = "On: " + getTime() + "<br><br>Error: " + _err + "<br><br>Function Data: " + JSON.stringify(_funcData)
  return sendEmail(subject,body)
}

/* Get week number based on Etheraffle's birthday */
const getWeekNo = function(){
  const birthday = 1500249600, weekDur = 604800, raffleEndTime = 500400
  let week = Math.trunc((moment.utc().format("X") - birthday) / weekDur)
  if(moment.utc() - ((week * weekDur) + birthday) > raffleEndTime) week++
  return week
}

/* Mail Gun */
const sendEmail = function(_subjectStr, _htmlStr, _address){
  return new Promise ((resolve, reject) => {
    let _add = _address == undefined ? 'admin' : _address
    console.log("Send email triggered: ", _subjectStr, "Body: ", _htmlStr)
    const emailData = {
      from: "Etheraffle API <api@etheraffle.com>",
      to: _add + "@etheraffle.com",
      subject: _subjectStr,
      html: _htmlStr
    }
    mailgun.messages().send(emailData, (err, body) => {
      if(!err) return resolve(true)
      console.log("Error sending email! Subject: ", _subjectStr, ", body:", _htmlStr, ", error: ", err.stack)
      return resolve(false)
    })
  })
}

module.exports = {
  getTime: getTime,
  getTimeStamp: getTimeStamp,
  sendEmail: sendEmail,
  getWeekNo: getWeekNo,
  errorHandler: errorHandler
}
