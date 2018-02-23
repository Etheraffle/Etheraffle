import React, { Component } from 'react'
import claim from './images/claim.jpg'
import claimed from './images/claimed.jpg'
import fail from './images/etherscanfail.jpg'
import ContactForm from '../../../components/contactform/contactForm'

export default class IWonBut extends Component {

  render(){
    return(
      <div>
        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          First of all, don't worry! Because everything to do with Etheraffle is stored on the blockchain, it is stored <i>forever</i> and it is <i>immutable</i>, meaning that no one can alter that information. If you hold a winning ticket, it is impossible to lose it! Second of all, have you made sure to click the "Claim Prize" button on the results tab?
        </p>

        <div className='image centred'>
          <img className='imageBorder'style={{'margin':'12px'}} src={claim} alt='The Claim Prize button'/>
        </div>

        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          If so, and you've still not received your winnings, it is likely that your claim transaction failed for some reason. If you look at the results tab, and hover over the <i>Claimed</i> cell of your winning ticket, a popup will appear showing you the details of your prize claim:
        </p>

        <div className='image centred'>
          <img className='imageBorder'style={{'margin':'12px'}} src={claimed} alt='The Prize Claimed button'/>
        </div>

        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          By clicking anywhere on the <i>Claimed</i> cell, those popup details will be copied to your clipboard. If you take the "Transaction Hash" and visit
          <a
            className={'screen' + this.props.screenIndex}
            target="_blank"
            rel="noopener noreferrer"
            href='http://etherscan.io'>
            &nbsp; etherscan.io &nbsp;
          </a>
          and enter the hash into their search box, you will be able to investigate whether or not the transaction succeeded:
        </p>

        <div className='image centred'>
          <img className='imageBorder'style={{'margin':'12px'}} src={fail} alt='Etherscan failed transaction'/>
        </div>

        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          If etherscan shows that the transaction failed like in the image above, then don't panic, it is likely a simple gas issue. Your winnings are still secure in Etheraffle's smart-contract and awaiting your withdrawal. To facilitate this, please email us using the form below, pasting in the details you copied to your clipboard from the results page. We will investigate why the transaction failed, and help you successfully withdraw your winnings!
        </p>

        <div className='image centred'>
          <ContactForm screenIndex={this.props.screenIndex} />
        </div>



      </div>
    )
  }
}
