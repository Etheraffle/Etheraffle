import React from 'react'
//import ReactTooltip from 'react-tooltip'
//import moment from 'moment'
import Highlight from 'react-highlight'
import hljs from 'highlight.js'
import hljsDefineSolidity from 'highlightjs-solidity'
import '../../../../node_modules/highlight.js/styles/foundation.css'

import ERMechanics from './ERMechanics'


export default class ICORedeemButton extends React.Component{

  componentDidMount(){
    hljsDefineSolidity(hljs)
    hljs.initHighlightingOnLoad()
  }

  render(){
    return(
      <div className="ICOInDepth">

      {/*<ReactTooltip className={"customTheme screen" + this.props.screenIndex} effect="solid" multiline={true} />*/}

        <p><span className="styledSpan centred largerFont" style={{'fontSize':'1.5em'}}><b>&#x274d;</b></span></p>

        <h2 className={"centred screen" + this.props.screenIndex}>In Depth Information</h2>

        <p>
          Blah blah blah, here's some example code etc etc
        </p>

        <Highlight className={"solidity code screen" + this.props.screenIndex}>
          {"function () payable returns (bool success) \{"}<br/>
          {"    uint256 = 5;"}<br/>
          {"\}"}
        </Highlight>

        <ERMechanics screenIndex={this.props.screenIndex}/>

      </div>
    )
  }
}
