import React from 'react'
import ReactTooltip from 'react-tooltip'
import moment from 'moment'
import ICODates from './utils/ICODates'
import ICOContract from './utils/ICOContract'

export default class ICORedeemButton extends React.Component{

  render(){
    const start = moment.unix(ICODates().icoEnd).format("X"),
          end   = moment.unix(ICODates().icoEnd).add(1, "w").format("X"),
          _now  = moment().format("X")

    return(
      <div className="RedeemButtonComponent">

        <ReactTooltip className={"customTheme screen" + this.props.screenIndex} effect="solid" multiline={true} />

        <p><span className="styledSpan centred largerFont" style={{'fontSize':'1.5em'}}><b>&#x274d;</b></span></p>

        <h2 className={"centred underlined screen" + this.props.screenIndex}>How do I get my bonus LOTs?</h2>

        <p className="justify">
          &emsp;&emsp;Once the ICO ends, you have one week to claim your bonus LOTs. During that week, the button below will become active. To claim your LOTs, make sure you are signed into your ethereum client with the same address you used to purchase the LOTs, then click the button! It will pop-up your ethereum client's transaction window, requesting that you submit a zero-ether transaction to Etheraffle's ICO smart contract. The transaction calls a function in the ICO contract which uses your ethereum address to calculate how many bonus LOTs you are entitled to. It then transfers those LOTs to you. Easy!
        </p>

        {(_now >= start && _now < end ) &&
          <div
            className={"redeemButton screen" + this.props.screenIndex}
            data-tip=
              "This button will pop-up your ethereum client's transaction window,<br>
              prompting you to make a zero-ether transaction to our ICO contract.<br>
              Once you submit, it will call a function in our contract which works <br>
              out the number of bonus LOTs you are entitled to. It then transfers <br>
              them to your wallet. Easy!"
          ></div>
        }

        {(_now < start || _now >= end) &&
          <div
            className="redeemButtonGrey"
            data-tip=
              "When the bonus redemption period opens, this button will allow you to<br>
              quickly and easily send a transaction to Etheraffle's ICO smart contract,<br>
              to call the 'Redeem Bonus LOTs' function. This function will work out the<br>
              bonus LOTs you are entitled to, and then transfer them to your wallet. Easy!"
          ></div>
        }

        <p className="justify">
          &emsp;&emsp;If you have purchased LOTs with multiple addresses, you will need to submit this transaction for each address you wish to claim bonus LOTs for.
          <br/>
          <br/>
          &emsp;&emsp;If you'd rather call the function manually, send a zero-ether transaction to the ICO contract at:
          <span className={'styledSpan centred screen' + this.props.screenIndex}>
            &ensp;{ICOContract.icoAdd}&ensp;
          </span>
          including the correct function signature <span className={"styledSpan screen" + this.props.screenIndex}>("0x73635a99")</span> as the data in the transaction. Once mined, your bonus LOTs will appear in your wallet.
        </p>

      </div>
    )
  }
}
