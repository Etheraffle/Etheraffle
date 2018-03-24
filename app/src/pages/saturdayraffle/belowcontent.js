import React from 'react'
import moment from 'moment'

export default class BelowContent extends React.Component {

  render() {
    let status, closed
    if (window.web3 === undefined || window.web3 === null) status = 'NoWeb3'
    else if (window.web3 !== undefined && window.web3 !== null && !window.web3.isConnected()) status = 'NoWeb3'
    else if (window.web3 !== undefined && window.web3 !== null && window.web3.isConnected()) status = 'Web3'
    if (moment().weekday() === 6 && parseInt(moment().format('H'),10) >= 19) closed = true;//Saturday 7pm

    return (
      <div className={"belowContent screen" + this.props.screenIndex}>
        {/* No ethereum connection/eth address! */}
        {status === 'NoWeb3' &&
          <div>
            {!closed &&
              <p className="justify">
                You need an ethereum-enabled browser so you can grab your tickets and be in with a chance to win ether! You have until 7pm UTC on Saturday to enter this week's raffle, so hurry! By playing Etheraffle you are not only in with a chance to win ether, but also are helping to support good causes around the world! <a className={'invert screen' + this.props.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Want to know more?</a>
              </p>
            }

            {closed &&
              <p className="justify">
                You need an ethereum-enabled browser to be able to enter the draw. The raffle is currently closed until Sunday anyway whilst the results are drawn, so you've got time to get an ethereum account. Then hurry back and grab your tickets! By playing Etheraffle you are not only in with a chance to win ether, but also are helping to support good causes around the world! <a className={'invert screen' + this.props.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Want to know more?</a>
              </p>
            }
          </div>
        }

        {/* Web3 connection good  */}
        {status === 'Web3' &&
          <div>
            {/* Raffle open... */}
            {!closed &&
              <div>
                {/* But eth account locked... */}
                {(window.ethAdd === undefined || window.ethAdd === null) &&
                  <p className="justify">
                    You need to unlock your ethereum account so you can grab your tickets and be in with a chance to win ether! You have until 7pm UTC on Saturday to enter, so hurry! By playing Etheraffle you are not only in with a chance to win ether, but also are helping to support good causes around the world! <a className={'invert screen' + this.props.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Want to know more?</a>
                  </p>
                }

                {/* Eth account unlocked and good to go... */}
                {(window.ethAdd !== undefined && window.ethAdd !== null) &&
                  <p className="justify">
                   Grab your ticket to enter the draw be in with a chance to win ether! You win by matching three of more numbers. The timer counts down until the entry closes at 7pm UTC time every Saturday, and the results are drawn two hours later - <span className={'styledSpan + screen' + this.props.screenIndex}>Good Luck!</span> By playing Etheraffle you are not only in with a chance to win ether, but also are helping to support good causes around the world! <a className={'invert screen' + this.props.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Want to know more?</a>
                  </p>
                }

              </div>
            }

            {closed &&
              <p className="justify">
                Entry is currently closed while the results are drawn. If you've entered, the results will appear in the results tab soon - good luck! If you want to enter, the next draw opens in a few hours so hurry back to grab your tickets then! By playing Etheraffle you are not only in with a chance to win ether, but also are helping to support good causes around the world! <a className={'invert screen' + this.props.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Want to know more?</a>
              </p>
            }

          </div>
        }

      </div>
    )
  }
}
