import React from 'react'
import claim from './images/claim.jpg'
import claimed from './images/claimed.jpg'
import fail from './images/etherscan_fail.jpg'
import ContactForm from '../../../pages/contact/contact'

export default props => (
  <React.Fragment>
    <p className="justify">
      First of all, don't worry! Because everything to do with Etheraffle is stored on the blockchain, it is stored <i>forever</i> and it is <i>immutable</i>, meaning that no one - including Etheraffle - can alter that information. If you hold a winning ticket, it is impossible to lose it! Second of all, have you made sure to click the "Claim Prize" button on the results tab?
    </p>
    <img className='image centred border' src={claim} alt='The Claim Prize button'/>
    <p className="justify">
      If so, and you've still not received your winnings, it is likely that your claim transaction failed for some reason. If you look at the results tab, and hover over the <i>Claimed</i> cell of your winning ticket, a popup will appear showing you the details of your prize claim:
    </p>
    <img className='image centred border' src={claimed} alt='The Prize Claimed button'/>
    <p className="justify">
      By clicking anywhere on the <i>Claimed</i> cell, those popup details will be copied to your clipboard. If you take the "Transaction Hash" and visit
      <a
        className={`invert screen${props.screenIndex}`}
        target="_blank"
        rel="noopener noreferrer"
        href='http://etherscan.io'>
        &nbsp; etherscan.io &nbsp;
      </a>
      and enter the hash into their search box, you will be able to investigate whether or not the transaction succeeded:
    </p>
    <img className='image centred border' src={fail} alt='Etherscan failed transaction'/>
    <p className="justify">
      If etherscan shows that the transaction failed like in the image above, then don't panic, it is likely a simple gas issue. Your winnings are still secure in Etheraffle's smart-contract and awaiting your withdrawal. To facilitate this, please email us using the form below, pasting in the details you copied to your clipboard from the results page. We will investigate why the transaction failed, and help you successfully withdraw your winnings!
    </p>
    <ContactForm faq={true} screenIndex={props.screenIndex} />
  </React.Fragment>
)
