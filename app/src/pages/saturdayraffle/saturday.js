import React from 'react'
import Subnav from '../../components/subnav'
import Saturdayraffle from '../saturdayraffle/saturdayraffle'

export default class Screen5 extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      screenIndex: 5,
      mounted: false,
      subScreenIndex: 2
    }
  }

  componentWillMount() {
    this.setState({mounted: true})
    this.props.eventEmitter.emit("navigateScreen", {screenIndex: 5})
  }

  componentWillUnmount()  {
    if (this.state.mounted) this.setState({mounted: false})
  }

  render() {
    return(
      <Subnav 
        screenIndex={this.state.screenIndex}
        subScreenIndex={this.state.subScreenIndex} >
        <Saturdayraffle
          screenIndex={this.state.screenIndex}
          subScreenIndex={this.state.subScreenIndex} />
      </Subnav>
    )
  }
}
