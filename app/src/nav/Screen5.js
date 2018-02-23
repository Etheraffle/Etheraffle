import React, { Component } from 'react'
import Subnav from '../nav/subnav'

export default class Screen5 extends Component{

  constructor(props){
    super(props)
    this.state = {
      screenIndex: 5,
      subScreenIndex: 2
    }
  }

  componentWillMount() {
    this.props.eventEmitter.emit("navigateScreen", {screenIndex: 5})
  }

  render(){
    return(
      <Subnav
        screenIndex={this.state.screenIndex}
        subScreenIndex={this.state.subScreenIndex} />
    )
  }
}
