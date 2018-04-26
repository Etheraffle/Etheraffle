import React from 'react'
import LOT from '../../../components/lot'

export default props => (                       
  <div className='promoCounter'>
    <LOT height='3.5em' fill='6'/>
    {props.children}
  </div>
)