import React from 'react'
import LoadingIcon from '../../images/loading_icon_grey.svg'

export const Pending = props => (
  <React.Fragment>
    {props.freeGo 
      ? <h2 className={`screen${props.screenIndex}`}>FreeLOT Coupon Claim In Progress . . .</h2>
      : <h2 className={`screen${props.screenIndex}`}>Prize Claim In Progress . . .</h2>
    }
    <img className='loadingIcon' src={LoadingIcon} style={{'margin':'0.8em 0 0 0'}} alt='Loading icon' />
    {props.safeLow && 
      <p>Safe low gas price: <span className={`styledSpan screen${props.screenIndex}`}>{props.safeLow}</span></p>
    }
  </React.Fragment>
)

export const Success = props => (
  <React.Fragment>
    <h2 className={`screen${props.screenIndex}`}>Transaction Sent!</h2>
    <p className='centred'>
      Your transaction hash: 
      <a
        rel='noopener noreferrer'
        target='_blank'
        className={`invert screen${props.screenIndex}`}
        href={`https://etherscan.io/tx/${props.txHash}`}>
          {` ${props.txHash.substring(0, 20)}. . .`}
      </a><br/>
    </p>
    <h2 className={`screen${props.screenIndex}`}>What now?</h2><br/>
      {props.freeGo
        ? <p className='justify'>
            Click the hash above to watch your transaction being mined in to the block chain! When your transaction is received by Etheraffle's smart-contract it will send you a <span className={`styledSpan screen${props.screenIndex}`}>FreeLOT</span> coupon! You can use this to enter any future raffle for free! For more information about how to use your coupon, see the FAQ. If after 24 hours you have not received your coupon, please contact support quoting your ethereum address and the transaction hash above.
          </p>
        : <p className='justify'>
            Click the hash above to watch your transaction being mined in to the block chain! When your transaction is received by Etheraffle's smart-contract it will send your ETH directly into your account! If after 24 hours you have not received your ETH, please contact support quoting your ethereum address and the transaction hash above.
          </p>
      }
  </React.Fragment>
)

export const Error = props => (
  <React.Fragment>
    <h2 className={`screen${props.screenIndex}`}>Error Creating Transaction!</h2>
    {props.txErr 
      ? <p className='justify last'>{props.txErr}</p> 
      : <p className='justify last'>You may have rejected the transaction, or your connection may have dropped. Please check your ethereum client and make sure your account is unlocked.</p>
    }
  </React.Fragment>
)