import React, { Component } from 'react'
import TheAccordion from './accordion.js'

export default class Help extends Component {
  render(){
    return(
      <div className={"contentWrapper si" + this.props.screenIndex}>
        <div className={"content ssi" + this.props.subScreenIndex}>

          <h2 className={'centred screen' + this.props.screenIndex}>
            <span style={{'color':'#717171'}}><b>&#x274d;&ensp;</b></span>
              Frequently Asked Questions
            <span style={{'color':'#717171'}}><b>&ensp;&#x274d;</b></span>
          </h2>

          <TheAccordion screenIndex={this.props.screenIndex} />
          
        </div>
      </div>
    )
  }
}
