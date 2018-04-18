import React from 'react'
import utils from '../../../../components/utils'
import Loading from '../../../../components/loading'
import Countdown from '../../../../components/countdown'
import getTktPrice from '../../../../web3/get_ticket_price'
import dates from '../../../saturday_raffle/promo/ico_dates'
import { EthContext } from '../../../../contexts/eth_context'
import RedeemButton from '../../../saturday_raffle/promo/redeem_button'
import PromoCounter from '../../../saturday_raffle/promo/promo_counter'
import RedeemButtonFAQ from '../../../saturday_raffle/promo/redeem_button_faq'
import hasRedeemed from '../../../saturday_raffle/promo/web3/get_has_redeemed'
import getNumEntries from '../../../saturday_raffle/promo/web3/get_num_entries'

export default props => (
  <EthContext.Consumer>
    {eth => (
      <React.Fragment>
      {
        eth.loading   ? <Loading /> 
        : !eth.web3   ? <NoCxn    screenIndex={props.screenIndex} />
        : !eth.ethAdd ? <Locked   screenIndex={props.screenIndex} />
        : eth.ethAdd  ? <Unlocked screenIndex={props.screenIndex}  eth={eth} />
        : <NoCxn screenIndex={props.screenIndex} />
      }
    </React.Fragment>
    )}
  </EthContext.Consumer>
)

const NoCxn = props => (
  <p>You can claim the LOT tokens you've earnt at any time. Get an ethereum-enabled browser and use the form that will appear here to get redeeming!</p>
)

const Locked = props => (
  <p>You can claim your earnt LOT tokens at any time! Unlock your account and use the form that will appear below to get redeeming!</p>
)

const Unlocked = props => (
  <SelectWeek eth={props.eth} screenIndex={props.screenIndex} />
)

class SelectWeek extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      key: 'init',
      options: [],
      startWeek: 37,
      selectedWeek: utils.getExactWeekNo()
    }
    this.handleChange   = this.handleChange.bind(this)
    this.removeSelected = this.removeSelected.bind(this)
  }

  componentDidMount() {
    this.removeSelected(this.state.selectedWeek)
  }

  removeSelected(_selected) {
    // Create array of allowable weeks, reverse it, map it onto html option elements except for selected week, then stick selected week to front of array...
    let arr = Array.from(Array(utils.getExactWeekNo() - (this.state.startWeek - 1))).map((e,i) => i + this.state.startWeek).reverse().map((x,i) => { if (_selected !== x) return <option key={`weekNum${i + 1}`}>{`Week ${x}`}</option>})
    arr.unshift(<option key={`weekNum${_selected}`}>{`Week ${_selected}`}</option>)
    this.setState({selectedWeek: _selected, options: arr, key: Math.random()})
  }

  handleChange(event) {
    this.removeSelected(parseInt(event.target.value.slice(5) , 10)) // Slice off 'Week ' from the string
  }

  render() {
    return (
      <React.Fragment>
        <p className='justify'>
          You can redeem tokens you've earnt from any week using the form below. Simply select a week number from the drop down menu to see if you have tokens awaiting redemption.
        </p>
        <br/>
        <div className={`entryForm screen${this.props.screenIndex}`}>
          <div className={`pickNumbersForm screen${this.props.screenIndex}`}>
            <form className={`submitForm screen${this.props.screenIndex}`} onChange={this.handleChange}>
              <label className='numberPicker'>
                <select className={`screen${this.props.screenIndex}`} 
                        key={`weekNums`} 
                        value={this.state.selectedWeek} 
                        onChange={this.handleChange} >
                  {this.state.options}
                </select>
              </label>
            </form>
          </div>
          <GetDetails key={this.state.key} eth={this.props.eth} screenIndex={this.props.screenIndex} weekNo={this.state.selectedWeek} />
        </div>
      </React.Fragment>
    )
  }
}

