import React from 'react'
import moment from 'moment'
import utils from './utils'
import Modal from 'react-modal'
import ReactTooltip from 'react-tooltip'
import buyTicket from '../web3/buy_ticket'
import getGas from '../web3/get_gas_prices'
import getPrizePool from '../web3/get_prize_pool'
import getTktPrice from '../web3/get_ticket_price'
import buyFreeTicket from '../web3/buy_free_ticket'
import LoadingIcon from '../images/loading_icon_grey.svg'
import FreeLOTCounter from '../components/free_lot_counter'

// Require eth object props, raffle day, & pick from props and screenIndex
// TODO: implement prop types to enforce the above

export default class Raffle extends React.Component {
  
  constructor(props) {
		super(props)
		this.state = {
      gas: null,
			txErr: null,
			selected: [],
			selections: [],
      decided: false,
			prizePool: '...',
			tktPrice: '. . .',
			txHash: 'pending',
      modalIsOpen: false,
			priceDol: 'Exchange rate pending',
			prizeDol: 'Exchange rate pending'
		}
		this.getLowGas        = this.getLowGas.bind(this)
    this.randomise        = this.randomise.bind(this)
		this.openModal        = this.openModal.bind(this)
		this.closeModal       = this.closeModal.bind(this)
		this.handleChange     = this.handleChange.bind(this)
    this.makeDecision     = this.makeDecision.bind(this)
    this.removeSelected   = this.removeSelected.bind(this)
		this.sendTransaction  = this.sendTransaction.bind(this)
    this.getPriceAndPrize = this.getPriceAndPrize.bind(this)
  }

  componentDidMount() {
    this.getPriceAndPrize()
    this.getLowGas()
    this.removeSelected(Array.from(Array(this.props.pick + 1).keys()).slice(1))
  }

  getLowGas() { // Show safe low unless it's the day the raffle is drawn
    getGas().then(({ average, low }) => {
      this.setState({gas: moment(moment()).format('dddd') === this.props.day ? `${average} Gwei` : `${low} Gwei`})
    }).catch (err => console.log(`Error retrieving safe low gas rate: ${err}`))
  }

  openModal(_hasFreeLOT) {
    if (this.state.tktPrice > 0 && this.props.eth.ethAdd !== null) {
      if (!_hasFreeLOT) this.sendTransaction() // can leave undefined
      this.setState({modalIsOpen: true})
    } else {
      let txErr ='Error creating ethereum transaction - please check your connection and try again!'
      if (this.props.eth.ethAdd === null) 
        txErr = 'Ethereum account address inaccessible - please check your connection and try again!'
      else if (!(this.state.tktPrice > 0)) 
        txErr = 'Cannot retrieve ticket price from the smart contract - please check your connection and try again!'
      else if (this.props.eth.web3.version.network > 1) 
        txErr = 'Test network detected - please connect to the main ethereum network!'
      this.setState({modalIsOpen: true, txHash: null, txErr: txErr})
    }
  }

  closeModal() {
    this.setState({modalIsOpen: false, txHash: 'pending', decided: false})// Reset the txHash & decision
    this.getPriceAndPrize()
  }

  getPriceAndPrize() {
    let p1 = getPrizePool(this.props.eth.web3, this.props.day)
      , p2 = getTktPrice(this.props.eth.web3, this.props.day)
    return Promise.all([p1, p2])
    .then(([prize, price]) => {
      let pool     = this.props.eth.web3.fromWei(prize, 'ether')
        , tkt      = this.props.eth.web3.fromWei(price, 'ether')
        , err      = 'Exchange rate currently unavailable'
        , poolDol  = this.props.eth.exRate > 0 ? `$${utils.toDecimals(this.props.eth.exRate * pool, 2)} @ $${utils.toDecimals(this.props.eth.exRate, 2)} per ETH` : err
        , priceDol = this.props.eth.exRate > 0 ? `$${utils.toDecimals(this.props.eth.exRate * tkt,  2)} @ $${utils.toDecimals(this.props.eth.exRate, 2)} per ETH` : err
      this.setState({
        tktPrice:  tkt,
        prizePool: pool,
        poolDol:   poolDol,
        priceDol:  priceDol,
      })
      ReactTooltip.rebuild()
    }).catch(err => console.log(`Err in getPriceAndPrize: ${err}`))
  }

  sendTransaction(_bool) {
    let p
    _bool 
      ? (p = buyFreeTicket(this.props.eth.web3, this.props.day, this.props.eth.ethAdd, this.state.selected), this.props.eth.decrementFreeLOT()) 
      : p = buyTicket(this.props.eth.web3, this.props.day, this.props.eth.ethAdd, this.state.selected)
    p.then(txHash => {
      this.setState({txHash: txHash})
    }).catch(err => {
      console.log(`Error sending ethereum transaction: ${err}`)
      this.setState({txHash: null}) // Will popup the error buying ticket modal
    })
  }

  makeDecision(_bool) {
    this.sendTransaction(_bool)
    this.setState({decided: true})  
  }

  handleChange(event) {
    let arr = this.state.selected
    arr[parseInt(event.target.name,10) - 1] = parseInt(event.target.value, 10)
    this.removeSelected(arr)
  }

  randomise() {
    let rand = []
    for (let i = 0; i < this.props.pick; i++) {
      let n = Math.floor(Math.random() * this.props.from) + 1
      rand.includes(n) ? i-- : rand.push(n)
    }
    this.removeSelected(rand)
  }

