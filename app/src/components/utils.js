const moment = require('moment')

/* Returns weekNo as defined by number of weeks since Etheraffle's birthday */
const getWeekNo = () => {
  let birthday = 1500249600, weekDur = 604800
  return Math.trunc((moment().format('X') - birthday) / weekDur)
}
/* Get number of matches between chosen & winning numbers */
const getMatches = (_entryNums, _winningNums) => {
  let matches = 0
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if (_entryNums[i] === _winningNums[j]) {
          matches++
          break
        }
      }
    }
  return matches
}
/* Returns a decimal truncated to _fixed decimal places with NO rounding */
const toDecimals = (_num, _fixed) => {
  if (_num === 0) return 0
  let re = new RegExp('^-?\\d+(?:\.\\d{0,' + (_fixed || -1) + '})?')
  return _num.toString().match(re)[0]
}
/* Bubbles sorts entry numbers into ascending order ready for the smart contract */
const sortEnums = (_arr) => {
  for (let i = _arr.length - 1; i >= 0; i--) {
    for (let j = 1; j <= i; j++) {
      if (_arr[j - 1] > _arr[j]) {
        let temp = _arr[j - 1]
        _arr[j - 1] = _arr[j]
        _arr[j] = temp
      }
    }
  }
  return _arr
}
module.exports = {
  sortEnums: sortEnums,
  getWeekNo: getWeekNo,
  toDecimals: toDecimals,
  getMatches: getMatches
}
