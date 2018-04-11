import React from 'react'
import Modal from 'react-modal'
import smallLogo from '../../images/eLogo.svg'
import NotConnectedInfo from './notconnectedinfo'
import bigLogo from '../../images/etheraffleLogo.svg'
import { EthContext } from '../../contexts/ethContext'
import LoadingIcon from '../../images/loadingIconGrey.svg'

export default class WelcomeModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: true,
    }
    this.openModal  = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({modalIsOpen: true})
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }

  render() {
    const {screenIndex: sI} = this.props
    return (
      <EthContext.Consumer>
        {eth => (
          <Modal
            className={eth.web3 ? `welcomeModal screen${sI}` : `welcomeModalNotConnected screen${sI}`}
            contentLabel="Welcome Modal"
            isOpen={this.state.modalIsOpen}
            shouldCloseOnOverlayClick={true}
            onRequestClose={this.closeModal}
            overlayClassName={`Overlay screen${sI}`}
            >
            <img className='welcomeLogoBig' src={window.innerWidth > 450 ? bigLogo : smallLogo} alt='Modal Welcome Logo'/>
            <h2 className={`screen${sI}`}>
              Welcome to Etheraffle - The World's First Truly Decentralized Charitable Lottery!
            </h2>
            <p className='centre'>
              So join in, buy a ticket and win big all whilst helping good causes worldwide!
            </p>
            {
                eth.loading ? <Loading sI={sI} />
              : !eth.web3   ? <NoCxn   sI={sI} closeModal={this.closeModal} />
              : !eth.ethAdd ? <Locked  sI={sI} closeModal={this.closeModal} />
              : eth.ethAdd  ? <Play    sI={sI} closeModal={this.closeModal} />
              : <NoCxn sI={sI} />
            }
          </Modal>
        )}
      </EthContext.Consumer>
    )
  }
}

const Loading = props => (
  <img className='loadingIcon' src={LoadingIcon} alt='Loading icon' />
)

const NoCxn = props => (
  <React.Fragment>
    <NotConnectedInfo sI={props.sI} />
    <p>
      Want a peek? Click to visit <span style={{cursor: 'pointer'}} className={`invert styledSpan screen${props.sI}`} onClick={props.closeModal}>Etheraffle</span> anyway!<br/>
    </p>
  </React.Fragment>
)

const Locked = props => (
  <div className={`modalConnectedInfo screen${props.sI}`}>
    <div className='accountLocked'>
      <h3 className={'screen' + props.sI}>
        Ethereum connection detected:
      </h3>
      <p>
        Please unlock your account to interact with this ÐApp!
      </p>
    </div>
    <p className='justify'>
      If you are seeing this and using MetaMask, please make sure you unlock your account. If using the Mist browser or are on mobile, please make sure your ethereum account is connected and authorized to interact with the <span className={`styledSpan screen${props.sI}`}>Etheraffle</span> ÐApp.
      <a className={`centred screen${props.sI}`} style={{cursor: 'pointer'}} onClick={props.closeModal}>
        &nbsp; Just want a peek? Click to view the
        <span className={"styledSpan screen" + props.sI}>
        &nbsp; Etheraffle &nbsp;
        </span>
        ÐApp anyway!
      </a>
    </p>
  </div>
)

const Play = props => (
  <div className={`modalConnectedInfo screen${props.sI}`}>
    <img className={`playButton screen${props.sI}`} src={require(`../../images/play${props.sI}.svg`)} alt='Play Button' onClick={props.closeModal} />
    <p>
      Ethereum Connection Detected - Have Fun!
    </p>
    <p className='boilerplate justify'>
      By clicking "play" or interacting with Etheraffle beyond these terms of use, you confirm that you are at least 18 years of age and you represent, warrant and agree to ensure that your use of our services will comply with all applicable laws, statutes and regulations in your location. Etheraffle.com is not responsible for any illegal or unauthorized use of our services by you.
    </p>
  </div>
)
