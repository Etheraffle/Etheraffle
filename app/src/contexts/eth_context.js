import React from 'react'
import getWeb3 from '../web3/get_web3'
import getRate from '../web3/get_rate'
import getEthAccount from '../web3/get_eth_account'

export const EthContext = React.createContext()

export class EthProvider extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
      web3:    null,
			ethAdd:  null,
			locked:  null,
			exRate:  null,
			loading: true,
      key:     null
		}
		this.pollAccounts = this.pollAccounts.bind(this)
  }

	componentDidMount() {
		getWeb3().then(web3 => {
			getEthAccount(web3).then(acc => {
				acc 
				? this.setState({web3: web3, ethAdd: acc, locked: false, loading: false}) 
				: this.setState({web3: web3, locked: true, loading: false})
				this.pollAccounts(web3)
				})
			}).catch(err => {
				console.log(`Err in ethContext: ${err}`)
				this.setState({loading: false})
		})
		getRate().then(rate => {
			this.setState({exRate: rate})
		}).catch(err => console.log(`Error retreiving exchange rate: ${err}`))
	}
	
  	pollAccounts(_web3) {
		setInterval(() => {
			let newAdd = _web3.eth.accounts[0] === undefined ? null : _web3.eth.accounts[0] // set undefined to null for next line
			if (newAdd !== this.state.ethAdd) window.location.reload()
		}, 500)
  	}

	render() {
		return (
			<EthContext.Provider value={{
        web3:    this.state.web3,
				ethAdd:  this.state.ethAdd,
				locked:  this.state.locked,
				exRate:  this.state.exRate,
				loading: this.state.loading
				}} >
				{this.props.children}
			</EthContext.Provider>
		)
	}
}

