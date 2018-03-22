import React from 'react'
import BelowContent from './belowcontent.js'

export default (props) => {
  return(
    <div className={"contentWrapper si" + props.screenIndex}>
      <div className={"content ssi" + props.subScreenindex}>
        <div className="aboveContent">
        </div>
        <div className="centreContent">
        </div>
        <BelowContent screenIndex={props.screenIndex} />
      </div>
    </div>
  )
}
