import React, { Component } from 'react'
import claim from './images/claim.jpg'
import claimed from './images/claimed.jpg'

export default class HowDoIClaimMyWinnings extends Component {
  render(){
    return(
      <div>
        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          Any winning tickets associated with your ethererum address will be easily spotted in the results tab. If a ticket you've bought matches three or more numbers to the winning numbers drawn at the end of the raffle, congratulations, you've won ether! To claim your prize, simply click the "Claim Prize" button that will appear in the table alongside your winning ticket:
        </p>

        <div className='image centred'>
          <img className='imageBorder'style={{'margin':'12px'}} src={claim} alt='The Claim Prize button'/>
        </div>

        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          This will pop-up your ethererum browser's transaction window, which will be pre-filled in with the correct details. All blockchain transactions require a fee paid in the form of gas. Etheraffle's smart-contracts are designed to be as gas efficient as possible whilst maintaining total security, meaning no one can withdraw your winnings except you. The gas is the cost of this security. At current ether prices, the fee is approximately $0.50. After your transaction is submitted and mined, Etheraffle's smart-contract will pay your winnings directly to your ethereum address. The "Claim Prize" button will have turned into "Prize Claimed", and a tooltip will appear over it with the details of your prize claim:
        </p>

        <div className='image centred'>
          <img className='imageBorder'style={{'margin':'12px'}} src={claimed} alt='The Prize Claimed button'/>
        </div>

      </div>
    )
  }
}
