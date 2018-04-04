import utils from '../../../../components/utils'
import getContInst from './getContInst'
/* Returns bool or rejects with err (weekNo defaults to current exact week) */
export default (_address, _weekNo = utils.getExactWeekNo()) => {
  return new Promise((resolve, reject) => {
    if (window.web3 === null || window.web3.isConnected() === false)
      return reject(new Error("Failed to find out if redeemed - no web3 connection!"))
    return getContInst()
    .then(promo => {
      promo.hasRedeemed.call(_address, _weekNo, (err,res) => {
        return !err ? resolve(res) : reject(err)
      })
    }).catch(err => {
      return reject(err)
    })
  })
}