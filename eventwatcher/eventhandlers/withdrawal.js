const moment  = require('moment')
    , mongo   = require('../modules/mongo')

module.exports = _data => {
  let obj = {
    timeStamp: JSON.parse(_data.args.atTime),
    raffleID:  JSON.parse(_data.args.forRaffle),
    entryNum:  JSON.parse(_data.args.forEntryNumber),
    txHash:    _data.transactionHash,
    ethAdd:    _data.args.toWhom
  }
  return mongo.updateOnWithdraw(obj)
}
