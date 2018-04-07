import LOT from './lot'
import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {faFacebook, faTwitterSquare, faTelegram, faReddit, faGithub} from '@fortawesome/fontawesome-free-brands'

export default props => (
    <p className='socials'>
        <a 
            href='https://reddit.com/r/etheraffle/' 
            className={`screen${props.screenIndex}`} 
            target='_blank' 
            rel='noopener noreferrer'>
            <FontAwesomeIcon className='icon' icon={faReddit}  />
        </a>
        <a 
            href='https://facebook.com/etheraffle' 
            className={`screen${props.screenIndex}`} 
            target='_blank' 
            rel='noopener noreferrer'>
            <FontAwesomeIcon className='icon' icon={faFacebook}  />
        </a>
        <a 
            href='https://t.me/etheraffle' 
            className={`screen${props.screenIndex}`} 
            target='_blank' 
            rel='noopener noreferrer'>
            <FontAwesomeIcon className='icon' icon={faTelegram}  />
        </a>
        <a 
            href='https://twitter.com/etheraffle' 
            className={`screen${props.screenIndex}`} 
            target='_blank' 
            rel='noopener noreferrer'>
            <FontAwesomeIcon className='icon' icon={faTwitterSquare}  />
        </a>
        <a 
            href='https://github.com/etheraffle' 
            className={`screen${props.screenIndex}`} 
            target='_blank' 
            rel='noopener noreferrer'>
            <FontAwesomeIcon className='icon' icon={faGithub}  />
        </a>
        <a 
            href='https://etheraffle.com/ico' 
            className={`screen${props.screenIndex}`} 
            target='_blank' 
            rel='noopener noreferrer'>
            <LOT screenIndex={props.screenIndex}/>       
        </a>
    </p>
)