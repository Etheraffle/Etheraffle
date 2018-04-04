const moment    = require('moment')
    , getWeb3   = require('./getweb3')
    , getStruct = require('./getqidstruct')
/* Period in days, assumes block time of ~ 15s */
module.exports = (_latestBlock, _period, _raffleID) => {
  let block = _latestBlock - Math.trunc((_period * 24 * 60 * 60) / 15)
  return new Promise ((resolve, reject) => {
    return getWeb3.etheraffle.LogOraclizeCallback({forRaffle: _raffleID},{fromBlock: block, toBlock: "latest"}).get((err,res) => {
      if (err || res.length == 0) return resolve(null)
      return Promise.all(res.map(x => {return getStruct(x.args.queryID)}))
      .then(arr => {
        return resolve(
          arr.map((x,i) => {
            return obj = {
              qID:      res[i].args.queryID,
              result:   res[i].args.result,
              atTime:   moment.unix(JSON.parse(res[i].args.atTime)).format('dddd, MMMM Do, YYYY HH:mm:ss'),
              weekNo:   x.length > 0 ? JSON.parse(x[0]) : 'Error retrieving struct',
              isRandom: x.length > 0 ? x[1] : 'Error retrieving struct',
              isManual: x.length > 0 ? x[2] : 'Error retrieving struct'
            }
          })
        )
      }).catch(err => {console.log('Error getting struct in getOraclizeCallbackEvent: ', err)})
    })
  })
}