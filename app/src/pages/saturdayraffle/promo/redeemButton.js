import React from 'react'
import Modal from 'react-modal'
import redeemBonus from './web3/redeemBonus'
import lowGas from '../../../web3/getLowGas'
import LoadingIcon from '../../../images/loadingIconGrey.svg'

export default class RedeemButton extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			txErr: null,
			safeLow: null,
			redeemed: false,
			txHash: 'pending',
			modalIsOpen: false
		}
		this.getLowGas     = this.getLowGas.bind(this)
		this.openModal     = this.openModal.bind(this)
		this.closeModal    = this.closeModal.bind(this)
		this.redeemBonusTX = this.redeemBonusTX.bind(this)
	}

	componentDidMount() {
		this.getLowGas()
	}

	getLowGas() {
		return lowGas()
		.then(safeLow => {
		  this.setState({safeLow: `${safeLow} Gwei`})
    }).catch (err => console.log(`Error retrieving safe low gas rate: ${err}`))
  }

	openModal() {
		if (this.props.eth.ethAdd) {
			this.redeemBonusTX()
			this.setState({modalIsOpen: true})
    } else {
			let txErr ='Error creating ethereum transaction - please check your connection and try again!'
			if (!(this.props.entries > 0)) 
				txErr = 'Cannot redeem your free LOT, your number of raffle entries is unknown!'
			else if (this.props.eth.ethAdd === null) 
			  txErr = 'Ethereum account address inaccessible - please check your connection and try again!'
			else if (this.props.eth.web3.version.network > 1) 
			  txErr = 'Test network detected - please connect to the main ethereum network!'
			this.setState({modalIsOpen: true, txHash: null, txErr: txErr})
    }
	}
	
	closeModal() {
		this.setState({modalIsOpen: false, txHash: 'pending'})// reset the txHash
	}

	redeemBonusTX() {
		return redeemBonus(this.props.eth.web3, this.props.eth.ethAdd)
		.then(txHash => {
			this.setState({txHash: txHash, redeemed: true})
		}).catch(err => {
			console.log('Error redeeming bonus: ', err)
			this.setState({txHash: null, txErr: err.msg})
		})
	}
	
	render() {
		return (
			<React.Fragment>
				{/* Redeem Button */}
        {this.state.redeemed
          ?<div className={'redeemButton redeemedScreen' + this.props.screenIndex} />
          : <div className={'redeemButton screen' + this.props.screenIndex} onClick={() => this.openModal()} />
        }
				<Modal
					isOpen={this.state.modalIsOpen}
					onRequestClose={this.closeModal}
					contentLabel='Redeem LOT Modal'
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
			</React.Fragment>
		)
	}
}

const Pending = props => (
	<div>
	  <h2 className={`screen${props.screenIndex}`}>LOT Redemption In Progress . . .</h2>
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
	  <h2 className={`screen${props.screenIndex}`}>LOT Tokens Redeemed!</h2>
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
		Once your transaction has been mined your LOT tokens will appear in your wallet!
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