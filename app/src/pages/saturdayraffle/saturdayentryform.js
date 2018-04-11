import React from 'react'
import Modal from 'react-modal'
import Raffle from '../../components/raffle'
import { EthContext } from '../../contexts/ethContext'
import LoadingIcon from '../../images/loadingIconGrey.svg'
import NotConnectedInfo from '../../components/modals/notconnectedinfo'

export default props => (
  <EthContext.Consumer>{eth => (
    <React.Fragment>
      { eth.loading ? <Loading screenIndex={props.screenIndex} />
      : !eth.web3   ? <NoCxn   screenIndex={props.screenIndex} />
      : !eth.ethAdd ? <Locked  screenIndex={props.screenIndex} />
      : eth.ethAdd  ? <Raffle  screenIndex={props.screenIndex} eth={eth} day={'Saturday'} pick={6} from={49} />
      : <NoCxn screenIndex={props.screenIndex} />}
    </React.Fragment>
  )}</EthContext.Consumer>
)

const Loading = props => (
  <div className='entryFormNotConnected'>
    <img className='loadingIcon' src={LoadingIcon} alt='Loading icon' />
  </div>
)

class NoCxn extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false
    }
    this.openModal =this.openModal.bind(this)
    this.closeModal=this.closeModal.bind(this)
  }

  openModal() {
    this.setState({modalIsOpen: true})
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }

  render() {
    return (
      <div className='entryFormNotConnected'>
        <p className={`centred styledSpan screen${this.props.screenIndex}`}>
          No ethereum connection detected!
          <br/>
          <a
            className={`centred screen${this.props.screenIndex}`}
            style={{cursor: 'pointer'}}
            onClick={this.openModal}>
            Learn how to get connected to play Etheraffle!
          </a>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            contentLabel='No Ethereum Connection Modal'
            className={`welcomeModalNotConnected screen${this.props.screenIndex}`}
            overlayClassName={`Overlay screen${this.props.screenIndex}`}
            shouldCloseOnOverlayClick={true}>
            <NotConnectedInfo screenIndex={this.props.screenIndex}/>
            <p className='justify'>
              If you were connected before seeing this message, your connection may have dropped or you may have rejected a transaction. Please check your ethereum connection method. If you're using Metamask, please make sure you are signed in. If using Mist, please make sure you have an account connected and have authorized it to interact with the <span className={`styledSpan screen&{this.props.screenIndex}`}>Etheraffle</span> ÐApp.
            </p>
            <p>
              <a className={`centred screen${this.props.screenIndex}`} onClick={()=>{window.location.reload()}}>Click to reload.</a>
            </p>
          </Modal>
        </p>
      </div>
    )
  }
}

const Locked = props => (
  <div className='entryFormNotConnected'>
    <p className='centred'>
      <span className={`styledSpan screen${props.screenIndex}`}>Cannot retrieve your ethereum address!</span>
      <br/>
      Please unlock your account to play Etheraffle!
    </p>
  </div>
)