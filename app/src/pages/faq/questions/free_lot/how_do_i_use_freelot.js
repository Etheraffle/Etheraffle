import React from 'react'
import freeLOTOption from './images/freelot_options.png'
import zeroEth from './images/zero_eth_ticket_price.png'

export default props => (
  <React.Fragment>
    <p className="justify">
      Using your <span className={`styledSpan screen${props.screenIndex}`}>FreeLOT coupons</span> couldn't be simpler. Etheraffle will automatically track your balance of FreeLOT, and if you have any, you will be given the option to spend one of your coupons any time you buy an Etheraffle ticket:
    </p>
    <br/><img className='image centred border' src={freeLOTOption} alt='FreeLOT Coupon options!'/><br/>
    <p className="justify">
      If you click "yes", your ethereum-enabled browser will take over and wait for you to sign the ticket purchase transaction. Notice that the ticket price is now <span className={`styledSpan screen${props.screenIndex}`}>0 ETH</span>! Once the transaction is mined, you'll have been entered into the draw for <span className={`styledSpan screen${props.screenIndex}`}>FREE</span>, and one of your FreeLOT coupons will have been spent instead!
    </p>
    <br/><img className='image centred border' src={zeroEth} alt='Zero ETH ticket prize!'/><br/>
    {/* <p className="justify">
      You can also click "No" if you want to purchase a raffle ticket for the usual price and save your FreeLOT coupons for another time.
    </p> */}
  </React.Fragment>
)