import React, { Component } from 'react'
import entered from './images/entered.jpg'
import success from './images/etherscansuccess.jpg'
import txhash from './images/txhash.jpg'
import resultsTab from './images/resultstab.jpg'

export default class HowDoIKnowIfIveEntered extends Component {
  render(){
    return(
      <div>

        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          After you've chosen your six lucky numbers and entered the raffle, there are two ways you can confirm you entry has gone through succesfully. The first and simplest way is to wait a minute or two for the transaction to be mined onto the blockchain, then visit the results tab at the top of the page:
        </p>

        <div className='image centred'>
          <img className='imageBorder' style={{'margin':'12px'}} src={resultsTab} alt='The entry table'/>
        </div>

        <p className='justify'>
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          Once succesfully mined, your ticket-purchase will appear on your results page, in a table displaying all the relevant information. The table displays your entry number, your six chosen numbers, and three other columns involving winning information. However since the raffle is still ongoing and has not been drawn yet, the prize column displays "Pending" and the "Matches" and "Withdraw" columsn display "n/a". These columns are populated automatically as soon as the raffle is drawn.
        </p>

        <div className='image centred'>
          <img className='imageBorder' style={{'margin':'12px'}} src={entered} alt='The entry table'/>
        </div>

        <p>
        <span className={'styledSpan screen' + this.props.screenIndex}>
          <b>&emsp; &#x274d; &ensp;</b>
        </span>
          The second method to check your entry is succesful is to click on the transaction hash that appears in the pop-up after you've confirmed your purchase via your ethereum client:
        </p>

        <div className='image centred'>
          <img className='imageBorder' style={{'margin':'12px'}} src={txhash} alt='Ticket bough transaction hash example'/>
        </div>

        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          This link will take you to the&nbsp;
          <a
            className={'screen' + this.props.screenIndex}
            target="_blank"
            rel="noopener noreferrer"
            href='http://etherscan.io'>
            etherscan.io
          </a>
          &nbsp;page for your transaction, where you can watch it get mined into the blockchain in real time. If you scroll down the page a little you will see a "TxReceipt Status" line which will be <i>pending</i> whilst the transaction is being mined, and will show "Success" once your ticket-purchase has been mined.
        </p>

        <div className='image centred'>
          <img className='imageBorder' style={{'margin':'12px'}} src={success} alt='Etherscan showing transaction success'/>
        </div>
      </div>
    )
  }
}
