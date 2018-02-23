import React, { Component } from 'react'
import Contact from '../pages/contact/contact'

export default class Screen4 extends Component{

  constructor(props){
    super(props)
    this.state = {
      screenIndex: 4,
    }
  }

  componentWillMount() {
    this.props.eventEmitter.emit("navigateScreen", {screenIndex: 4})
  }

  render(){
    return(
      <Contact screenIndex={this.state.screenIndex} />
    )
  }
}
