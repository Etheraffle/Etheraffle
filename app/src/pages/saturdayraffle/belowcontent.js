import React from 'react'
import moment from 'moment'

export default class BelowContent extends React.Component {

  render() {
    let status, closed
    if(window.web3 === undefined || window.web3 === null) status = 'NoWeb3'
    else if(window.web3 !== undefined && window.web3 !== null && !window.web3.isConnected()) status = 'NoWeb3'
    else if(window.web3 !== undefined && window.web3 !== null && window.web3.isConnected()) status = 'Web3'
    if(moment().weekday() === 6 && parseInt(moment().format('H'),10) >= 19) closed = true;//Saturday 7pm

    return (
      <div className={"belowContent screen" + this.props.screenIndex}>

        <h2 className={"centred screen" + this.props.screenIndex}>
          Welcome to the Saturday Raffle!
        </h2>

        {/* No ethereum connection/eth address! */}
        {status === 'NoWeb3' &&
          <div>
            {!closed &&
              <p className="justify">
                Well . . . nearly! You need an ethereum-enabled browser so you can grab your tickets to enter the draw and be in with a chance to win ether! You have until 7pm UTC on Saturday to enter this week's raffle, so hurry!
              </p>
            }

            {closed &&
              <p className="justify">
                Well . . . nearly! You need an ethereum-enabled browser to be able to enter the draw. The raffle is currently closed until Sunday anyway whilst the results are drawn, so you've got time to get an ethereum account. Then hurry back and grab your tickets!
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
                    Well . . . nearly! You need to unlock your ethereum account so you can grab your tickets to enter the draw and be in with a chance to win ether. You have until 7pm UTC on Saturday to enter, so hurry! {window.ethAdd}
                  </p>
                }

                {/* Eth account unlocked and good to go... */}
                {(window.ethAdd !== undefined && window.ethAdd !== null) &&
                  <p className="justify">
                    Choose your six lucky numbers then grab your ticket to enter the draw and be in with a chance to win ether! Entry closes at 7pm UTC time every Saturday, and the results are drawn two hours later. Good luck!
                  </p>
                }
              </div>
            }

            {closed &&
              <p className="justify">
                Well . . . sort of. Entry is currently closed while the results are drawn. If you've entered, the results will appear in the results tab soon - good luck! If you want to enter, the next draw opens in a few hours so hurry back to grab your tickets then!
              </p>
            }

          </div>
        }

      </div>
    )
  }
}
