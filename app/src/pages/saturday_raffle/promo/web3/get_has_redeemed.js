import getContInst from './get_cont_inst'
import utils from '../../../../components/utils'
/* Returns bool or rejects with err (weekNo defaults to current exact week) */
export default (_web3, _address, _weekNo = utils.getExactWeekNo()) => {
  return new Promise((resolve, reject) => {
    return getContInst(_web3)
    .then(promo => {
      promo.hasRedeemed.call(_address, _weekNo, (err,res) => {
        return !err ? resolve(res) : reject(err)
      })
    }).catch(err => {
      return reject(err)
    })
  })
}