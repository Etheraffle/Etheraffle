import React from 'react'
import multiple from './images/multiplewins.jpg'

export default () => (
  <div>
    <p className="justify">
      Absolutely! You can enter any raffle as many times as you'd like! The more times you enter, the more chances you have of winning! You could even win with more than one ticket in the same draw:
    </p>
    <img className='image border centred' src={multiple} alt='Table showing multiple wins'/>
  </div>
)