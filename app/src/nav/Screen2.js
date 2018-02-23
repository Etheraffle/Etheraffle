import React, { Component } from 'react'
import ICO from '../pages/ico/ico'

export default class Screen2 extends Component {

  constructor(props){
    super(props)
    this.state = {
      screenIndex: 2,
      subScreenIndex: 2
    }
  }

  componentWillMount() {
    this.props.eventEmitter.emit("navigateScreen", {screenIndex: 2})
  }

  render() {
    return (
      <ICO
        screenIndex={this.state.screenIndex}
        subScreenIndex={this.state.subScreenIndex} />
    )
  }
}
