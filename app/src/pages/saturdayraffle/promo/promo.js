import React from 'react'
import Redeem from './redeem'
import dates from './icoDates'
import PromoCounter from './promoCounter'
import hasRedeemed from './web3/getHasRedeemed'
import getNumEntries from './web3/getNumEntries'
import loadingIcon from '../../../images/loadingIconGrey.svg'

export default class Promo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            reward: null,
            entries: null,
            redeemed: null,
            mounted: false,
            tktPrice: 0.003
        }
        this.getEntries = this.getEntries.bind(this)
    }

    componentDidMount() {
        this.setState({mounted: true})
        this.getEntries()
    }

    componentWillUnmount() {
        if (this.state.mounted) this.setState({mounted: false})
    }

    getEntries() {
        if (window.ethAdd === undefined) setTimeout(this.getEntries, 1000) // Wait until web3 detected
        else if (window.ethAdd === null) return this.setState({entries: 'Error'})
        else return hasRedeemed(window.ethAdd).then(bool => {
            if (this.state.mounted) this.setState({redeemed: bool})
            return getNumEntries(window.ethAdd)
            .then(entries => {
                this.setState({
                    entries: entries,
                    reward: entries * dates.rate * this.state.tktPrice
                })
            })
        }).catch(err => {
            this.setState({entries: 'Error'})
            console.log(err)
        })
    }

    render() {
        return(
            <div className='promo'>
                
                <br/>

                <h2 className={'centred screen' + this.props.screenIndex}>
                    LOT Token Promotion!
                </h2>
                
                {/* Eth address set */}
                {window.ethAdd &&
                    
                    <div>
                    
                    {(
                        this.state.entries === null &&
                        this.state.reward === null &&
                        this.state.redeemed === null
                    ) &&
                        <img className='loadingIcon centred' src={loadingIcon} alt='Loading icon' />
                    }

                    {this.state.entries !== 'Error' &&
                        <div>
                            {!this.state.redeemed &&
                                <div className='promoLOT'>
                                    <PromoCounter>
                                        <h1>&ensp;x&ensp;{this.state.reward}!</h1>
                                    </PromoCounter>
                                    <Redeem 
                                        reward={this.state.reward} 
                                        entries={this.state.entries} 
                                        tktPrice={this.state.tktPrice}
                                        screenIndex={this.props.screenIndex} />
                                </div>
                            }

                            {this.state.redeemed &&
                                <div className='promoLOT'>
                                    <PromoCounter>
                                        <h1>&ensp;x&ensp;{this.state.reward}!</h1>
                                    </PromoCounter>
                                    <p className='centred'>
                                    <span className={'styledSpan screen' + this.props.screenIndex}>Congratulations!</span> - You've redeemed the promo LOT tokens you earnt this week! Come back next week to start earning more!
                                    </p>
                                </div>
                            }
                        </div>
                    }
                    </div>
                }

                {/* Web3 but eth accounts locked */}
                {( 
                    window.web3 &&
                    this.state.entries === 'Error'
                ) &&

                    <div className='promoLOT'>
                        <PromoCounter />
                        <p className='centred'>Unlock your account to see how many LOT tokens you've earnt!</p>
                    </div>
                }

                {/* No web3 */}
                {( 
                    !window.web3 &&
                    this.state.entries === 'Error'
                ) &&

                    <div className='promoLOT'>
                        <PromoCounter />
                        <p className='centred'>
                            You need an ethereum-enable browser in order to play Etheraffle and start earning LOT tokens!
                        </p>
                    </div>
                }

                <br/>

                <p className='justify'>
                    Etheraffle is a truly decentralized charitable lottery created to give huge prizes to players, sustainable ETH dividends to <span className={'styledSpan screen' + this.props.screenIndex}>LOT token</span> holders, and life-changing funding to charities. The <a className={'invert screen' + this.props.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Etheraffle ICO's</a> goal is to create as many LOT token holders as possible. To help achieve this, anyone who plays Etheraffle ALSO earns free LOT tokens! You can earn LOT every time you enter - so get playing! See the FAQ for how to claim and more details. 
                </p>
            </div>
        )
    }
}