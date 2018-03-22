import React from 'react'
import Subnav from '../nav/subnav'

export default class Wednesday extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      screenIndex: 3,
      subScreenIndex: 2
    }
  }

  componentWillMount() {
    this.props.eventEmitter.emit("navigateScreen", {screenIndex: 3})
  }

  render() {
    return(
      <Subnav
        screenIndex={this.state.screenIndex}
        subScreenIndex={this.state.subScreenIndex} />
    )
  }
}
