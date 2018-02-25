const utils = require('../modules/utils'),
      mongo = require('../modules/mongo')

module.exports = function(_data) {
  return new Promise((resolve, reject) => {
    const data = {
      raffleID:    _data.raffleID,
      entryNum:    parseInt(_data.entryNum),
      ethAdd:      _data.ethAdd,
      txHash:      _data.txHash,
      timeStamp:   utils.getTimeStamp(),
      entryNumArr: _data.entryNumArr
    }
    return mongo.updateOnWithdraw(data)
    .then(res => {
      if(res == true) return resolve(true)
      throw new Error("Error on api/updateonwithdraw pathway: Mongo returned false!")
    }).catch(err => {
      utils.errorHandler("api/updateonwithdraw", "App Pathways", _data, err)
      return resolve(false)
    })
  })
}
