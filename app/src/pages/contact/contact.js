import React from 'react'
import ContactForm from '../../components/contactform/contactForm'

export default class Contact extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      mounted: false,
    }
  }

  componentWillMount(){
    this.setState({mounted:true})
  }

  render() {
    return (
      <div className={this.props.mobile ? "" : "simpleContent"}>

        <ContactForm screenIndex={this.props.screenIndex} />

      </div>
    )
  }
}
