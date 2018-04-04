import utils from '../../../../components/utils'
import getContInst from '../../../../web3/getContInst'
/* Returns either the number of user's entries or rejects with err (weekNo defaults to current exact week) */
export default (_address, _weekNo = utils.getExactWeekNo()) => {
  return new Promise((resolve, reject) => {
    if (window.web3 === null || window.web3.isConnected() === false)
      return reject(new Error("Failed to retrieve number of entries - no web3 connection!"))
    return getContInst('Saturday')
    .then(etheraffle => {
      etheraffle.getUserNumEntries.call(_address, _weekNo, (err,res) => {
        return !err ? resolve(JSON.parse(res)) : reject(err)
      })
    }).catch(err => {
      return reject(err)
    })
  })
}