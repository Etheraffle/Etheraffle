import React from 'react'
import lots from './images/lots.png'

export default props => (
    <div>
        <p className='justify'>
            Etheraffle is a truly decentralized lottery created to give huge prizes to players, sustainable ETH dividends to LOT token holders, and life-changing funding to charities. The <a className={'invert screen' + props.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Etheraffle ICO's</a> goal is to create as many LOT token holders as possible. And this LOT token promotion is designed to help achieve this. 
        </p>

        <img className='image border centred' src={lots} alt='Lots of earnt LOT' />

        <p className='justify'>
            Whilst it is running, anyone who plays Etheraffle ALSO earns free LOT tokens! Every Etheraffle ticket you purchase earns you LOT tokens, and there is no limit on how many you can earn. LOT tokens are your way to own part of this decentralized lottery of the future - so get playing!
        </p>
    </div>
)