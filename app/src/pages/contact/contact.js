import React from 'react'
import Input from './input'
import Formsy from 'formsy-react'
import TextArea from './textArea'
import { ScreenContext } from '../../contexts/screenContext'

export default class Contact extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      database: 1,
      canSubmit: false
    }
    this.submit        = this.submit.bind(this)
    this.enableButton  = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
  }

  disableButton() {
    this.setState({canSubmit: false})
  }

  enableButton() {
    this.setState({canSubmit: true})
  }

  submit(model) {
    fetch('https://etheraffle.com/api/contactform', {
      method: 'post',
      headers: {'content-type': 'application/JSON'},
      body: JSON.stringify(model)
    })
    .then(res => {
      if (res.status === 503 && this.state.canSubmit) return this.setState({database: 503})
      if (res.status !== 200 && this.state.canSubmit) return this.setState({database: 0})
      return res.json()
      .then(json => {
        if (json.success === true && this.state.canSubmit) return this.setState({database: 2})
        if (json.success === false) throw new Error("Error in send email!")
      })
    }).catch(err => {
      console.log(`Error updating details: ${err.stack}`)
      if (this.state.canSubmit) this.setState({database: 0})//database down...
    })
  }

  render() {
    return (
      <ScreenContext>
        {screen => {
          const { screenIndex: sI } = screen
          return (
        
            <div className={!this.props.faq ? `contactForm screen${sI}` : `contactFormFaq screen${sI}`}>

              {/* All things fine */}
              {this.state.database === 1 &&
                <Formsy className='formsy' onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
                  {/* Not showing title if rendered in the faq section */}
                  {!this.props.faq &&
                    <p><span className={`styledSpan largerFont bold centred screen${sI}`}>Etheraffle Contact Form</span></p>
                  }

                  <p>Your email address:</p>
                  <Input
                    _className={`contactForm email screen${sI}`}
                    name="email"
                    validations="isEmail"
                    validationError="Not a valid email!"
                    required
                  />
                  <p>Your query: </p>
                  <TextArea
                    _className={`contactForm query screen${sI}`}
                    name="query"
                    required
                  />
                  <button
                    type="submit"
                    disabled={!this.state.canSubmit}>
                    Submit
                  </button>
                </Formsy>
              }

              {/* Form submitted succesfully */}
              {this.state.database === 2 &&
                <div>
                  <p className='centred'>
                    <span className={`styledSpan largerFont screen${sI}`}>
                    Email sent!
                    <br/>
                    </span>
                    You will get a reply as soon as possible.
                  </p>
                </div>
              }

              {/* 503 error */}
              {this.state.database === 503 &&
                <div>
                  <p className='centred'>
                    <span className={`styledSpan largerFont screen${sI}`}>
                    Too many submissions from this IP!
                    </span>
                    <br/>
                    Please wait before trying again.
                  </p>
                </div>
              }

              {/* Submission failed */}
              {this.state.database === 0 &&
                <div>
                  <p className='centred'>
                    <span className={`styledSpan largerFont screen${sI}`}>
                    Error sending email!
                    </span>
                    <br/>
                    Please try again later
                  </p>
                </div>
              }

            </div>
          )
        }}
      </ScreenContext>
    )
  }
}
