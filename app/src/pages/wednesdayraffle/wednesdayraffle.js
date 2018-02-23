import React from 'react'
import BelowContent from './belowcontent.js'

export default class Wednesdayraffle extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      mounted: false,
    }
  }

  componentWillMount(){
    this.setState({mounted: true})
  }

  componentWillUnmount(){
    this.setState({mounted: false})
  }

  render(){
      return(
        <div className={"contentWrapper si" + this.props.screenIndex}>
          <div className={"content ssi" + this.props.subScreenindex}>
            <div className="aboveContent">
            </div>
            <div className="centreContent">
            </div>
            <BelowContent screenIndex={this.props.screenIndex} />
          </div>
        </div>
      )
    }
}
