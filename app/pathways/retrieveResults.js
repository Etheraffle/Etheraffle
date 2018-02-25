const utils = require('../modules/utils'),
      mongo = require('../modules/mongo')

module.exports = function(_data) {
  return new Promise((resolve, reject) => {
    return mongo.getResults(_data.ethAdd)
    .then(results => {
      if(results == null) return resolve(null)
      else return resolve({
        entries:   results.entries,
        raffleIDs: results.raffleIDs,
        results:   results.raffleResultsObj
      })
    }).catch(err => {
      utils.errorHandler("retrieveResults", "App Pathways", _data, err)
      return resolve(null)
    })
  })
}
