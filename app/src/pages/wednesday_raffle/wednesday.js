import React from 'react'
import LOT from '../../components/lot'
import Subnav from '../../components/sub_nav'
import { ScreenContext } from '../../contexts/screen_context'

export default props => (
  <ScreenContext>
    {screen => {
      const {screenIndex: sI, subScreenIndex: ssI} = screen 
      return (
        <Subnav screenIndex={sI} subScreenIndex={ssI} >
          <div className={`contentWrapper si${sI}`}>
            <div className={`content ssi${ssI}`}>
              <div className={`belowContent screen${sI}`}>
                <br/>
                <h3 className='centred'>Welcome to the <span className={`styledSpan screen${sI}`}>Instant Raffle!</span></h3>
                <br/><LOT height='4em' fill={sI} /><br/>
                <p className='justify'>
                  Whilst we continue developing the smart-contracts needed for the Wednesday raffle, why not check out how you playing Etheraffle is also <a className={`invert screen${sI}`} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>supporting good causes</a> world wide! Better still, right now you can become a part of Etheraffle by <a className={`invert screen${sI}`} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>joining our ICO!</a> Purchasing LOT tokens allows you to <a className={`invert screen${sI}`} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>receive ether</a> generated by Etheraffle, whilst also giving you voting rights on the only truly decentralized and charitable lottery ÐApp on the ethereum blockchain!
                </p>
              </div>
            </div>
          </div>
        </Subnav>
      )
    }}
  </ScreenContext>
)