  removeSelected(_selected) {
    let arrs = []
    for (let j = 0; j < _selected.length; j++) {
      let arr = Array.from(Array(this.props.from + 1).keys()).slice(1).map((x,i) => { if (!_selected.includes(x)) return <option key={`option${i + 1}`}>{x}</option>})
      arr.unshift(<option key={`num${j}${_selected[j]}`}>{_selected[j]}</option>)
      arrs.push(arr)
    }
    this.setState({selected: _selected, selections: arrs})
  }

  render() {
    return (
      <div className={`entryForm screen${this.props.screenIndex}`}>
        <ReactTooltip className={`customTheme screen${this.props.screenIndex}`} effect="solid" multiline={true} />
        <h2 className='prizePool' data-tip={this.state.poolDol}>
          Prizepool: <span className={`styledSpan largerFont screen${this.props.screenIndex}`}>{this.state.prizePool}</span> Ether!
        </h2>
        <div className={`pickNumbersForm screen${this.props.screenIndex}`}>
          <form className={`submitForm screen${this.props.screenIndex}`} onChange={this.handleChange}>
            <label className='numberPicker'>
              {this.state.selected.map((x,i) => (
                <select className={`screen${this.props.screenIndex}`} key={`${i+1}`} name={`${i+1}`} id={`${i+1}`} value={this.state.selected[i]} onChange={this.handleChange}>{this.state.selections[i]}</select>
              ))}
            </label>
          </form>
        </div>
        <p className='centred'>Pick your {this.props.pick} lucky numbers above, or hit the button below for a random selection!</p>
        <div className={`randomButton screen${this.props.screenIndex}`} onClick={this.randomise} />
        <p className='centred'>Then purchase your ticket to enter the draw!</p>
        <div className={`entryButton screen${this.props.screenIndex}`} onClick={() => this.openModal(this.props.eth.freeLOT)} />
        <Modal
          isOpen={this.state.modalIsOpen}
          shouldCloseOnOverlayClick={true} 
          onRequestClose={this.closeModal}
          contentLabel='Ticket Bought Modal'
          overlayClassName={`Overlay screen${this.props.screenIndex}`}
          className={`ticketBoughtModal screen${this.props.screenIndex}`} >
          {
            (this.props.eth.freeLOT > 0 && !this.state.decided)
            ? <Options screenIndex={this.props.screenIndex} decide={this.makeDecision} freeLOT={this.props.eth.freeLOT} />
            : this.state.txHash === 'pending'
            ? <Pending screenIndex={this.props.screenIndex} gas={this.state.gas} day={this.props.day} />
            : this.state.txHash
            ? <Success screenIndex={this.props.screenIndex} txHash={this.state.txHash} />
            : <Error   screenIndex={this.props.screenIndex} txErr={this.state.txErr} />
          }
        </Modal>
        <p className='ticketPrice centred' data-tip={this.state.priceDol} >
          Ticket Price: <span className={"styledSpan screen" + this.props.screenIndex}>{this.state.tktPrice}</span> Ether
        </p>
      </div>
    )
  }
}

const Options = props => (
  <React.Fragment>
    <FreeLOTCounter screenIndex={props.screenIndex}>
      <h1 className={`screen${props.screenIndex}`}>&ensp;x&ensp;{props.freeLOT}!</h1>
    </FreeLOTCounter>
    {props.freeLOT === 1 
      ? <React.Fragment>
          <p>You have <span className={`styledSpan screen${props.screenIndex}`}>one</span> free entry coupon to spend!</p>
          <p>Enter raffle for <span className={`styledSpan screen${props.screenIndex}`}>free</span> by using your coupon?</p>
        </React.Fragment>
      : <React.Fragment>
          <p>You have <span className={`styledSpan screen${props.screenIndex}`}>{props.freeLOT}</span> free entry coupons to spend!</p>
          <p>Enter raffle for <span className={`styledSpan screen${props.screenIndex}`}>free</span> by using one of your coupons?</p>
        </React.Fragment>
    }
    <div className='yesNoOptions'>
      <div className='yesNoButton yes' onClick={() => props.decide(true)} />
      <div className='yesNoButton no'  onClick={() => props.decide(false)} />  
    </div>
  </React.Fragment>
)
  
const Pending = props => (
  <React.Fragment>
    <h2 className={`screen${props.screenIndex}`}>Ticket Purchase In Progress . . .</h2>
    <img className='loadingIcon' src={LoadingIcon} style={{'margin':'0.8em 0 0 0'}} alt='Loading icon' />
    {props.gas && 
      <React.Fragment>
        {moment(moment()).format('dddd') === props.day
         ? <p>Recommended gas price: <span className={`styledSpan screen${props.screenIndex}`}>{props.gas}</span></p>
         : <p>Safe low gas price: <span className={`styledSpan screen${props.screenIndex}`}>{props.gas}</span></p>
        }
      </React.Fragment>
    }
  </React.Fragment>
)

const Success = props => (
  <React.Fragment>
    <h2 className={`screen${props.screenIndex}`}>Ticket Bought - Good Luck!</h2>
    <p className='centred'>
      Your transaction hash: 
      <a
      rel='noopener noreferrer'
      target='_blank'
      className={`invert screen${props.screenIndex}`}
      href={`https://etherscan.io/tx/${props.txHash}`}>
        {` ${props.txHash.substring(0, 20)}. . .`}
      </a>
      <br/>
      Once your transaction has been mined your ticket will appear in the results tab - good luck!
    </p>
  </React.Fragment>
)

const Error = props => (
  <React.Fragment>
    <h2 className={`screen${props.screenIndex}`}>Error creating transaction!</h2>
    {props.txErr 
      ? <p className='justify last'>{props.txErr}</p> 
      : <p className='justify last'>You may have rejected the transaction, or your connection may have dropped. Please check your ethereum client and make sure your account is unlocked.</p>
    }
  </React.Fragment>
)