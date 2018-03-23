import React from 'react'
import ReactDOM from 'react-dom'
import Ico from './pages/ico/ico'
import Nav from './components/nav'
import './styles/css/main.min.css'
import getWeb3 from './web3/getWeb3'
import getRate from './web3/getRate'
import { EventEmitter } from 'events'
import Footer from './components/footer'
import Contact from './pages/contact/contact'
import logo from './images/etheraffleLogo.svg'
import getEthAccount from './web3/getEthAccount'
import Instant from './pages/instantraffle/instant'
import Saturday from './pages/saturdayraffle/saturday'
import Wednesday from './pages/wednesdayraffle/wednesday'
import WelcomeModal from './components/modals/welcomemodal'
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      key: 'init',
      contact: false,
      mounted: false,
      screenIndex: null,
      prizePool: ". . ."
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
      /* Following promises fire in parallel, & aren't dealt with by promise.all since all errors need treating individually. No cxn check since we've literally just attempted a web3 connection */
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
    if (this.state.mounted === true) this.setState({screenIndex})
  }

  componentWillUnmount(){
    if (this.state.mounted === true) this.setState({mounted: false})
  }

  render() {
    return (
      <div className='container'>
        <div className="app">

          <img src={logo} className='appLogo' alt="Etheraffle logo" />

          <div className="app-wrapper">
            
            <WelcomeModal
              _key={this.state.key}
              screenIndex={this.state.screenIndex} />
            
            <Nav
              key={this.state.key + 1}
              eventEmitter={this.eventEmitter}
              screenIndex={this.state.screenIndex} />
            
            {/* The content panes */}
            <div key={this.state.key + 2} className="main-content">
              {React.cloneElement(this.props.children, {eventEmitter: this.eventEmitter})}
            </div>
            
          </div>

          <Footer screenIndex={this.state.screenIndex} />

        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Saturday} />
      <Route path="/ico"       component={Ico} />
      <Route path="/instant"   component={Instant} />
      <Route path="/contact"   component={Contact} />
      <Route path="/saturday"  component={Saturday} />
      <Route path="/wednesday" component={Wednesday} />
    </Route>
  </Router>,
  document.getElementById('root')
)