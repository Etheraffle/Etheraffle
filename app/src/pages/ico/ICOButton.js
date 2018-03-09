import React from 'react'
import ReactTooltip from 'react-tooltip'
import ICOContract from './utils/ICOContract'
import ICODates from './utils/ICODates'
/*
PUTTHE BUY TICKETS DIV IN TO THE CORRECT CONDITIONAL RENDERING BIT!!!!!
*/
export default class ICOButton extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      mounted: false,
      amount: 1,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleClick  = this.handleClick.bind(this)
  }

  componentDidMount(){
    this.setState({mounted: true})
  }

  handleChange(event){
    if(this.state.mounted === true) this.setState({amount: event.target.value})
  }

  handleClick(){
    let amount = (this.state.amount * 1).toFixed(18),
        regex  = /^[0-9.]+$/
    if((amount.split(".").length - 1) > 1){//checks for more than one decimal point...
      alert("error, too many decimals")
      return
    }
    if (!amount.match(regex)){//checks input is a number
      alert("Input Malformed! Please recheck your amount!")
      return
    }
    if(window.web3 !== undefined && window.ethAdd !== null){
      let value = window.web3.toWei(amount, "ether")
      console.log("Value: ", value)
      //ENTER ICO
    } else {
      console.log("Can't enter, no ethereum connection detected.")
      console.log("DELETE ME: ", window.web3.toWei(amount, "ether"))
    }
  }

  render(){
    let amountFixed,
        rewardCalc,
        bonusSentence = "",
        reward        = "tier" + ICODates().tier + "Reward",
        num           = (this.state.amount * ICOContract[reward]).toFixed(6)
    if((((this.state.amount).toString().split(".").length - 1) === 1) && ((this.state.amount).toString().split(".")[1].length > 18)) amountFixed = (this.state.amount * 1).toFixed(18)
    else amountFixed = this.state.amount
    if(!isNaN(num)) rewardCalc = num
    else rewardCalc = 0
    if(ICODates().tier === 1)
      bonusSentence = "PLUS bonus LOTs based on Tier Two AND Tier Three sales! See below for more information."
    else if(ICODates().tier === 2)
      bonusSentence = "PLUS bonus LOTs based on Tier Three sales! See below for more information."

    console.log("ICO BUTTON PAGE :reward: ", reward, ", icoABI num: ", ICOContract[reward], ", multiple: ", ICOContract[reward] * this.state.amount, ", amountFixed: ", amountFixed, "tier: ", ICODates().tier)

    return(
      <div className="ICOButtonComponent">
        <ReactTooltip className={"customTheme screen" + this.props.screenIndex} effect="solid" multiline={true} />

        {(window.ethAdd === null) &&
          <div>
            <h3 className={'centred screen' + this.props.screenIndex}>
              No Ethereum Address Detected!
            </h3>
            <p className="centred">
              Please check your ethereum connection.
            </p>
          </div>
        }

        {(ICODates().tier === 0 && window.ethAdd !== null) &&
          <div
            className="preICOButton"
            data-tip=
            "When the ICO begins, this button will become active and will provide<br>
            a quick and easy way to send a transaction to our ICO contact. It will<br>
            allow you to join in the ICO quickly and easily, with just one click!"
            ></div>
        }

        {(ICODates().tier < 4 && ICODates().tier >= 1 && window.ethAdd !== null) &&
          <div>
          <div
            className="buyLOTsButton"
            data-tip="This button will pop-up your ethereum<br>
            client's transaction window, with a default <br>
            investment amount of 1 Ether. You can change<br>
            the number there to whatever you wish."
            onClick={() => this.handleClick()}
            >
          </div>
          <form className={"icoForm screen" + this.props.screenIndex}>
            <p>
              <span className={"styledSpan largerFont underlined centred screen" + this.props.screenIndex}><b>LOT Calculator</b></span>
            </p>

            <p className="justify">
              Enter the desired amount of ether below to calculate the number of LOT you will be rewarded with!
            </p>

            <input className={"screen" + this.props.screenIndex} type="text" name="amountEther" value={this.state.amount} onChange={this.handleChange}></input>
            <p className="centred">
              <span className={"styledSpan screen" + this.props.screenIndex}>{amountFixed}</span> Ether in
              <span className={"styledSpan screen" + this.props.screenIndex}><b> Tier {ICODates().tier}</b></span>

              <br/>
              = <span className={"styledSpan largerFont screen" + this.props.screenIndex}>{rewardCalc}</span> LOTs!
            </p>

            <p className="justify">
              {bonusSentence}
            </p>
          </form>
          </div>
        }

        {(ICODates().tier === 4 && window.ethAdd !== null) &&
          <div className="postICOButton"></div>
        }
      </div>
    )
  }
}
