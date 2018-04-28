import React from 'react'
import mm from '../promo/images/metamask_mobile.jpg'
import freeLOTWin from './images/freelot_win.png'
import freeLOTClaim from './images/coupon_claim.png'

export default props => (
  <React.Fragment>
    <p className="justify">
      First you have to play Etheraffle and enter the draw with your six chosen numbers. Then, when a raffle has been drawn, if you've matched exactly two of your numbers to the winnings numbers, you win a <span className={`styledSpan screen${props.screenIndex}`}>FreeLOT coupon</span>!
    </p>
    <br/><img className='image centred border' src={freeLOTWin} alt='A two match win!'/><br/>
    <p className="justify">
      Click on the "Claim Prize" button in order to retrieve your coupon. Your ethereum-enabled browswer will take over and Etheraffle will wait for you to sign the transaction.
    </p>
    <br/><img className='image centred border' src={freeLOTClaim} alt='A two match win!'/><br/>
    <p className="justify">
      Once the transaction has been mined and the  Etheraffle smart-contract receives your request, it will send you your <span className={`styledSpan screen${props.screenIndex}`}>FreeLOT coupon</span> directly to your account! You will need to "watch" for the coupon in your ethereum-wallet of choice. This simply involves providing your wallet with the address of the FreeLOT token:
    </p>
    <br/>
    <h3 className='centred'>
      <a className={'invert screen' + props.screenIndex}href='https://etherscan.io/address/0xc39f7bb97b31102c923daf02ba3d1bd16424f4bb' rel="noopener noreferrer" target="_blank">
        <span className='blueGrey ethAdd'>{'0xc39f7bb97b31102c923daf02ba3d1bd16424f4bb'.substring(0,20) + '. . .'}</span>
      </a>
    </h3>
    <br/>
    <p className='justify'>
      For example, to do this in Metamask:
    <br/><br/><img className='image border centred' src={mm} alt='How to watch the token in metamask'/>
    </p>
  </React.Fragment>
)



