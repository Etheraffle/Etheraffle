import React from 'react'
import moment from 'moment'
import BelowContent from './belowContent'
import Subnav from '../../components/subnav'
import Countdown from '../../components/countdown'
import SaturdayEntryForm from './saturdayEntryForm'
import closedButton from '../../images/closedButton.svg'
import { ScreenContext } from '../../contexts/screenContext'

export default class SaturdayRaffle extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      closed:    false,
      closedFor: 5 * 60 * 60,     // Length of time (in seconds) the raffle is closed for
      endTime:   'Saturday 19:00' // Raffle deadline
    }
    this.toggleEntry = this.toggleEntry.bind(this)
  }

  toggleEntry(_status) {
    this.setState({closed: _status})
  }

  render() {
    return (
      <ScreenContext.Consumer>{screen => (
        <Subnav screenIndex={screen.screenIndex} subScreenIndex={screen.subScreenIndex} >
          <div className={"contentWrapper si" + screen.screenIndex}>
            <div className={"content ssi" + screen.subScreenIndex}>
              <h1 className='centred'>Welcome to the {window.innerWidth <= 450 ? <br/> : ''} <span className={`styledSpan screen${screen.screenIndex}`}>Saturday Raffle!</span></h1>
              <br/>
              <Countdown endTime={this.state.endTime} closedFor={this.state.closedFor} render={time => {
                if (time.closed && !this.state.closed) this.toggleEntry(true)
                if (!time.closed && this.state.closed) this.toggleEntry(false)
                return (
                  <Clock time={time} screenIndex={screen.screenIndex} />
                )}}
              />
              {this.state.closed 
                ? <Closed screenIndex={screen.screenIndex} /> 
                : <SaturdayEntryForm screenIndex={screen.screenIndex} />}
              <BelowContent screenIndex={screen.screenIndex} closed={this.state.closed} />
            </div>
          </div>
        </Subnav>
      )}</ScreenContext.Consumer>
    )
  }
}

const Closed = props => (
	<div className='entryFormClosed'>
		<img className={'closedButton screen' + props.screenIndex} src={closedButton} alt='Entry closed!' />
		<p className='centred'>
			Next draw opens: {window.innerWidth >= 450 ? '' : <br/>}<span className={'styledSpan screen' + props.screenIndex}>{moment().day('Sunday').add(7,'days').format('dddd, MMMM Do [at] 00:00')}</span>
		</p>
	</div>
)

const Clock = props => {
	let sI = props.screenIndex
	  , d  = props.time.d === 1    ? 'DAY'  : 'DAYS'
	  , h  = props.time.h === 1    ? 'HOUR' : 'HOURS'
	  , m  = props.time.m === 1    ? 'MIN'  : 'MINS'
	  , s  = props.time.s === '01' ? 'SEC'  : 'SECS'
	return (
		<div className='timer'>
			<div   className={`timers screen${sI} tD`}>
				<div className={`timerTime screen${sI}`}>{props.time.d}</div>
				<div className={`timerTitle screen${sI}`}>{d}</div>
			</div>
			<div   className={`timers screen${sI} tH`}>
				<div className={`timerTime screen${sI}`}>{props.time.h}</div>
				<div className={`timerTitle screen${sI}`}>{h}</div>
			</div>
			<div   className={`timers screen${sI} tM`}>
				<div className={`timerTime screen${sI}`}>{props.time.m}</div>
				<div className={`timerTitle screen${sI}`}>{m}</div>
			</div>
			<div   className={`timers screen${sI} tS`}>
				<div className={`timerTime screen${sI}`}>{props.time.s}</div>
				<div className={`timerTitle screen${sI}`}>{s}</div>
			</div>
		</div>
	)
}