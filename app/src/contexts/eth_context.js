import React from 'react'
import getWeb3 from '../web3/get_web3'
import getRate from '../web3/get_rate'
import getFree from '../web3/get_free_lot'
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
      freeLOT: null,
      key:     null
		}
    this.getFreeLOT       = this.getFreeLOT.bind(this)
    this.pollAccounts     = this.pollAccounts.bind(this)
    this.decrementFreeLOT = this.decrementFreeLOT.bind(this)
  }

  componentDidMount() {
		getWeb3().then(web3 => {
			getEthAccount(web3).then(acc => {
				acc 
          ? (this.setState({web3: web3, ethAdd: acc, locked: false, loading: false}), this.getFreeLOT(web3, acc))
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
  /* Retrieve user balance of FreeLOT from the bc */
  getFreeLOT(_web3, _ethAdd) {
    getFree(_web3, _ethAdd).then(free => {
      this.setState({freeLOT: free})
    }).catch(err => {
      console.log('Error retrieving FreeLOT balance: ', err)
    })
  }
	/* Polls the primary eth account in case it changes, reloads page dApp if so */
  pollAccounts(_web3) {
		setInterval(() => {
			let newAdd = _web3.eth.accounts[0] === undefined ? null : _web3.eth.accounts[0] // set undefined to null for next line
			if (newAdd !== this.state.ethAdd) window.location.reload()
		}, 500)
  }
  /* Decrements free lot in eth context, so users see their correct balance assuming the tx goes through succesfully */
  decrementFreeLOT() {
    if (this.state.freeLOT > 0) {
      let free = this.state.freeLOT - 1
      console.log(`FreeLOT decremented! New value: ${free}`)
      this.setState({freeLOT: free})
    }
  }

	render() {
		return (
			<EthContext.Provider value={{
        web3:    this.state.web3,
				ethAdd:  this.state.ethAdd,
				locked:  this.state.locked,
				exRate:  this.state.exRate,
        freeLOT: this.state.freeLOT,
        loading: this.state.loading,
        decrementFreeLOT: () => this.decrementFreeLOT()
      }}>
				{this.props.children}
			</EthContext.Provider>
		)
	}
}

