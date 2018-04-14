import React from 'react'
import mm from './images/metamask_mobile.jpg'
export default props => (
	<React.Fragment>
		<p className='justify'>
			Because the LOT token is brand new to the ethereum blockchain, you will need to 'watch' for the token in your ethereum wallet. This simply involves providing your wallet with the address of the LOT token:
			</p>
			<br/>
			<h3 className='centred'>
				<a className={'invert screen' + props.screenIndex}href='https://etherscan.io/address/0xAfD9473dfe8a49567872f93c1790b74Ee7D92A9F' rel="noopener noreferrer" target="_blank">
					<span className='blueGrey ethAdd'>{'0xAfD9473dfe8a49567872f93c1790b74Ee7D92A9F'.substring(0,20) + '. . .'}</span>
				</a>
			</h3>
			<br/>
			<p className='justify'>
			For example in Metamask:
			<br/>
			<br/>
			<img className='image border centred' src={mm} alt='How to watch the token in metamask'/>
		</p>
	</React.Fragment>
)