import React from 'react'
import moment from 'moment'
/*
Requires passing of endTime props as a STRING of fromat: 'Day 24HRTIME'
Requires passing of closedFor props as a number of seconds
TODO: Put in prop types to enforce the above!
*/
export default class Saturdayclock extends React.Component {

	constructor(props) {
		super(props)
			this.state = {
			time: {},
			mounted: false,
			seconds: this.getDownSeconds()
		}
		this.timer      = 0
		this.startTimer = this.startTimer.bind(this)
		this.countDown  = this.countDown.bind(this)
	}

	componentWillMount() {
		this.setState({mounted: true})
	}

	secondsToTime(_secs) {
		let divHours   = _secs % (60 * 60 * 24)
		  , divMinutes = _secs % (60 * 60)
		  , divSeconds = divMinutes % 60
		  , days       = Math.floor(_secs / (60 * 60 * 24))
		  , hours      = Math.floor(divHours / (60 * 60))
		  , minutes    = Math.floor(divMinutes / 60)
		  , seconds    = Math.ceil(divSeconds)
		if (seconds < 10) seconds = `0${seconds}`
		return {d: days, h: hours, m: minutes, s: seconds, closed: _secs === 0 ? true : false, totalSecs: _secs}
	}

	componentDidMount() {
		if (this.state.mounted) this.setState({time: this.secondsToTime(this.state.seconds)})
		this.startTimer()
	}

	startTimer() {
		if (this.timer === 0) this.timer = setInterval(this.countDown, 1000)
	}

	getDownSeconds() {
		let endTime = moment(this.props.endTime, 'dddd HH:mm').format('X')
		, dS = endTime - moment().format('X')
		return dS > 0 ? dS : dS + this.props.closedFor > 0 ? 0 : dS + 604800//one week in s
	}

	countDown() {
		let seconds = this.state.seconds - 1 //remove a second to force re-render
		if (this.state.mounted) this.setState({time: this.secondsToTime(seconds), seconds: seconds})
		if (seconds === 0) clearInterval(this.timer)
		if (this.state.time.m === -1) {//stops the refresh on zero bug affecting it
			clearInterval(this.timer)
			if (this.state.mounted) this.setState({time: {d: 0, h: 0, m: 0, s: "00", closed: true}})//string stops flicking from 00 to 0
		}
	}

	componentWillUnmount() {
		clearInterval(this.timer)
		if (this.state.mounted) this.setState({mounted: false})
	}

	render() {
		return (
			<React.Fragment>
				{this.props.render(this.state.time)}
			</React.Fragment>
		)
	}
}

