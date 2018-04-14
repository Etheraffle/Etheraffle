import React from 'react'
import Redeem from './redeem'
import dates from './icoDates'
import PromoCounter from './promoCounter'
import hasRedeemed from './web3/getHasRedeemed'
import getNumEntries from './web3/getNumEntries'
import getTktPrice from '../../../web3/getTicketPrice'
import LoadingIcon from '../../../images/loadingIconGrey.svg'
import { ScreenContext } from '../../../contexts/screenContext'


export default class Promo extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			reward: null,
      loading: true,
			entries: null,
			redeemed: null,
      tktPrice: null
    }
    this.getDetails = this.getDetails.bind(this)
	}

	componentDidMount() {
    this.getDetails()
  }
  
  getDetails() {
    if (this.props.eth.loading) setTimeout(this.getDetails, 1000) // Wait until web3 detected
    hasRedeemed(this.props.eth.web3, this.props.eth.ethAdd).then(bool => {
      this.setState({redeemed: bool})
      return getTktPrice(this.props.eth.web3, 'Saturday')
      .then(price => { 
        return getNumEntries(this.props.eth.web3, this.props.eth.ethAdd)
        .then(entries => {
          this.setState({
            loading:  false,
            entries:  entries,
            tktPrice: this.props.eth.web3.fromWei(price, 'ether'),
            reward:   entries * dates.rate * this.props.eth.web3.fromWei(price, 'ether')
          })
        })
      })
    }).catch(err => {
      console.log(`Error reading smart-contract: ${err}`)
      this.setState({entries: 'Error'})
    })
  }

	render() {
		return (
			<div className='promo'>
				<br/>
				<h2 className={`centred screen${this.props.screenIndex}`}>LOT Token Promotion!</h2>
        <React.Fragment>
          {
            this.props.eth.loading   ? <Loading /> 
            : !this.props.eth.web3   ? <NoCxn    screenIndex={this.props.screenIndex} closed={this.props.closed} />
            : !this.props.eth.ethAdd ? <Locked   screenIndex={this.props.screenIndex} closed={this.props.closed} />
            : this.props.eth.ethAdd  ? <Unlocked screenIndex={this.props.screenIndex} closed={this.props.closed} state={this.state} eth={this.props.eth} />
            : <NoCxn screenIndex={this.props.screenIndex} closed={this.props.closed} />
          }
        </React.Fragment>
        <br/>
        <ScreenContext.Consumer>
          {({FAQ}) => (
            <p className='justify'>
              Etheraffle is a truly decentralized charitable lottery created to give huge prizes to players, sustainable ETH dividends to <span className={`styledSpan screen${this.props.screenIndex}`}>LOT token</span> holders, and life-changing funding to charities. The <a className={`invert screen${this.props.screenIndex}`} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Etheraffle ICO's</a> goal is to create as many LOT token holders as possible. To help achieve this, anyone who plays Etheraffle ALSO earns free LOT tokens! You can earn LOT every time you enter - so get playing! See the <span className={`styledSpan screen${this.props.screenIndex}`} style={{'cursor':'pointer'}} onClick={FAQ}>FAQ</span> for how to claim and more details. 
            </p>
          )}
        </ScreenContext.Consumer>
			</div>
		)
	}
}

const Loading = props => (
  <img className='loadingIcon' src={LoadingIcon} style={{'display':'flex','margin':'1em auto 1em auto'}} alt='Loading icon' />
)

const NoCxn = props => (
  <div className='promoLOT'>
    <PromoCounter />
    <p className='centred'>
      You need an ethereum-enabled browser in order to play Etheraffle and start earning LOT tokens!
    </p>
  </div>
)

const Locked = props => (
  <div className='promoLOT'>
    <PromoCounter />
    <p className='centred'>Unlock your account to see how many LOT tokens you've earnt!</p>
  </div>
)

const Unlocked = props => (
  <React.Fragment>
    {
      props.closed ? <Closed />
      : props.state.loading ? <Loading />
      : props.state.entries === 'Error' ? <Error />
      : props.state.redeemed ? <Redeemed reward={props.state.reward} screenIndex={props.screenIndex} />
      : <NotRedeemed 
          eth={props.eth}
          reward={props.state.reward} 
          entries={props.state.entries} 
          tktPrice={props.state.tktPrice}
          screenIndex={props.screenIndex} />
    }
  </React.Fragment>
)

const Closed = props => (
  <div className='promoLOT'>
    <PromoCounter />
    <p className='centred'>Entry is closed whilst the results are drawn. Come back tomorrow to start earning free LOT tokens in the next raffle!</p>
  </div>
)

const Redeemed = props => (
  <div className='promoLOT'>
    <PromoCounter>
      <h1>&ensp;x&ensp;{props.reward}!</h1>
    </PromoCounter>
    <p className='centred'>
    <span className={`styledSpan screen${props.screenIndex}`}>Congratulations!</span> - You've redeemed the promo LOT tokens you earnt this week! Come back next week to start earning more!
    </p>
  </div>
)

const NotRedeemed = props => (
  <div className='promoLOT'>
    <PromoCounter>
      <h1>&ensp;x&ensp;{props.reward}!</h1>
    </PromoCounter>
    <Redeem 
      reward={props.reward} 
      entries={props.entries} 
      tktPrice={props.tktPrice}
      screenIndex={props.screenIndex}
      eth={props.eth} />
  </div>
)

const Error = props => (
  <div className='promoLOT'>
    <PromoCounter />
    <p className='centred'>Error retreiving data from the smart-contract!</p>
  </div>
)
