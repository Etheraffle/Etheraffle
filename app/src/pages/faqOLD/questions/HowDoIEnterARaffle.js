import React, { Component } from 'react'
import selector from './images/selector.jpg'
import pending from './images/purchasepending.jpg'
import txhash from './images/txhash.jpg'

export default class HowDoIEnterARaffle extends Component {
  render(){
    return(
      <div>

        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          To enter a raffle first make sure you are visiting the ĐApp using an ethererum-enabled browser, otherwise the entry form will not appear. Once you are succesfully connected to the ethereum network, you will see the entry form. Simply select your six lucky numbers using the drop menus above the "Buy Ticket" button and then click the "Buy Ticket" button:
        </p>

        <div className='image centred'>
          <img className='imageBorder' style={{'margin':'12px'}} src={selector} alt='The number selector'/>
        </div>

        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          Now your ethereum-enabled browser will take over. A pop-up will appear with the transaction details in it. The exact layout depends on the browser, but they will all display the amount of ether you are about to send (the ticket price), and the amount of gas the transaction will require. If it is not near the raffle's deadline, and you are not in a hurry, you can lower the price of the gas. This will make the purchase cheaper, though it will take longer to mine into the blockchain. Meanwhile, Etheraffle will wait with a status:
        </p>

        <div className='image centred'>
          <img className='imageBorder' style={{'margin':'12px'}} src={pending} alt='The transaction pending popup'/>
        </div>

        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          After you have checked the details, click to submit the transaction in your ethereum-browsers popup window. Etheraffle will receive notification of this event and display the "Transaction Hash" of your purchase:
        </p>

        <div className='image centred'>
          <img className='imageBorder' style={{'margin':'12px'}} src={txhash} alt='The transaction hash popup'/>
        </div>

        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          Once your transaction is succesfully mined onto the blockchain, your ticket purchase will appear on the results page. Congratulations, you're in with a chance to win ether!
        </p>

      </div>
    )
  }
}
