import React from 'react'
import qr from './images/qrCode.png'
import pie from './images/pieChart.png'
import bonus from './images/bonusLOT.png'

export default props => (
    <div>
        <p className='justify'>
            The <a className={'invert screen' + props.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Etheraffle ICO</a> is currently ongoing and is your chance to purchase the LOT token and take your part in this truly decentralized, altruistic version of the future.
        </p>
        <img className='image centred' src={pie} alt='Lot token ICO Pie Chart' />
        <p className='justify'>
            Etheraffle's ICO structure is comprised of three tiers: Tier 1 runs for two weeks, tier 2 for three weeks and tier 3 for four weeks. During Tier 1, you receive <span className={'styledSpan screen' + props.screenIndex}>100,000 LOT</span> per ether, in tier 2 <span className={'styledSpan screen' + props.screenIndex}>90,000 LOT</span> per ether and in tier 3, <span className={'styledSpan screen' + props.screenIndex}>80,000 LOT</span> per ether.
        </p>
        <img className='image centred' src={bonus} alt='Lot Golden Bonus Token' />
        <p className='justify'>
            The <a className={'invert screen' + props.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Etheraffle ICO</a> is also the first to feature an innovative, stacking, tiered bonus system. For every ether raised in each tier, <span className={'styledSpan screen' + props.screenIndex}>1500 Bonus LOT</span> are generated. The more people who take part the larger this bonus amount grows. At the end of the ICO, these <span className={'styledSpan screen' + props.screenIndex}>Bonus LOT</span> are then shared out amongst ICO participants.
        </p>
        <img className='image centred' src={qr} alt='Lot token ICO QR Code' />
        <p className='justify'>
            You can take part right now by visiting the <a className={'invert screen' + props.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>Etheraffle ICO</a> page, or by scanning the QR code above with your ethereum wallet and buying LOT tokens directly. After your purchase, you will need to "watch" the LOT token at this address:
        </p>
        <p className='centred'>
            <span className={'styledSpan screen' + props.screenIndex}>0xafd9473dfe8a49567872f93c1790b74ee7d92a9f</span>
        </p>
        <p className='justify'>
            Congratulations - you are now part of the <span className={'styledSpan screen' + props.screenIndex}>Etheraffle DAO</span>, and part of this truly decentralized, altruistic vision of the future!
        </p>
    </div>
)