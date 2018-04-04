import React from 'react'
import dates from '../../../saturdayraffle/promo/icoDates'
import mMaskLOT from './images/metamaskLOT.png'

export default props => (
    <div>
        <p className='justify'>
            There is no limit on how many free LOT tokens you can earn each week - the more you play the more you earn!
        </p>

        <img className='image border centred' src={mMaskLOT} alt='Lot token in MetaMask' />

    </div>
)