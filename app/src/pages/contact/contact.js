import React from 'react'
import ContactForm from '../../components/contactform/contactForm'

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
      <div className={this.props.mobile ? "" : "simpleContent"}>
        <ContactForm screenIndex={this.state.screenIndex} />
      </div>
    )
  }
}
