import React from 'react'
import FreeLOT from './free_lot'

export default props => (                       
  <div className='freeLOTCounter'>
    <FreeLOT height='3.5em' fill={props.screenIndex}/>
    {props.children}
  </div>
)