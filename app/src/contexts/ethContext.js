import React from 'react'
import getWeb3 from '../web3/getWeb3'
import getRate from '../web3/getRate'
import getEthAccount from '../web3/getEthAccount'

export const EthContext = React.createContext()

export class EthProvider extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			web3:    null,
			ethAdd:  null,
			locked:  null,
			exRate:  null,
			loading: true
		}
	}

	componentDidMount() {
		getWeb3().then(web3 => {
			getEthAccount(web3).then(acc => {
				if (!acc) return this.setState({web3: web3, locked: true, loading: false})
				this.setState({web3: web3, ethAdd: acc, locked: false, loading: false})
				})
			}).catch(err => {
			console.log(`Err in ethContext: ${err}`)
			this.setState({loading: false})
		})
		getRate().then(rate => {
			this.setState({exRate: rate})
		}).catch(err => console.log(`Error retreiving exchange rate: ${err}`))
	}

	render() {
		return(
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

