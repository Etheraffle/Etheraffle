import React from 'react'

export default class BelowContent extends React.Component {

  render() {
    return (
      <div className={"belowContent screen" + this.props.screenIndex}>
        <br/>
        <h3 className={'centred screen' + this.props.screenIndex}>
          Welcome to the Instant Raffle!
        </h3>
        <p className='centred'>
          Coming soon...
        </p>
      </div>
    )
  }
}
