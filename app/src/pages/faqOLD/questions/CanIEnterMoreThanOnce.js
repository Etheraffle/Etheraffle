import React, { Component } from 'react'
import multiple from './images/multiplewins.jpg'

export default class CanIEnterMoreThanOnce extends Component {
  render(){
    return(
      <div>

        <p className="justify">
          <span className={'styledSpan screen' + this.props.screenIndex}>
            <b>&emsp; &#x274d; &ensp;</b>
          </span>
          Absolutely! You can enter any raffle as many times as you'd like! The more times you enter, the more chances you have of winning! You could even win with more than one ticket in the same draw:
        </p>

        <div className='image centred'>
          <img className='imageBorder'style={{'margin':'12px'}} src={multiple} alt='Table showing multiple wins'/>
        </div>

      </div>
    )
  }
}
