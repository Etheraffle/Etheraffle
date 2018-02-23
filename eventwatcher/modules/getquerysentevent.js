const moment    = require('moment'),
      getWeb3   = require('./getweb3'),
      getStruct = require('./getqidstruct')

/* Period in days, assumes block time of ~ 15s */
module.exports = function(_latestBlock, _period){
  let block = _latestBlock - Math.trunc((_period * 24 * 60 * 60) / 15)
  return new Promise ((resolve, reject) => {
    return getWeb3.etheraffle.LogQuerySent({},{fromBlock: block, toBlock: "latest"}).get((err,res) => {
      if(err || res.length == 0) return resolve(null)
      const resArr = []
      for(i = 0; i < res.length; i++) {
        const qID  = res[i].args.queryID
        return getStruct(qID)
        .then(struct => {
          const due  = moment.unix(JSON.parse(res[i].args.dueAt)).format('dddd, MMMM Do, YYYY HH:mm:ss'),
                sent = moment.unix(JSON.parse(res[i].args.sendTime)).format('dddd, MMMM Do, YYYY HH:mm:ss'),
                week = struct.length > 0 ? JSON.parse(struct[0]) : 'Error retrieving struct',
                ran  = struct.length > 0 ? struct[1] : 'Error retrieving struct',
                man  = struct.length > 0 ? struct[2] : 'Error retrieving struct',
                obj  = {
                  qID:      qID,
                  sentAt:   sent,
                  dueAt:    due,
                  weekNo:   week,
                  isRandom: ran,
                  isManual: man
                }
          resArr.push(obj)
          if(i + 1 == res.length) return resolve(resArr)
        }).catch(err => console.log('Error getting struct in getQuerySentEvents: ', err))
      }
    })
  })
}
