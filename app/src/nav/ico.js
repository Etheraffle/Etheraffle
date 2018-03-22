import React from 'react'

export default class Ico extends React.Component {

  constructor(props) {
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
      <div />
    )
  }
}
