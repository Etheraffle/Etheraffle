import React from 'react'
import Modal from 'react-modal'
import smallLogo from '../../images/eLogo.svg'
import playBlue from '../../images/playBlue.svg'
import playPink from '../../images/playPink.svg'
import NotConnectedInfo from './notconnectedinfo'
import playGreen from '../../images/playGreen.svg'
import playPurple from '../../images/playPurple.svg'
import bigLogo from '../../images/etheraffleLogo.svg'
import playBlueGrey from '../../images/playBlueGrey.svg'
import loadingIcon from '../../images/loadingIconGrey.svg'
//import checks from '../../web3/cxnChecks'

export default class WelcomeModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      mounted: false,
      modalIsOpen: true,
      cxnErr: null
    }
    this.openModal  = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount() {
    this.setState({mounted: true})
    /* To detect test networks...
    checks().then(() => {}).catch(err => {
      return this.setState({csnErr: err})
    })
    */
  }

  componentWillUnmount() {
    this.setState({mounted: false})
  }

  openModal() {
    if(this.state.mounted) this.setState({modalIsOpen: true})
  }

  closeModal() {
    if(this.state.mounted) this.setState({modalIsOpen: false})
  }

  render() {
    /* Choose which colour play button to display */
    let playButton, modalName
    if(this.props.screenIndex === 1) playButton = playGreen
    if(this.props.screenIndex === 2) playButton = playBlueGrey
    if(this.props.screenIndex === 3) playButton = playPink
    if(this.props.screenIndex === 4) playButton = playPurple
    if(this.props.screenIndex === 5) playButton = playBlue

    /* Conditionally style the modal depending on eth cxn */
    if((window.web3 === undefined || window.web3 === null || !window.web3.isConnected()) && this.props._key !== 'init') {
      modalName = "welcomeModalNotConnected screen" + this.props.screenIndex
    } else {
      modalName = "welcomeModal screen" + this.props.screenIndex
    }

    return(
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        contentLabel="Welcome Modal"
        className={modalName}
        overlayClassName={"Overlay screen" + this.props.screenIndex}
        shouldCloseOnOverlayClick={true}
      >
        {/* Big logo of small depending on screen sizes */}
        {window.innerWidth > 450 &&
          <img className='welcomeLogoBig' src={bigLogo} alt='Modal Welcome Logo'/>
        }
        {window.innerWidth <= 450 &&
          <img className='welcomeLogoSmall' src={smallLogo} alt='Modal Welcome Logo'/>
        }

        <h2 className={"screen" + this.props.screenIndex}>
          Welcome to the Etheraffle ÐApp - The best Ether lottery on the blockchain!
        </h2>

        <p className='centre' >
          So join in, buy a ticket, and win big all whilst helping charities worldwide!
        </p>

        {/* Placeholder whilst state is retrieved */}
        {this.props._key === 'init' &&
          <img className='loadingIcon' src={loadingIcon} alt='Loading icon' />
        }

        {/* Eth connection but account locked */}
        {((window.ethAdd === null || window.ethAdd === undefined) &&
          (window.web3 !== null && window.web3 !== undefined && window.web3.isConnected()) &&
          this.props._key !== 'init') &&
            <div className={"modalConnectedInfo screen" + this.props.screenIndex}>
              <div className='accountLocked'>
                <h3 className={'screen' + this.props.screenIndex}>
                  Ethereum connection detected:
                </h3>
                <p>
                  Please unlock your account to interact with this ÐApp
                </p>
              </div>

              {window.innerWidth <= 450 &&
              <p className='justify'>
                If you are seeing this on mobile, please make sure your ethererum account is unlocked and authorized to interact with the Etheraffle ÐApp.
                <a className={"centred screen" + this.props.screenIndex} style={{cursor: 'pointer'}} onClick={() => this.closeModal()}>
                  &nbsp; Just want a peek? Click to view the
                  <span className={"styledSpan screen" + this.props.screenIndex}>
                    &nbsp; Etheraffle &nbsp;
                  </span>
                  ÐApp anyway!
                </a>
              </p>
              }

              {window.innerWidth > 450 &&
                <p className='justify'>
                  If you are seeing this and using MetaMask, please make sure you unlock your account. If using the Mist browser or Parity, please make sure your ethereum account is connected and authorized to interact with the
                  <span className={"styledSpan screen" + this.props.screenIndex}>
                  &nbsp; Etheraffle &nbsp;
                  </span>
                   ÐApp.
                  <a className={"centred screen" + this.props.screenIndex} style={{cursor: 'pointer'}} onClick={() => this.closeModal()}>
                    &nbsp; Just want a peek? Click to view the
                    <span className={"styledSpan screen" + this.props.screenIndex}>
                    &nbsp; Etheraffle &nbsp;
                    </span>
                    ÐApp anyway!
                  </a>
                </p>
              }
          </div>
        }

        {/* Everything connected and working */}
        {((window.web3 !== undefined && window.web3 !== null && window.web3.isConnected()) && window.ethAdd !== null && this.props._key !== 'init') &&
          <div className={"modalConnectedInfo screen" + this.props.screenIndex}>

              <img className={'playButton screen' + this.props.screenIndex} src={playButton} alt='Play Button' onClick={this.closeModal} />

              <p>
                Ethereum Connection Detected - Have Fun!
                <br/>
                {/* Re-instate this bit once the prizepool is bigger!
                <br/>
                Don't miss out on your share of the
                <span className={"styledSpan screen" + this.props.screenIndex}>
                  &nbsp; {this.props.prizePool} &nbsp;
                </span>
                Ether won so far!!
                */}
                Your Ethereum address:&nbsp;
                <span className={"styledSpan screen" + this.props.screenIndex}>
                  &nbsp; {window.ethAdd} &nbsp;
                </span>
              </p>

              <p className="boilerplate justify">
                By clicking "play" or interacting with Etheraffle beyond these terms of use, you confirm that you are at least 18 years of age and you represent, warrant and agree to ensure that your use of our services will comply with all applicable laws, statutes and regulations in your location. Etheraffle.com is not responsible for any illegal or unauthorized use of our services by you.
              </p>
          </div>
        }

        {/* Modal plus extra bit at the bottom that shows when there is no eth connection */}
        {((window.web3 === undefined || window.web3 === null || !window.web3.isConnected()) && this.props._key !== 'init' ) &&
          <div>

            <NotConnectedInfo screenIndex={this.props.screenIndex} />

            <p>
              Want a peek? Click to visit <span style={{cursor: 'pointer'}} className={"invert styledSpan screen" + this.props.screenIndex} onClick={this.closeModal}>Etheraffle</span> anyway!<br/>
              {/*
              <a className={"centred screen" + this.props.screenIndex} style={{cursor: 'pointer'}} onClick={() => {window.location.reload()}}>
              If you are seeing this in error, click here to attempt to reconnect to the eth network.</a>
              */}
            </p>
          </div>
        }
      </Modal>
    )
  }
}
