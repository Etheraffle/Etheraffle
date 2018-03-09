import React from 'react'
import entered from './images/entered.jpg'
import success from './images/etherscansuccess.jpg'
import txhash from './images/txhash.jpg'
import resultsTab from './images/resultstab.jpg'

export default (props) => {
  return(
    <div>

      <p className="justify">
        After you've chosen your six lucky numbers and entered the raffle, there are two ways you can confirm you entry has gone through succesfully. The first and simplest way is to wait a while for the transaction to be mined onto the blockchain, then visit the results tab at the top of the page:
      </p>

      <img className='image border centred' src={resultsTab} alt='The entry table'/>

      <p className='justify'>
        Once succesfully mined, your ticket-purchase will appear on your results page, in a table displaying all the relevant information. The table displays your entry number, your six chosen numbers, and three other columns involving winning information. However since the raffle is still ongoing and has not been drawn yet, the prize column displays "Pending" and the "Matches" and "Withdraw" columsn display "n/a". These columns are populated automatically as soon as the raffle is drawn.
      </p>

      <img className='image border centred' src={entered} alt='The entry table'/>

      <p>
        The second method to check your entry is succesful is to click on the transaction hash that appears in the pop-up after you've confirmed your purchase via your ethereum client:
      </p>

      <img className='image border centred' src={txhash} alt='Ticket bought transaction hash example'/>

      <p className="justify">
        This link will take you to the&nbsp;
        <a
          className={'invert screen' + props.screenIndex}
          target="_blank"
          rel="noopener noreferrer"
          href='http://etherscan.io'>
          etherscan
        </a>
        &nbsp;page for your transaction, where you can watch it get mined into the blockchain in real time. If you scroll down the page a little you will see a "TxReceipt Status" line which will be <i>pending</i> whilst the transaction is being mined, and will show "Success" once your ticket-purchase has been mined.
      </p>

      <img className='image border centred' src={success} alt='Etherscan showing transaction success'/>

    </div>
  )
}
