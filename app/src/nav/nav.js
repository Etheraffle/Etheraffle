import React from 'react'
import { Link } from 'react-router'

export default class Nav extends React.Component {
  render(){
    return(
    <div className="app-nav">
      <div
        className={this.props.screenIndex === 1 ? "nav-item screen1 active-nav" : "nav-item screen1"}>
          <Link
            to="/hourly"
            style={{color: 'white'}}
            >
              <p className="invisible">
                <b>SCREEEEEEN3</b>
              </p>
          </Link>
      </div>

      <div
        className={this.props.screenIndex === 3 ? "nav-item screen3 active-nav" : "nav-item screen3"}>
          <Link
            to="/daily"
            style={{color: 'white'}}
            >
            <p className="invisible">
              <b>SCREEEEEEN3</b>
            </p>
          </Link>
      </div>

      <div
        className={this.props.screenIndex === 5 ? "nav-item screen5 active-nav" : "nav-item screen5"}>
          <Link
            to="/weekly"
            style={{color: 'white'}}
            >
            <p className="invisible">
              <b>SCREEEEEEN5</b>
            </p>
          </Link>
      </div>

      <div
        className={this.props.screenIndex === 2 ? "nav-item screen2 active-nav" : "nav-item screen2"}>
          <a
            href='https://www.etheraffle.com/ico'
            style={{color: 'white'}}
            target='_blank'
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
}

/*
<div
  className={this.props.screenIndex === 2 ? "nav-item screen2 active-nav" : "nav-item screen2"}>
    <Link
      to="/ico"
      style={{color: 'white'}}
      >
      <p className="invisible">
        <b>SCREEEEEEN2</b>
      </p>
    </Link>
</div>
<div
  className={this.props.screenIndex === 4 ? "nav-item screen4 active-nav" : "nav-item screen4"}>
    <Link
      to="/ico"
      style={{color: 'lightgrey'}}
      >
      <p className="invisible">
        <b>SCREEEEEEN4</b>
      </p>
    </Link>
</div>
*/
