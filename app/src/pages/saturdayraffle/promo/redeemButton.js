import React from 'react'
import Modal from 'react-modal'
import redeemBonus from './web3/redeemBonus'
//import utils from '../../../components/utils'
import getLowGas from '../../../web3/getLowGas'
import loadingIcon from '../../../images/loadingIconGrey.svg'
import NotConnectedInfo from '../../../components/modals/notconnectedinfo'

export default class RedeemButton extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            txErr: '',
            safeLow: null,//only render if not null...
            mounted: false,
            redeemed: false,
            txHash: 'pending',
            modalIsOpen: false
        }
        this.getGas        = this.getGas.bind(this)
        this.openModal     = this.openModal.bind(this)
        this.closeModal    = this.closeModal.bind(this)
        this.redeemBonusTX = this.redeemBonusTX.bind(this)
    }

    componentDidMount() {
        this.setState({mounted: true})
        this.getGas()
    }

    componentWillUnmount() {
        this.setState({mounted: false})
    }

    getGas() {
        return getLowGas()
        .then(gas => {
            if (this.state.mounted) this.setState({safeLow: `${gas} Gwei`})
        }).catch(err => {
            console.log(err)
        })
    }

    openModal() {
        if (window.web3 && window.web3.isConnected() === true) {// Eth connection good...
            if (window.ethAdd) {//Everything fine, redeem bonus...
                if (this.state.mounted) this.setState({modalIsOpen: true})
                this.redeemBonusTX()
            } else {//Either no entries, already claimed or ethAdd is missing...
                let txErr = 'Error executing transaction!'
                if (!(this.props.entries > 0)) txErr = 'Cannot redeem your free LOT, your number of raffle entries is unknown!'
                else if (window.ethAdd === null) txErr = 'Ethereum account address inaccessible!'
                else if (window.web3.version.network > 1) txErr = 'Test network detected - please connect to the main ethereum network!'
                if (this.state.mounted) this.setState({modalIsOpen: true, txHash: null, txError: txErr})
            }
        } else {//No ethereum connection modal!
            if (this.state.mounted) this.setState({modalIsOpen: true, txHash: null})
        }
    }
    
    closeModal() {
        if (this.state.mounted) this.setState({modalIsOpen: false, txHash: 'pending'})// reset the txHash
    }

    redeemBonusTX() {
        return redeemBonus(window.ethAdd)
        .then(txHash => {
            if (this.state.mounted) this.setState({txHash: txHash, redeemed: true})
        }).catch(err => {// TODO: make this popup the error buying ticket modal
            console.log('Error redeeming bonus: ', err)
            if (this.state.mounted) this.setState({txHash: null, txErr: err.msg})
        })
    }
    
    render() {
        return(
            <div>
                {/* Redeem Button */}
                {!this.state.redeemed &&
                    <div className={'redeemButton screen' + this.props.screenIndex} onClick={() => this.openModal()} />
                }
                {this.state.redeemed &&
                    <div className={'redeemButton redeemedScreen' + this.props.screenIndex} />
                }

                {/* LOT Redeemed modal */}
                {window.ethAdd &&
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.closeModal}
                        contentLabel='Redeem LOT Modal'
                        className={'ticketBoughtModal screen' + this.props.screenIndex}
                        overlayClassName={'Overlay screen' + this.props.screenIndex}
                        shouldCloseOnOverlayClick={true}>

                        {/* Modal whilst waiting for txHash to come in */}
                        {this.state.txHash === 'pending' &&
                            <div>

                                <h2 className={'screen' + this.props.screenIndex}>
                                    LOT Redemption In Progress . . .
                                </h2>

                                <img className='loadingIcon' src={loadingIcon} style={{'margin':'0.8em 0 0 0'}} alt='Loading icon' />

                                {this.state.safeLow !== 'pending' &&
                                    <p>
                                    Safe low gas price:
                                    <span className={'styledSpan screen' + this.props.screenIndex}>
                                        &nbsp;{this.state.safeLow}
                                    </span>
                                    </p>
                                }
                            </div>
                        }

                        {/* Modal when txHash successfully comes in */}
                        {(this.state.txHash !== null && this.state.txHash !== 'pending') &&
                            <div>
                                <h2
                                className={'screen' + this.props.screenIndex}>
                                    LOT Tokens Redeemed!
                                </h2>
                                <p className='centred'>
                                    Your transaction hash: 
                                    <a
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    className={'invert screen' + this.props.screenIndex}
                                    href={'https://etherscan.io/tx/' + this.state.txHash}>
                                    {this.state.txHash.substring(0, 20) + ' . . .'}
                                    </a>
                                    <br/>
                                    Once your transaction has been mined your LOT tokens will appear in your wallet!
                                </p>
                            </div>
                        }

                        {/* Modal for when there's an error redeeming */}
                        {this.state.txHash === null &&
                            <div>
                                <h2 className={'screen' + this.props.screenIndex}>
                                    Error redeeming LOT tokens!
                                </h2>

                                {this.state.txErr !== '' &&
                                    <p>
                                        {this.state.txErr}
                                    </p>
                                }

                                {this.state.txErr === '' &&
                                    <p className='centred justify'>
                                        You may have rejected the transaction, or your connection may have dropped. Please check your ethereum client and make sure your account is unlocked.
                                    </p>
                                }
                            </div>
                        }
                    </Modal>
                }

                {!window.ethAdd &&
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.closeModal}
                        contentLabel="No Ethereum Connection Modal"
                        className={"welcomeModalNotConnected screen" + this.props.screenIndex}
                        overlayClassName={"Overlay screen" + this.props.screenIndex}
                        shouldCloseOnOverlayClick={true}>

                        <NotConnectedInfo screenIndex={this.props.screenIndex}/>

                        <p className="justify">
                            If you were connected before seeing this message, your connection may have dropped or you may have rejected a transaction. Please check your ethereum connection method. If you're using Metamask, please make sure you are signed in. If using Mist, please make sure you have an account connected and have authorized it to interact with the <span className={"styledSpan screen" + this.props.screenIndex}>Etheraffle</span> ÐApp.
                        </p>
                        <p>
                            <a
                            className={"centred screen" + this.props.screenIndex}
                            style={{cursor: 'pointer'}}
                            onClick={()=>{window.location.reload()}}>
                            Click to reload.
                            </a>
                        </p>
                    </Modal>
                }
            </div>
        )
    }
}