import React from 'react'

export default class ICOWhatDoesLOTDo extends React.Component{

  render(){
    return(
      <div>

        <p><span className="styledSpan centred largerFont" style={{'fontSize':'1.5em'}}><b>&#x274d;</b></span></p>

        <h2 className={"centred underlined screen" + this.props.screenIndex}>What does my LOT do?</h2>

        <div className="code centred" style={{'marginLeft':'20px', 'marginRight':'20px'}}>
            (Users amount of LOT / Σ LOT) * Σ ticket sales * 10%
        </div>

      </div>
    )
  }
}
