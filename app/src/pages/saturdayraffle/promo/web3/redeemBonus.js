import pCont  from './promoContract'
import utils  from '../../../../components/utils'
/* Returns the instantiated contract for use in transactions */
const instantiate = () => {
    return new Promise((resolve, reject) => {
        let cAdd = pCont.cAdd
          , cABI = window.web3.eth.contract(pCont.ABI)
        return resolve(cABI.at(cAdd))
    })
}
/* Sends function to redeem bonus LOT. Returns txHash or rejects with error */
export default (_user, _weekNo = utils.getExactWeekNo()) => {
    return new Promise((resolve, reject) => {
        instantiate().then(promo => {
            let data = promo.redeem.getData(_weekNo)
            window.web3.eth.sendTransaction({
                data: data,
                from: _user,
                gas:  pCont.gas,
                to:   pCont.cAdd
            }, (err, txHash) => {
                return !err ? resolve(txHash) : reject(err)
            })
        }).catch(err => {
            return reject(err)
        })
    })
}