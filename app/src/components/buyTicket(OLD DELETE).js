import getSaturdayCont from './getSaturdayCont'
import cont from './etheraffleContract'
import utils from './utils'

/* Sorts entry numbers then enters raffle. Returns txHash or rejects with error */
/* Last param of getData = affiliateID, of which Etheraffle is 0 */
export default function(_which, _user, _eNums, _price) {
  return new Promise((resolve, reject) => {
    if(typeof window.web3 !== "undefined" || window.web3.isConnected() === false)
      return reject(new Error("Failed to buyTicket - no web3 connection!"))
    //if(_which == "Wednesday") getWednesdayCont()
    if(_which == "Saturday") getSaturdayCont()
    .then(etheraffle => {
      let eNums = utils.sortEnums(_eNums),
          data  = etheraffle.enterRaffle.getData(eNums[0], eNums[1], eNums[2], eNums[3], eNums[4], eNums[5], 0)
      window.web3.eth.sendTransaction({
        from: _user,
        to: cont.cAdd,
        data: data,
        value: _price,
        gas: cont.gasForEntry
      },(err, txHash) => {
        return !err ? resolve(txHash) : reject(err)
      })
    }).catch(err => {
      return reject(err)
    })
  })
}
