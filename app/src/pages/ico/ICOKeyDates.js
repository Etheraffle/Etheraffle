import React from 'react'
import moment from 'moment'
import ICODates from './utils/ICODates'

export default class ICOHowToEnter extends React.Component{

  render(){
    return(
      <div>
        <p><span className="styledSpan centred largerFont" style={{'fontSize':'1.5em'}}><b>&#x274d;</b></span></p>

        <h2 className={"centred underlined screen" + this.props.screenIndex}>Key Dates</h2>

        <div className='row'>
          <div>
            <p>
            <span className={"styledSpan screen" + this.props.screenIndex}><b>&#x274d;</b></span>
            &emsp;ICO Tier One Begins:
            <br/>
            <span className={"styledSpan screen" + this.props.screenIndex}><b>&#x274d;</b></span>
            &emsp;ICO Tier Two Begins:
            <br/>
            <span className={"styledSpan screen" + this.props.screenIndex}><b>&#x274d;</b></span>
            &emsp;ICO Tier Three Begins:
            <br/>
            <span className={"styledSpan screen" + this.props.screenIndex}><b>&#x274d;</b></span>
            &emsp;ICO Finishes On:
            <br/>
            <span className={"styledSpan screen" + this.props.screenIndex}><b>&#x274d;</b></span>
            &emsp;Bonus Redemption Begins:
            <br/>
            <span className={"styledSpan screen" + this.props.screenIndex}><b>&#x274d;</b></span>
            &emsp;Bonus Redemption Closes:
            <br/>
            <span className={"styledSpan screen" + this.props.screenIndex}><b>&#x274d;</b></span>
            &emsp;Tokens On Exchanges:
            </p>
          </div>
          <div>
            <p className={"styledSpan screen" + this.props.screenIndex}>
            {moment.unix(ICODates().tier1Start).format('dddd, MMMM Do, YYYY HH:mm')}
            <br/>
            {moment.unix(ICODates().tier2Start).format('dddd, MMMM Do, YYYY HH:mm')}
            <br/>
            {moment.unix(ICODates().tier3Start).format('dddd, MMMM Do, YYYY HH:mm')}
            <br/>
            {moment.unix(ICODates().wDrawStart).format('dddd, MMMM Do, YYYY HH:mm')}
            <br/>
            {moment.unix(ICODates().wDrawStart).format('dddd, MMMM Do, YYYY HH:mm')}
            <br/>
            {moment.unix(ICODates().wDrawEnd)/*.subtract(1, 'second')*/.format('dddd, MMMM Do, YYYY HH:mm')}
            <br/>
            Circa May 2018
            </p>
          </div>
        </div>

      </div>
    )
  }
}
