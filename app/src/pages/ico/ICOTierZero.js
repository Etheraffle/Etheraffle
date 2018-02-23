import React from 'react'

export default class ICOTierZero extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      screenIndex: this.props.screenIndex
    }
  }

  render(){
    return(
      <div>
        <p>
          <span className="styledSpan centred largerFont" style={{'fontSize':'1.5em'}}><b>&#x274d;</b></span>
          Tier Zero: If you've made it this far...and have read the contract, you may have noticed that the payable fallback function involved in taking part in this ICO is currently active, and open to receiving ether. Tier Zero is this preICO period, currently running NOW!
        </p>
      </div>
    )
  }
}
