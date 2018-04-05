import React from 'react'
import { Link } from 'react-router'

export default props => {
  return(
    <div className="app-nav">
      
      <div className={props.screenIndex === 1 ? "nav-item screen1 active-nav" : "nav-item screen1"}>
        <Link to="/instant" style={{color: 'white'}}>
          <p className="invisible">
            <b>SCREEEEEEN1</b>
          </p>
        </Link>
      </div>

      <div className={props.screenIndex === 3 ? "nav-item screen3 active-nav" : "nav-item screen3"}>
        <Link to="/wednesday" style={{color: 'white'}}>
          <p className="invisible">
            <b>SCREEEEEEN3</b>
          </p>
        </Link>
      </div>

      <div className={props.screenIndex === 5 ? "nav-item screen5 active-nav" : "nav-item screen5"}>
        <Link to="/saturday" style={{color: 'white'}}>
          <p className="invisible">
            <b>SCREEEEEEN5</b>
          </p>
        </Link>
      </div>

      <div className={props.screenIndex === 2 ? "nav-item screen2 active-nav" : "nav-item screen2"}>
        <a
          href='https://www.etheraffle.com/ico'
          style={{color: 'white'}}
          target={window.innerWidth > 1000 ? '_blank' : ''}
          rel='noopener noreferrer'
          >
          <p className="invisible">
            <b>SCREEEEEEN2</b>
          </p>
        </a>
      </div>

    </div>
  )
}