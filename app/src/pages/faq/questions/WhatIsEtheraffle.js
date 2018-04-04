import React from 'react'
import probVert from './images/probVert.png'

export default (props) => {
    return(
        <div>
            <p className='justify'>
                The <span className={'styledSpan screen' + props.screenIndex}>Etheraffle ÐApp</span> provides the first truly global, truly decentralized, charitable lottery. It is designed to give <span className={'styledSpan screen' + props.screenIndex}>huge prizes</span> to players, <span className={'styledSpan screen' + props.screenIndex}>sustainable rewards</span> to LOT holders, and <span className={'styledSpan screen' + props.screenIndex}>life-changing funding</span> to charities.
            </p>

            <img className='image centred' src={probVert} alt='Etheraffle problem/solution diagram' />

            <p className='justify'>
                To find out more, please <a className={'invert screen' + props.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>visit the ICO page</a>, read the <a className={'invert screen' + props.screenIndex} href='https://etheraffle.com/whitepaper' target='_blank' rel='noopener noreferrer'>Etheraffle WhitePaper</a> or visit the <a className={'invert screen' + props.screenIndex} href='https://bitcointalk.org/index.php?topic=3126420.0' target='_blank' rel='noopener noreferrer'>Etheraffle ANN</a> thread on bitcointalk!
            </p>
        </div>
    )
}