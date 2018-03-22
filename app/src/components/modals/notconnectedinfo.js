import React from 'react'
import mist from '../../images/mistlogo.jpg'
import cipher from '../../images/cipherLogo.png'
import metamask from '../../images/metamasklogo.jpg'

export default class NotConnectedInfo extends React.Component {
  render() {
    return(
      <div className={"modalNotConnectedInfo screen" + this.props.screenIndex}>
        <p className='noCxn'>
          <span className={"styledSpan screen" + this.props.screenIndex}>
            No ethereum connection detected!
          </span>
        </p>

        {/* On non-tablet screens we render desktop solutions to ethereum connection issues */}
        {window.innerWidth > 800 &&
          <div>
            <div className='info'>
              <img className='metamaskLogo' src={metamask} alt='Metamask Logo' />
                <p className='justify'>
                  <span className={"styledSpan screen" + this.props.screenIndex}>
                    This is one to get you started!&nbsp;
                  </span>
                  <a className={"screen" + this.props.screenIndex} target="_blank" rel="noopener noreferrer" href="https://metamask.io/">
                    MetaMask is a bridge that allows you to visit the web of tomorrow in your browser today. It allows you to run ethereum ÐApps directly in your Chrome browser. Click for more info.
                  </a>
                </p>
            </div>

            <div className='info'>
              <img className='mistLogo' src={mist} alt='Mist Browser Logo' />
                <p className='justify'>
                  <span className={"styledSpan screen" + this.props.screenIndex}>
                    Want to try the browser of the future?&nbsp;
                  </span>
                  <a className={"screen" + this.props.screenIndex} target="_blank" rel="noopener noreferrer" href="https://github.com/ethereum/mist/releases" >
                    The Mist Browser is a web-browser and ethereum wallet hybrid. It is specifically tailored for non-technical users and so a top choice for browsing and using ÐApps. Click for more info.
                  </a>
                </p>
            </div>
          </div>
          }

          {/* On smaller screens we render mobile solutions to connection issue problems */}
          {window.innerWidth <= 800 &&
            <div className='info'>
              <img className='cipherLogo' src={cipher} alt='Cipher Browser Logo' />
                <p className='justify'>
                  <span className={"styledSpan screen" + this.props.screenIndex}>
                    On mobile?&nbsp;
                  </span>
                  <a className={"screen" + this.props.screenIndex} target="_blank" rel="noopener noreferrer" href="https://www.cipherbrowser.com/">
                    Cipher Browser is the world's first full-featured mobile dapp browser and wallet for the Ethereum blockchain. Click for more info.
                  </a>
                </p>
            </div>
          }

      </div>
    )
  }
}
