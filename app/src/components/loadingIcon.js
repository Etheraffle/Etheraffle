import React from 'react'
import icon from '../images/loadingIconGrey.svg'

/* This sort of pure component can still take props as a param... */
export default () => {
  return(
    <img className='loadingIcon' src={icon} alt='Loading Icon' />
  )
}
