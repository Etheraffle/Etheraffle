import React from 'react'
import ICOContract from './utils/ICOContract'
import mistOne from '../../images/code/MistOne.jpg'
import mistTwo from '../../images/code/MistTwo.jpg'
import metamaskOne from '../../images/code/metamaskwatchone.jpg'
import metamaskTwo from '../../images/code/metamaskwatchtwo.jpg'

export default class ICOWatchTokens extends React.Component {
  render(){
    return(
      <div>
        <p><span className="styledSpan centred largerFont" style={{'fontSize':'1.5em'}}><b>&#x274d;</b></span></p>

        <h2 className={"centred underlined screen" + this.props.screenIndex}>How do I find my tokens?</h2>

        <p className='justify'>
          &emsp;&emsp;After taking part in this ICO, once you have sent ether to the ICO contract, you will receive your purchased LOT tokens as soon as the transaction is mined. However because the LOT is a new token, you won't be able to see them in your wallet until you "watch" for them in your ethereum client of choice. To do so, first you will need the LOT token's smart contract address.
        </p>

        <p className='centred'>
          Etheraffle's LOT Token Address:
          <br/>
          <a
            className={"invert largerFont screen" + this.props.screenIndex}
            target="_blank"
            rel="noopener noreferrer"
            href={"https://etherscan.io/address/" + ICOContract.tokenAdd}
            >
            {ICOContract.tokenAdd}
          </a>
        </p>

        <p className='justify'>
          If using MetaMask, first navigate to the "Token" tab, and then click on "Add Token":
        </p>

        <div className='image centred'>
          <img className='imageBorder'style={{'margin':'12px'}} src={metamaskOne} alt="Metamask's token tab"/>
        </div>

        <p>
          Enter the Etheraffle LOT contract address and MetaMask will populate the remaining fields for you. Click "Add" to complete the process:
        </p>

        <div className='image centred'>
          <img className='imageBorder'style={{'margin':'12px'}} src={metamaskTwo} alt="Metamask's add token page"/>
        </div>

        <p className='justify'>
          You will now be able to see your LOT balance displayed correctly in MetaMask! If using the Mist browser, first navigate to your ethereum wallet section via the left-hand icons, then click on the "Contracts" tab:
        </p>

        <div className='image centred'>
          <img className='imageBorder'style={{'margin':'12px'}} src={mistOne} alt="Mist's contract tab"/>
        </div>

        <p className='justify'>
          Then click on "Watch Token" at the bottom. In the popup, fill in the four fields with (from top to bottom): The Etheraffle LOT smart-contract address, the token name: Etheraffle LOT, the token symbol: LOT, and the number of decimals the LOT token has: 6.
        </p>

        <div className='image centred'>
          <img className='imageBorder'style={{'margin':'12px'}} src={mistTwo} alt="Mist's add token tab"/>
        </div>

        <p className='justify'>
          Click on "Ok" and you will now be able to see your LOT balance displayed correctly in Mist!
        </p>

      </div>
    )
  }
}
