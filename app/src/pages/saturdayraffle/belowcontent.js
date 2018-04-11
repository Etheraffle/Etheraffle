import React from 'react'
import Promo from './promo/promo'
import { EthContext } from '../../contexts/ethContext'
import LoadingIcon from '../../images/loadingIconGrey.svg'

export default props => (
  <EthContext.Consumer>{eth => (
    <React.Fragment>
      {
        eth.loading   ? <Loading /> 
        : !eth.web3   ? <NoCxn    screenIndex={props.screenIndex} closed={props.closed} />
        : !eth.ethAdd ? <Locked   screenIndex={props.screenIndex} closed={props.closed} />
        : eth.ethAdd  ? <Unlocked screenIndex={props.screenIndex} closed={props.closed} />
        : <NoCxn screenIndex={props.screenIndex} closed={props.closed} />
      }
      <Promo screenIndex={props.screenIndex} closed={props.closed} eth={eth} />
    </React.Fragment>
  )}</EthContext.Consumer>
)

const Loading = props => (
  <img className='loadingIcon' src={LoadingIcon} alt='Loading icon' />
)

const NoCxn = props => (
  <React.Fragment>
    {!props.closed &&
      <p className="justify">
        You need an ethereum-enabled browser so you can grab your tickets and be in with a chance to win ether! You have until 7pm UTC on Saturday to enter this week's raffle, so hurry! By playing Etheraffle you are not only in with a chance to win ether, but also are helping to support good causes around the world! <a className={`invert screen${props.screenIndex}`} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Want to know more?</a>
      </p>
    }
    {props.closed &&
      <p className="justify">
        You need an ethereum-enabled browser to be able to enter the draw. The raffle is currently closed until Sunday anyway whilst the results are drawn, so you've got time to get an ethereum account. Then hurry back and grab your tickets! By playing Etheraffle you are not only in with a chance to win ether, but also are helping to support good causes around the world! <a className={`invert screen${props.screenIndex}`} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Want to know more?</a>
      </p>
    }
  </React.Fragment>
)

const Locked = props => (
  <React.Fragment>
    {!props.closed &&
      <p className="justify">
        You need to unlock your ethereum account so you can grab your tickets and be in with a chance to win ether! You have until 7pm UTC on Saturday to enter, so hurry! By playing Etheraffle you are not only in with a chance to win ether, but also are helping to support good causes around the world! <a className={`invert screen${props.screenIndex}`} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Want to know more?</a>
      </p>
    }
    {props.closed &&
      <p className="justify">
        You need to unlock your ethereum account so you can be in with a chance to win ether! The raffle is currently closed until Sunday anyway whilst the results are drawn but hurry back tomorrow to grab your tickets then! By playing Etheraffle you are not only in with a chance to win ether, but also are helping to support good causes around the world! <a className={`invert screen${props.screenIndex}`} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Want to know more?</a>
      </p>
    }
  </React.Fragment>
)

const Unlocked = props => (
  <React.Fragment>
    {!props.closed &&
      <p className="justify">
      Grab your ticket to enter the draw and be in with a chance to win ether! You win by matching three or more numbers. The timer counts down until the entry closes at 7pm UTC time every Saturday, and the results are drawn two hours later - <span className={'styledSpan + screen' + props.screenIndex}>Good Luck!</span> By playing Etheraffle you are not only in with a chance to win ether, but also are helping to support good causes around the world! <a className={`invert screen${props.screenIndex}`} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Want to know more?</a>
      </p>
    }
    {props.closed &&
      <p className="justify">
        Entry is currently closed while the results are drawn. If you've entered, the results will appear in the results tab soon - good luck! If you want to enter, the next draw opens in a few hours so hurry back to grab your tickets then! By playing Etheraffle you are not only in with a chance to win ether, but also are helping to support good causes around the world! <a className={`invert screen${props.screenIndex}`} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Want to know more?</a>
      </p>
    }
  </React.Fragment>
)