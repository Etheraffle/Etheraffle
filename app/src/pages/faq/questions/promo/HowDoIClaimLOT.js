import React from 'react'
import tx from './images/tx.png'
import txHash from './images/txHash.png'
import redeemed from './images/redeemed.png'
import redeem from './images/redeemButton.png'

export default props => (
    <div>
        <p className='justify'>
            On Saturdays, a "Redeem Bonus" button will appear that will let you claim the free LOT tokens you've earnt by buying Etheraffle tickets:
        </p>

        <img className='image border centred' src={redeem} alt='Free LOT redeem button'/>

        <p className='justify'>
            Clicking it will execute a transaction similar to the ticket purchase transaction. Your ethereum enabled browser will take over and Etheraffle will wait for you to submit the transaction:
        </p>

        <img className='image border centred' src={tx} alt='Redeem free LOT transaction'/>

        <p className='justify'>
            Once you have submitted the transaction via your ethereum enabled browser, you'll see the transaction hash appear:
        </p>

        <img className='image border centred' src={txHash} alt='Redeem free LOT transaction hash'/>

        <p className='justify'>
            The transaction calls a "redeem" function on the Etheraffle Promo contract which is open source and verified here should you wish to have a look at it: 
        </p>

        <br/>

        <h3 className='centred'>
            <a className={'invert screen' + props.screenIndex}href='https://etherscan.io/address/0xb0991c05510b34aa5386f1c1d87222a3e66c835f#code' rel="noopener noreferrer" target="_blank">
                {'0xb0991c05510b34aa5386f1c1d87222a3e66c835f'.substring(0,20) + '. . .'}
            </a>
        </h3>

        <br/>

        <p className='justify'>
            Once your transaction is mined, your shiny new LOT tokens will appear up in your wallet!
        </p>

        <img className='image border centred' src={redeemed} alt='LOT token redeem button after redemption'/>

        <p className='justify'>
            Note - In order to keep the gas cost of the promo contract as low as possible for redeeming your LOT tokens, you can only redeem any LOT earnt <span className={'styledSpan screen' + props.screenIndex}>ONCE</span> per week.
        </p>

    </div>
)