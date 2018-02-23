import React, { Component } from 'react'
import MetaMask from '../../../images/metamasklogo.jpg'
import Mist from '../../../images/mistlogo.jpg'

export default class HowDoIKnowIfIveWon extends Component {
  render(){
    return(
      <div>

        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          You don't need a username, a password or even to log in at all to play Etheraffle! All you need is an ethereum address, and then to visit the Etheraffle ÐApp in an ethereum-enabled browser. Two great options are either MetaMask - a plugin for the chrome browser, or Mist - an entirely new, ethererum based browser:
        </p>

        <div className="row">

          <img className='image' src={MetaMask} alt='Metamask Logo' style={{'width':'5em','padding':'1em'}} />

          <p className="justify">
            <a
              className={"screen" + this.props.screenIndex}
              target="_blank"
              rel="noopener noreferrer"
              href="https://metamask.io/">
              <span className={'styledSpan screen' + this.props.screenIndex}>
                <b>&#x274d;&ensp;</b>
              </span>
              MetaMask is a plugin that allows you to visit the web of tomorrow in your browser today. It allows you to interact with ethereum ÐApps directly in Chrome! Click for more info.
            </a>
          </p>
        </div>

        <br/>

        <div className="row">

          <img className='image' src={Mist} alt='Mist Logo' style={{'width':'5em','padding':'1em'}} />

          <p className="justify">
            <a
              className={"screen" + this.props.screenIndex}
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/ethereum/mist/releases">
              <span className={'styledSpan screen' + this.props.screenIndex}>
                <b>&#x274d;&ensp;</b>
              </span>
              Mist is a web-browser and ethereum wallet hybrid. It is specifically tailored for non-technical users and so a top choice for browsing and using ÐApps. Click for more info.
            </a>
          </p>
        </div>

        <p className='justify'>
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          After installing one of the above options, visit Etheraffle.com and you will see it automatically detect your ethereum connection and address, allowing you to interact with the Etheraffle ÐApp and get winning!
        </p>

      </div>
    )
  }
}
