import React, { Component } from 'react'
import resultsTab from './images/resultstab.jpg'

export default class WillItKnowMyDetails extends Component {

  render(){
    return(
      <div>

        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          All your interactions with Etheraffle's Dapp are via your ethereum address, which are by default anonymous. By visiting Etheraffle in an ethereum-enabled browser, etheraffle detects your address and thus automatically "logs" you in - easy! Thereafter, any of your interactions with the Etheraffle ÐApp - such as buying a ticket or withdrawing your winnings - are then stored on the ethereum blockchain forever in Etheraffle's smart contracts. Only the ethereum address is stored, neither the blockchain or Etheraffle require or store any of your personal information.
        </p>

        <div className='image centred'>
          <img className='imageBorder' style={{'margin':'12px'}}src={resultsTab} alt='Results Tab'/>
        </div>

        <p className='justify'>
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          The details regarding any raffles you've entered, or any winning tickets you own, are stored forever on the blockchain. Etheraffle simply looks up that information according to the address you're interacting via, and then display it for you on the results tab at the top of the page. Once purchased, any winning tickets you've bought can never be lost or misplaced!
        </p>
      </div>
    )
  }
}
