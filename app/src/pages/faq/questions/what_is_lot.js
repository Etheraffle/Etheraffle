import React from 'react'
import LOTRel from './images/lot_rel.png'
import LOTEther from './images/lot_equals_ether.png'

export default props => (
	<React.Fragment>
		<p className='justify'>
			In its most basic form, the Etheraffle <a className={'invert screen' + props.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>LOT token</a> earns you ether that is generated by Etheraffle. 
		</p>
		<img className='image centred' src={LOTEther} alt='LOT equals Ether' />
		<br/>
		<p className='justify'>
			But it is much more than that. By owning the LOT token you also get voting rights on everything to do with the Etheraffle platform, such as deciding how Etheraffle prize pools are split, how much ether goes to <a className={'invert screen' + props.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>LOT token</a> holders, how much ether goes to good causes, and which good causes you think deserve funding. The LOT token is your membership to a democractic autonomous organization which owns and runs Etheraffle itself.
		</p>
		<img className='image centred' src={LOTRel} alt='Lot token relationship' />
	</React.Fragment>
)