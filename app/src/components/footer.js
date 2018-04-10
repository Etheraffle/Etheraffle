import React from 'react'
import Socials from './socials'
import { ScreenContext } from '../contexts/screenContext'

export default props => (
    <ScreenContext>
        {screen => (
            <div className="underInfo">
                <p className='info'>
                    <b>&#x274d;</b> v 0.9.2 Beta <b>&#x274d;</b>
                    &nbsp;
                    <a 
                        className={`screen${screen.screenIndex}`} 
                        style={{'cursor':'pointer'}} 
                        onClick={screen.Contact}>
                        Contact
                    </a>
                    &nbsp;
                    <b>&#x274d;</b> © Etheraffle {(new Date()).getFullYear()} <b>&#x274d;</b>
                </p>
                <Socials screenIndex={screen.screenIndex} />
            </div>
        )}
    </ScreenContext>
)