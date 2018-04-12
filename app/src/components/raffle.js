import React from 'react'
import utils from './utils'
import Modal from 'react-modal'
import lowGas from '../web3/getLowGas'
import ReactTooltip from 'react-tooltip'
import buyTicket from '../web3/buyTicket'
import getPrizePool from '../web3/getPrizePool'
import getTktPrice from '../web3/getTicketPrice'
import LoadingIcon from '../images/loadingIconGrey.svg'

//Require eth object props, raffle day, & pick from props and screenIndex
//TODO: implement prop types to enforce the above

export default class Raffle extends React.Component {
  
  constructor(props) {
		super(props)
		this.state = {
			txErr: null,
			selected: [],
			safeLow: null,
			selections: [],
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
    this.removeSelected   = this.removeSelected.bind(this)
		this.sendTransaction  = this.sendTransaction.bind(this)
    this.getPriceAndPrize = this.getPriceAndPrize.bind(this)
  }

  componentDidMount() {
    this.getPriceAndPrize()
    this.getLowGas()
    this.removeSelected(Array.from(Array(this.props.pick + 1).keys()).slice(1))
  }

  getLowGas() {
    return lowGas()
    .then(safeLow => {
      this.setState({safeLow: `${safeLow} Gwei`})
    }).catch (err => console.log(`Error retrieving safe low gas rate: ${err}`))
  }

  openModal() {
    if (this.state.tktPrice > 0 && this.props.eth.ethAdd !== null) {
      this.sendTransaction()
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
    this.setState({modalIsOpen: false, txHash: 'pending'})// Reset the txHash
    this.getPriceAndPrize()
  }

  getPriceAndPrize() {
    let p1 = getPrizePool(this.props.eth.web3, this.props.day)
      , p2 = getTktPrice(this.props.eth.web3, this.props.day)
    return Promise.all([p1, p2])
    .then(([prize,price]) => {
      let pool     = this.props.eth.web3.fromWei(prize, 'ether')
        , tkt      = this.props.eth.web3.fromWei(price, 'ether')
        , err      = 'Exchange rate currently unavailable'
        , poolDol  = this.props.eth.exRate > 0 ? `$${utils.toDecimals(this.props.eth.exRate * pool, 2)}` : err
        , priceDol = this.props.eth.exRate > 0 ? `$${utils.toDecimals(this.props.eth.exRate * tkt,  2)}` : err
      this.setState({
        tktPrice:  tkt,
        prizePool: pool,
        poolDol:   poolDol,
        priceDol:  priceDol,
      })
      ReactTooltip.rebuild()
    }).catch(err => console.log(`Err in getPriceAndPrize: ${err}`))
  }

  sendTransaction() {
    return buyTicket(this.props.eth.web3, this.props.day, this.props.eth.ethAdd, this.state.selected)
    .then(txHash => {
      this.setState({txHash: txHash})
    }).catch(err => {
      console.log(`Error sending ethereum transaction: ${err}`)
      this.setState({txHash: null})// Will popup the error buying ticket modal
    })
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
        <p className='centred'>
          Pick your {this.props.pick} lucky numbers - or <span onClick={this.randomise} className={`styledSpan screen${this.props.screenIndex}`} style={{'cursor':'pointer'}}>random</span> ones -  then buy your ticket to enter the draw!
        </p>
        <div className={`entryButton screen${this.props.screenIndex}`} onClick={() => this.openModal()} />
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel='Ticket Bought Modal'
          className={`ticketBoughtModal screen${this.props.screenIndex}`}
          overlayClassName={`Overlay screen${this.props.screenIndex}`}
          shouldCloseOnOverlayClick={true}>
            {
              this.state.txHash === 'pending'
              ? <Pending screenIndex={this.props.screenIndex} safeLow={this.state.safeLow} />
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
  
const Pending = props => (
  <div>
    <h2 className={`screen${props.screenIndex}`}>Ticket Purchase In Progress . . .</h2>
    <img className='loadingIcon' src={LoadingIcon} style={{'margin':'0.8em 0 0 0'}} alt='Loading icon' />
    {props.safeLow &&
      <p>
        Safe low gas price: <span className={`styledSpan screen${props.screenIndex}`}>{props.safeLow}</span>
      </p>
    }
  </div>
)

const Success = props => (
  <div>
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
  </div>
)

const Error = props => (
  <div>
    <h2 className={`screen${props.screenIndex}`}>Error creating transaction!</h2>
    {props.txErr 
      ? <p className='justify last'>{props.txErr}</p> 
      : <p className='justify last'>You may have rejected the transaction, or your connection may have dropped. Please check your ethereum client and make sure your account is unlocked.</p>
    }
  </div>
)