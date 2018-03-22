import React from 'react'
import ContactForm from '../../components/contactform/contactForm'

export default (props) => {
  return (
    <div className={props.mobile ? "" : "simpleContent"}>
      <ContactForm screenIndex={props.screenIndex} />
    </div>
  )
}

