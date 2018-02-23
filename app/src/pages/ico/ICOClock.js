import React from 'react'
import moment from 'moment'
import ICODates from './utils/ICODates'

export default class ICOClock extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      mounted: false,
      time: {},
      seconds: this.getDownSeconds(),
      //killDiv: 1,
      //placeHolder: 1,
      tier: ICODates().tier,
      entryStats: {},
      icoStart: ICODates().tier1Start
      }
    this.timer      = 0
    this.startTimer = this.startTimer.bind(this)
    this.countDown  = this.countDown.bind(this)
  }

  componentWillMount(){
    this.setState({mounted: true})
  }

  secondsToTime(secs){
    let divisor_for_hours   = secs % (60 * 60 * 24),
        divisor_for_minutes = secs % (60 * 60),
        divisor_for_seconds = divisor_for_minutes % 60,
        days                = Math.floor(secs / (60 * 60 * 24)),
        hours               = Math.floor(divisor_for_hours / (60 * 60)),
        minutes             = Math.floor(divisor_for_minutes / 60),
        seconds             = Math.ceil(divisor_for_seconds)
    if (seconds < 10) seconds = "0" + seconds
    return {"d": days, "h": hours, "m": minutes, "s": seconds}
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds)
    this.setState({time: timeLeftVar})
    this.startTimer() //starts timer once page has loaded instead of via button originally
  }

  startTimer() {
    if (this.timer === 0) this.timer = setInterval(this.countDown, 1000)
  }

  getDownSeconds(){
    let tier = ICODates().tier,
        _now = moment.utc().format("X")
    if(tier === 0) return ICODates().tier1Start - _now
    if(tier === 1) return ICODates().tier2Start - _now
    if(tier === 2) return ICODates().tier3Start - _now
    if(tier === 3) return ICODates().wDrawStart - _now
    if(tier === 4) return ICODates().wDrawEnd   - _now
    return 0
  }

  countDown() {
    let seconds = this.state.seconds - 1 //remove a second to force re-render
    if(this.state.mounted)
      this.setState({time: this.secondsToTime(seconds), seconds: seconds})
    if(seconds === 0) {
      clearInterval(this.timer)
      //if(this.state.mounted) this.setState({killDiv: 1})
      //this.props.callBacks(this.state.killDiv, this.state.placeHolder, this.state.time)//tells parent to kill entry form
    }
    if(this.state.time.m === -1) {//snippet stops the refresh on zero bug affecting it
      clearInterval(this.timer)//now it'll not go funny with minus minutes
      let objClear = {"d": 0,"h": 0,"m": 0, "s": "00"}//string here since the timer otherwise flicks from 00 to 0
      if(this.state.mounted) this.setState({time: objClear})//kills the entry form
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)//clears the timer on leaving page
    if(this.state.mounted) this.setState({mounted: false})
  }

  render(){
    let countdown
    if(ICODates().tier === 0) countdown = "Countdown until the opening of the Etheraffle ICO - don't miss out!"
    if(ICODates().tier === 1) countdown = "Countdown until the end of the Tier-One Bonus Period - don't miss out!"
    if(ICODates().tier === 2) countdown = "Countdown until the end of the Tier-Two Bonus Period - don't miss out!"
    if(ICODates().tier === 3) countdown = "Countdown until the end of the Etheraffle ICO - don't miss out!"
    if(ICODates().tier === 4) countdown = "Countdown until the end of the LOT Bonus Redemption period!"
    if(ICODates().tier === 5) countdown = "The Etheraffle ICO is now closed!"
    return(
      <div style={this.props.style} className={"clockComponent screen" + this.props.screenIndex}>
        <p>
          {countdown}
        </p>
        {(this.state.time.d >= 1 ) && <div className='timer'>
          <div className={"timers screen" + this.props.screenIndex + " tD"}>
            <div className={"timerTime screen" + this.props.screenIndex}>{this.state.time.d}</div>
            <div className={"timerTitle screen" + this.props.screenIndex}>DAYS</div>
          </div>
          <div className={"timers screen" + this.props.screenIndex + " tH"}>
            <div className={"timerTime screen" + this.props.screenIndex}>{this.state.time.h}</div>
            <div className={"timerTitle screen" + this.props.screenIndex}>HOURS</div>
          </div>
          <div className={"timers screen" + this.props.screenIndex + " tM"}>
            <div className={"timerTime screen" + this.props.screenIndex}>{this.state.time.m}</div>
            <div className={"timerTitle screen" + this.props.screenIndex}>MINS</div>
          </div>
          <div className={"timers screen" + this.props.screenIndex + " tS"}>
            <div className={"timerTime screen" + this.props.screenIndex}>{this.state.time.s}</div>
            <div className={"timerTitle screen" + this.props.screenIndex}>SECS</div>
          </div>
        </div>
        }

        {((this.state.time.d < 1) && (this.state.time.h >= 1) ) &&
          <div className='timer'>
            <div className={"timers screen" + this.props.screenIndex + " tH"}>
            <div className={"timerTime screen" + this.props.screenIndex}>{this.state.time.h}</div>
              <div className={"timerTitle screen" + this.props.screenIndex}>HOURS</div>
            </div>
            <div className={"timers screen" + this.props.screenIndex + " tM"}>
              <div className={"timerTime screen" + this.props.screenIndex}>{this.state.time.m}</div>
              <div className={"timerTitle screen" + this.props.screenIndex}>MINS</div>
            </div>
            <div className={"timers screen" + this.props.screenIndex + " tS"}>
              <div className={"timerTime screen" + this.props.screenIndex}>{this.state.time.s}</div>
              <div className={"timerTitle screen" + this.props.screenIndex}>SECS</div>
            </div>
          </div>
        }

        {((this.state.time.d < 1) && (this.state.time.h < 1) ) &&
          <div className='timer'>
            <div className={"timers screen" + this.props.screenIndex + " tM"}>
              <div className={"timerTime screen" + this.props.screenIndex}>{this.state.time.m}</div>
              <div className={"timerTitle screen" + this.props.screenIndex}>MINS</div>
            </div>
            <div className={"timers screen" + this.props.screenIndex + " tS"}>
              <div className={"timerTime screen" + this.props.screenIndex}>{this.state.time.s}</div>
              <div className={"timerTitle screen" + this.props.screenIndex}>SECS</div>
            </div>
          </div>
        }
      </div>
    )
  }
}
