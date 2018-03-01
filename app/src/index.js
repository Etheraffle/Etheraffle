import React from 'react'
import Nav from './nav/nav'
import ReactDOM from 'react-dom'
import './styles/css/main.min.css'
import {EventEmitter} from 'events'
import Screen1 from './nav/Screen1'
import Screen3 from './nav/Screen3'
import Screen4 from './nav/Screen4'
import Screen2 from './nav/Screen2'
import Screen5 from './nav/Screen5'
import getWeb3 from './web3/getWeb3'
import getRate from './web3/getRate'
import logo from './images/etheraffleLogo.svg'
import getEthAccount from './web3/getEthAccount'
import WelcomeModal from './components/modals/welcomemodal'
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router'
/*
Notes:

buy etheraffIe.com to to stop phishing (on web font it looks identical!)
*/
class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      key: 'init',
      contact: false,
      mounted: false,
      screenIndex: null,
      prizePool: ". . .",
      }
  }

  componentWillMount() {
    this.setState({mounted: true})
    this.eventEmitter = new EventEmitter()
    this.eventEmitter.addListener("navigateScreen", ({screenIndex}) => {
      this.updateScreen({screenIndex})
    })
  }

  componentDidMount(){
    getWeb3()
    .then(web3 => {
      window.web3 = web3
      /* Following promises fire in parallel, & aren't dealt with by promise.all since all errors need treating individually. No connection check since we've literally just attempted a web3 connection */
      getEthAccount().then(acc => {
        window.ethAdd = acc
        this.setState({key: Math.random()})
      }).catch(err => {
        window.ethAdd = null
        this.setState({key: Math.random()})
      })
      getRate().then(rate => {
        window.exRate = rate
      }).catch (err => console.log('Error retrieving exchange rate: ', err))
    }).catch(err => {//No web3 ∴ treat as though no eth connections whatsoever
      console.log("Error getting web3 details: ", err)
      window.web3   = null
      window.ethAdd = null
      window.exRate = null
      return this.setState({key: Math.random()})
    })
  }

  updateScreen({screenIndex}) {
    if(this.state.mounted === true) this.setState({screenIndex})
  }

  componentWillUnmount(){
    if(this.state.mounted === true) this.setState({mounted: false})
  }

  render() {
    return (
      <div className='container'>
        <div className="app">

          <img src={logo} className='appLogo' alt="Etheraffle logo" />

          <div className="app-wrapper">

          {/* Welcome Modal */}
            <WelcomeModal
              _key={this.state.key}
              screenIndex={this.state.screenIndex}
              />

            {/* Navigation component */}
              <Nav
                key={this.state.key + 1}
                eventEmitter={this.eventEmitter}
                screenIndex={this.state.screenIndex}
                />
              <div key={this.state.key + 2} className="main-content">
                {React.cloneElement(this.props.children, {eventEmitter: this.eventEmitter})}
              </div>
            </div>

            {/* Info at very bottom of page */}
            <div className="underInfo">
              <p>
                <b>&#x274d;</b>
                &nbsp;
                v 0.9.1 Beta
                &nbsp;
                <b>&#x274d;</b>
                &nbsp;
                <Link className={'routerLink invert screen' + this.props.screenIndex} to='/contact'>
                  Contact
                </Link>
                &nbsp;
                <b>&#x274d;</b>
                &nbsp;
                 © Etheraffle {(new Date()).getFullYear()} <b>&#x274d;</b>
              </p>
            </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Screen5} />/{/*defaults to the weekly on load!*/}
      <Route path="/hourly" component={Screen1} />
      <Route path="/tierzero" component={Screen2} />
      <Route path="/ico" component={Screen2} />
      <Route path="/daily" component={Screen3} />
      <Route path="/contact" component={Screen4} />
      <Route path="/weekly" component={Screen5} />
    </Route>
  </Router>,
  document.getElementById('root')
)
