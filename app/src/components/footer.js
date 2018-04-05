import React from 'react'
import Socials from './socials'
import { Link } from 'react-router'

export default props => {
    return(
        <div className="underInfo">
            <p className='info'>
            <b>&#x274d;</b> v 0.9.2 Beta <b>&#x274d;</b>
            &nbsp;
            <Link className={'routerLink screen' + props.screenIndex} to='/contact'>
                Contact
            </Link>
            &nbsp;
            <b>&#x274d;</b> © Etheraffle {(new Date()).getFullYear()} <b>&#x274d;</b>
            </p>
            <Socials screenIndex={props.screenIndex} />
        </div>
    )
}