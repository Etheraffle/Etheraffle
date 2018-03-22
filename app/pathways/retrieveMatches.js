const mongo = require('../modules/mongo')
    , utils = require('../modules/utils')

module.exports = (_data) => {
  return new Promise((resolve, reject) => {
    if(_data.k == undefined || _data.r == undefined) return resolve([0,0,0,0])
    return mongo.checkKey(_data.k)
    .then(bool => {
      if(bool == false) return resolve([0,0,0,0])
      return mongo.getMatchesArr(JSON.parse(_data.r))
      .then(matchesArr => {
        return resolve(matchesArr)
      })
    }).catch(err => {
      utils.errorHandler("retreiveMatches", "App Pathways", _data, err)
      return resolve([0,0,0,0])
    })
  })
}
