import { withFormsy } from 'formsy-react'
import React from 'react'

class Input extends React.Component {
  constructor(props) {
    super(props)
    this.changeValue = this.changeValue.bind(this)
  }

  changeValue(event) {
    this.props.setValue(event.currentTarget.value)
  }

  render() {
    const errorMessage = this.props.getErrorMessage()
    return (
      <div>
        <input
          className={this.props._className}
          onChange={this.changeValue}
          type="text"
          value={this.props.getValue() || ''}
        />
        <span>{errorMessage}</span>
      </div>
    )
  }
}

export default withFormsy(Input)
