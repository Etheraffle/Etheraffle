import React from 'react'
import mMaskLOT from './images/metamask_lot.png'

export default props => (
	<React.Fragment>
		<p className='justify'>
			There is no limit on how many free LOT tokens you can earn each week - the more you play the more you earn!
		</p>
		<img className='image border centred' src={mMaskLOT} alt='Lot token in MetaMask' />
	</React.Fragment>
)