import React from 'react'

export default (props) => {
  return (
    <div className={"belowContent screen" + props.screenIndex}>
    <br/>
      <h3 className={'centred screen' + props.screenIndex}>
        Welcome to the Wednesday Raffle!
      </h3>
      <p className="centred">
        Coming soon...
      </p>
    </div>
  )
}
