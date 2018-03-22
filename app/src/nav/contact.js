import React from 'react'
import ContactForm from '../pages/contact/contact'

export default class Contact extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      screenIndex: 4,
    }
  }

  componentWillMount() {
    this.props.eventEmitter.emit("navigateScreen", {screenIndex: 4})
  }

  render() {
    return(
      <ContactForm screenIndex={this.state.screenIndex} />
    )
  }
}
