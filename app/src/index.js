import React from 'react'
import ReactDOM from 'react-dom'
import Nav from './components/nav'
import './styles/css/main.min.css'
import Footer from './components/footer'
import Contact from './pages/contact/contact'
import logo from './images/etheraffleLogo.svg'
import Instant from './pages/instantraffle/instant'
import { EthProvider } from './contexts/ethContext'
import Saturday from './pages/saturdayRaffle/saturdayRaffle'
import Wednesday from './pages/wednesdayraffle/wednesday'
import WelcomeModal from './components/modals/welcomemodal'
import { ScreenProvider, ScreenContext } from './contexts/screenContext'

const App = () => (
  <EthProvider>
    <ScreenProvider>
      <div className='container'>
        <div className="app">
          <ScreenContext.Consumer> 
            {screen => (
              <React.Fragment>
                <img src={logo} className='appLogo' alt="Etheraffle logo" />
                <div className="app-wrapper">
                  <WelcomeModal screenIndex={screen.screenIndex} />
                  <Nav />
                  <div className= 'main-content'>
                    {screen.screenIndex === 1 && <Instant   />}
                    {screen.screenIndex === 3 && <Wednesday />}
                    {screen.screenIndex === 4 && <Contact   />}
                    {screen.screenIndex === 5 && <Saturday  />}
                  </div>
                </div>
                <Footer screenIndex={screen.screenIndex} />
              </React.Fragment>
            )}
          </ScreenContext.Consumer>
        </div>    
      </div>
    </ScreenProvider>
  </EthProvider>
)
ReactDOM.render(<App />, document.getElementById('root'))