class GetDetails extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      reward:   null,
      loading:  true,
      entries:  null,
      tktPrice: null,
      error:    false
    }
    this.getDetails = this.getDetails.bind(this)
  }

  componentDidMount() {
    this.getDetails()
  }

  getDetails() { // Only pays out at CURRENT exchange rate & tktPrice, regardless of when tokens earnt.
    if (this.props.eth.loading) setTimeout(this.getDetails, 1000) // Wait until web3 detected
    hasRedeemed(this.props.eth.web3, this.props.eth.ethAdd, this.props.weekNo).then(bool => {
      this.setState({redeemed: bool})
      return getTktPrice(this.props.eth.web3, 'Saturday')
      .then(price => { 
        return getNumEntries(this.props.eth.web3, this.props.eth.ethAdd, this.props.weekNo)
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
      console.log(`Error reading smart-contract: ${err.message}`)
      this.setState({error: true})
    })
  }

  render() {
    return (
      <div className='promo'>
        {
          this.state.loading    ? <Loading />
          : this.state.error    ? <Error />
          : this.state.redeemed ? <Redeemed reward={this.state.reward} screenIndex={this.props.screenIndex} />
          : <NotRedeemed 
              eth={this.props.eth}
              reward={this.state.reward} 
              weekNo={this.props.weekNo}
              entries={this.state.entries} 
              tktPrice={this.state.tktPrice}
              screenIndex={this.props.screenIndex} />
        }
      </div>
    )
  }
}

const Redeemed = props => (
  <div className='promoLOT' style={{'width':'100%'}} >
    <PromoCounter>
      <h1>&ensp;x&ensp;{props.reward}!</h1>
    </PromoCounter>
    <div className={`redeemButton redeemedScreen${props.screenIndex}`} />
    <p className='centred'>
    <span className={`styledSpan screen${props.screenIndex}`}>Congratulations!</span> You've redeemed the promo LOT tokens you earnt during this week!
    </p>
  </div>
)

const NotRedeemed = props => (
  <div className='promoLOT' style={{'width':'100%'}} >
    <PromoCounter>
      <h1>&ensp;x&ensp;{props.reward}!</h1>
    </PromoCounter>
    {
      props.reward === 0 
      ? <None screenIndex={props.screenIndex} weekNo={props.weekNo}/>
      : <Some eth={props.eth}
              reward={props.reward} 
              weekNo={props.weekNo}
              entries={props.entries} 
              tktPrice={props.tktPrice}
              screenIndex={props.screenIndex}/>
    }
  </div>
)

const None = props => (
  <p className='centred'>
    Sorry, you have no <span className={`styledSpan screen${props.screenIndex}`}>LOT</span> tokens to redeem from week {props.weekNo}!
  </p>
)

const Some = props => (
  <React.Fragment>
    <RedeemButton eth={props.eth}
                  reward={props.reward} 
                  weekNo={props.weekNo}
                  entries={props.entries} 
                  tktPrice={props.tktPrice}
                  screenIndex={props.screenIndex} />
    {
      props.weekNo === utils.getExactWeekNo() 
      ? <WeekCaution screenIndex={props.screenIndex} reward={props.reward} />
      : <p className='centred'>
          <span className={`styledSpan screen${props.screenIndex}`}>Congratulations!</span> You have {props.reward} LOT tokens to redeem from week {props.weekNo}.
        </p>
    }
  </React.Fragment>
)

const WeekCaution = props => (
  <Countdown endTime={'Saturday 19:00'} closedFor={5 * 60 * 60} render={({ d, h, m, s }) => {
    let time = d > 1 
      ? `over ${d} days left`  : d === 1
      ? `over a day left`      : h > 1
      ? `over ${h} hours left` : h === 1
      ? `over an hour left`    : m > 1 
      ? `${m} minutes left`    : m === 1
      ? `over a minute left`   : `${s} seconds left`
    return (
      <React.Fragment>
        {
          time.closed
            ? <p className='centred'>
                <span className={`styledSpan screen${props.screenIndex}`}>Congratulations!</span> You have {props.reward} LOT tokens to redeem from week {props.weekNo}!
              </p>
            : <React.Fragment>
                <p className='centred'>
                  <span className={`styledSpan screen${props.screenIndex}`}>Congratulations!</span> You have <span className={`styledSpan screen${props.screenIndex}`}>{props.reward} LOT</span> tokens to redeem from week {props.weekNo}!
                </p>
                <p className='justify'>
                  You may redeem your tokens at any time, but you still have <span className={`styledSpan screen${props.screenIndex}`}>{time}</span> to earn even more LOT by entering this week's raffle again! You can only redeem your promo LOT tokens once per week!
                </p>
              </React.Fragment>
        }
      </React.Fragment>
    )
  }} />
)

const Error = props => (
  <div className='promoLOT' style={{'width':'100%'}} >
    <PromoCounter />
    <p className='centred'>Error retreiving data from the smart-contract!</p>
  </div>
)
