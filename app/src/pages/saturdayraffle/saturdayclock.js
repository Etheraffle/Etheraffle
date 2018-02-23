import React from 'react'
import moment from 'moment'

export default class Saturdayclock extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      mounted: false,
      time: {},
      seconds: this.getDownSeconds(),
      killDiv: 1,
      placeHolder: 1,
    }
    this.timer      = 0
    this.startTimer = this.startTimer.bind(this)
    this.countDown  = this.countDown.bind(this)
  }

  componentWillMount(){
    this.setState({mounted: true})
  }

  secondsToTime(_secs){
    let divisorHours   = _secs % (60 * 60 * 24),
        divisorMinutes = _secs % (60 * 60),
        divisorSeconds = divisorMinutes % 60,
        days           = Math.floor(_secs / (60 * 60 * 24)),
        hours          = Math.floor(divisorHours / (60 * 60)),
        minutes        = Math.floor(divisorMinutes / 60),
        seconds        = Math.ceil(divisorSeconds)
    if(seconds < 10) seconds = "0" + seconds
    return {"d": days, "h": hours, "m": minutes, "s": seconds}
  }

  componentDidMount() {
    if(this.state.mounted) this.setState({time: this.secondsToTime(this.state.seconds)})
    this.startTimer()
  }

  startTimer() {
    if (this.timer === 0) this.timer = setInterval(this.countDown, 1000)
  }

  getDownSeconds(){
    //let wkSt = moment().isoWeekday() === 1 ? moment('Monday 00:00', 'dddd HH:mm').format('X') : moment('Monday 00:00', 'dddd HH:mm').subtract(1, 'week').format('X')
    let endTime = moment(this.props.endTime, 'dddd HH:mm').format('X')
    let dS = endTime - moment().format('X')
    return dS > 0 ? dS : dS + this.props.closedFor > 0 ? 0 : dS + 604800//one week in s
  }

  countDown() {
    let seconds = this.state.seconds - 1 //remove a second to force re-render
    if(this.state.mounted){
      this.setState({
        time: this.secondsToTime(seconds),
        seconds: seconds,
        killDiv: 0, //opens entry div if clock is running
        placeHolder: 0, //swaps placeHolder for entry form
      })
      if(this.props.mounted) this.props.callBacks(this.state.killDiv, this.state.placeHolder)
    }
    if(seconds === 0){
      clearInterval(this.timer)
      if(this.state.mounted){
        this.setState({killDiv: 1})
        if(this.props.mounted) this.props.callBacks(this.state.killDiv, this.state.placeHolder)
      }
    }
    if(this.state.time.m === -1){//stops the refresh on zero bug affecting it
      clearInterval(this.timer)
      let objClear = {"d": 0, "h": 0, "m": 0, "s": "00"}//string here since the timer otherwise flicks from 00 to 0
      if(this.state.mounted){
        this.setState({killDiv: 1, time: objClear})//kills the entry form
        if(this.props.mounted) this.props.callBacks(this.state.killDiv, this.state.placeHolder)
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    if(this.state.mounted) this.setState({mounted: false})
  }

  render(){
    let d = this.state.time.d === 1    ? 'DAY'  : 'DAYS',
        h = this.state.time.h === 1    ? 'HOUR' : 'HOURS',
        m = this.state.time.m === 1    ? 'MIN'  : 'MINS',
        s = this.state.time.s === '01' ? 'SEC'  : 'SECS'
    return(
      <div className={"clockComponent screen" + this.props.screenIndex}>

          <div className='timer'>
            <div className={"timers screen" + this.props.screenIndex + " tD"}>
              <div className={"timerTime screen" + this.props.screenIndex}>
                {this.state.time.d}
              </div>
              <div className={"timerTitle screen" + this.props.screenIndex}>
                {d}
              </div>
            </div>

            <div className={"timers screen" + this.props.screenIndex + " tH"}>
              <div className={"timerTime screen" + this.props.screenIndex}>
                {this.state.time.h}
              </div>
              <div className={"timerTitle screen" + this.props.screenIndex}>
                {h}
              </div>
            </div>

            <div className={"timers screen" + this.props.screenIndex + " tM"}>
              <div className={"timerTime screen" + this.props.screenIndex}>
                {this.state.time.m}
              </div>
              <div className={"timerTitle screen" + this.props.screenIndex}>
                {m}
              </div>
            </div>

            <div className={"timers screen" + this.props.screenIndex + " tS"}>
              <div className={"timerTime screen" + this.props.screenIndex}>
                {this.state.time.s}
              </div>
              <div className={"timerTitle screen" + this.props.screenIndex}>
                {s}
              </div>
            </div>

          </div>

      </div>
    )
  }
}
/*
{(this.state.time.d >= 1 ) &&
TOP BIT here
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

*/
