import utils from '../../../../components/utils'
import getContInst from '../../../../web3/getContInst'
/* Returns either the number of user's entries or rejects with err (weekNo defaults to current exact week) */
export default (_web3, _address, _weekNo = utils.getExactWeekNo(), _which = 'Saturday') => {
  return new Promise((resolve, reject) => {
    return getContInst(_web3, _which)
    .then(etheraffle => {
      etheraffle.getUserNumEntries.call(_address, _weekNo, (err,res) => {
        return !err ? resolve(JSON.parse(res)) : reject(err)
      })
    }).catch(err => {
      return reject(err)
    })
  })
}