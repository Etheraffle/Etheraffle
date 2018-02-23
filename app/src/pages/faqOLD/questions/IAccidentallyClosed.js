import React, { Component } from 'react'

export default class IAccidentallyClosed extends Component {
/*
<div className='image centred'>
  <img className='imageBorder'style={{'margin':'12px'}} src={multiple} alt='Table showing multiple wins'/>
</div>
*/
  render(){
    return(
      <div>
        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          Don't worry, once you have you bought an Etheraffle ticket, the details of your purchase are stored on the blockchain <i>forever</i>. You literally cannot lose your ticket! And no one else can steal it! Or take your winnings! Even Etheraffle can do nothing to alter your ticket! Because we are powered by the blockchain, Etheraffle is <i>trustless</i>, which means you don't <i>have to</i>, or even <i>need</i> to trust us, we are a decentralised entity leaving you and <i>only you</i> fully in control of your Etheraffle tickets!
        </p>
      </div>
    )
  }
}
