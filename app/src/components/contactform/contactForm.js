import Input from './input'
import Formsy from 'formsy-react'
import TextArea from './textArea'
import React, { Component } from 'react'

export default class ContactForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      canSubmit: false,
      database: 1
    }
    this.disableButton = this.disableButton.bind(this)
    this.enableButton  = this.enableButton.bind(this)
    this.submit        = this.submit.bind(this)
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
      console.log("Error updating details: ", err.stack)
      if (this.state.canSubmit) this.setState({database: 0})//database down...
    })
  }

  render() {
    return (
      <div className={!this.props.faq ? 'contactForm screen' + this.props.screenIndex : 'contactFormFaq screen' + this.props.screenIndex}>

        {/* All things fine */}
        {this.state.database === 1 &&
          <Formsy className='formsy' onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>

            {/* Not showing title if rendered in the faq section */}
            {!this.props.faq &&
              <p>
                <span
                  className={'styledSpan largerFont bold centred screen' + this.props.screenIndex}>
                  Etheraffle Contact Form
                </span>
              </p>
            }

            <p>
              Your email address:
            </p>
            <Input
              _className={'contactForm email screen' + this.props.screenIndex}
              name="email"
              validations="isEmail"
              validationError="Not a valid email!"
              required
            />
            <p>Your query: </p>
            <TextArea
              _className={'contactForm query screen' + this.props.screenIndex}
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
              <span className={'styledSpan largerFont screen' + this.props.screenIndex}>
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
              <span className={'styledSpan largerFont screen' + this.props.screenIndex}>
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
              <span className={'styledSpan largerFont screen' + this.props.screenIndex}>
              Error sending email!
              </span>
              <br/>
              Please try again later
            </p>
          </div>
        }

      </div>
    )
  }
}
