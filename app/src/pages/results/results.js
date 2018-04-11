import React from 'react'
import Modal from 'react-modal'
import BigTables from './bigTables'
import SmallTables from './smallTables'
import { EthContext } from '../../contexts/ethContext'
import LoadingIcon from '../../images/loadingIconGrey.svg'
import NotConnectedInfo from '../../components/modals/notconnectedinfo'

export default props => (
  <div className={"contentWrapper si" + props.screenIndex}>
    <div className={"content ssi" + props.subScreenIndex}>
      <EthContext.Consumer>{eth => (
        <React.Fragment>
          {
              eth.loading   ? <Loading screenIndex={props.screenIndex} />
            : !eth.web3     ? <NoCxn   screenIndex={props.screenIndex} />
            : !eth.ethAdd   ? <Locked  screenIndex={props.screenIndex} />
            : eth.ethAdd    ? <GetData screenIndex={props.screenIndex} eth={eth} />
            : <NoCxn screenIndex={props.screenIndex} />
          }
        </React.Fragment>
      )}</EthContext.Consumer>
    </div>
  </div>
)

const Loading = props => (
  <React.Fragment>
    <br/><h2 className={`centred screen${props.screenIndex}`}>Loading results!</h2><br/>
    <img className='loadingIcon centred' src={LoadingIcon} alt='Loading Icon' />
  </React.Fragment>
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
            Learn how to get connected to see your results!
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
      Please unlock your account to see your results!
    </p>
  </div>
)

const NoDB = props => (
  <React.Fragment>
    <br/>
    <h2 className={`centred screen${props.screenIndex}`}>Database Error!</h2>
    <p className='centred'>We apologise and are working to fix the problem.</p>
  </React.Fragment>
)

const NoEntries = props => (
  <React.Fragment>
    <br/>
    <h2 className={`centred screen${props.screenIndex}`}>You haven't entered any raffles yet!</h2>
    {window.innerWidth > 450 
      ? <p className='centred'>Enter a raffle to be in with a chance to win ether!</p>
      : <p className='centred'>Enter a raffle to be<br/> in with a chance to win ether!</p>
    }
  </React.Fragment>
)


//Renders either loading => db down => no results => or finally desktop or mobile tables
class GetData extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: null,
      dbErr: null,
      loading: true,
      numRaffles: null
    }
  }

  componentDidMount() {
    return fetch('https://etheraffle.com/api/ethaddress', {
      method:  'POST',
      headers: {'content-type': 'application/JSON'},
      body:    JSON.stringify({ethAdd: this.props.eth.ethAdd})
    }).then(res => {
      if (res.status === 503) return this.setState({dbErr: 'Returned a 503'})
      if (res.status !== 200) return this.setState({dbErr: 'Unknown Error!'})
      return res.json()
      .then(json => {
        if (json.raffleIDs === undefined) this.setState({numRaffles: null, loading: false})
        else this.setState({numRaffles: json.raffleIDs.length, data: json, loading: false})
      })
    }).catch(err => {
      console.log("Error retrieving results: ", err)
      this.setState({dbErr: 'Unknown database error!', loading: false})
    })
  }

  render() { 
    return (
      <React.Fragment>
        {
          this.state.loading
          ? <Loading screenIndex={this.props.screenIndex} />
          : this.state.dbErr 
          ? <NoDB screenIndex={this.props.screenIndex} />
          : !this.state.numRaffles
          ? <NoEntries screenIndex={this.props.screenIndex} />
          : window.innerWidth > 450 
          ? <BigTables   screenIndex={this.props.screenIndex} eth={this.props.eth} data={this.state.data} />
          : <SmallTables screenIndex={this.props.screenIndex} eth={this.props.eth} data={this.state.data} />
        }
      </React.Fragment>
    )
  }
}