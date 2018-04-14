import React from 'react'
import { ScreenContext } from '../contexts/screen_context'

export default props => (
  <ScreenContext>
    {screen => (
      <div className='app-nav'>
        <div className={screen.screenIndex === 1 ? 'nav-item screen1 active-nav' : 'nav-item screen1'} onClick={screen.Instant} />
        <div className={screen.screenIndex === 3 ? 'nav-item screen3 active-nav' : 'nav-item screen3'} onClick={screen.Wednesday} />
        <div className={screen.screenIndex === 5 ? 'nav-item screen5 active-nav' : 'nav-item screen5'} onClick={screen.Saturday} />
        <div className={screen.screenIndex === 2 ? 'nav-item screen2 active-nav' : 'nav-item screen2'}>
          <a href='https://www.etheraffle.com/ico' target={window.innerWidth > 1000 ? '_blank' : ''} rel='noopener noreferrer' >
            <p className='invisible'>
              SCREEEEEEN2
            </p>
          </a>
        </div>
      </div>
    )}
  </ScreenContext>
)