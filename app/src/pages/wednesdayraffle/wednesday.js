import React from 'react'
import Subnav from '../../components/subnav'

export default class Wednesday extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      screenIndex: 3,
      mounted: false,
      subScreenIndex: 2
    }
  }

  componentWillMount() {
    this.setState({mounted: true})
    this.props.eventEmitter.emit("navigateScreen", {screenIndex: 3})
  }

  componentWillUnmount()  {
    if (this.state.mounted) this.setState({mounted: false})
  }

  render() {
    return(
      <Subnav 
        screenIndex={this.state.screenIndex}
        subScreenIndex={this.state.subScreenIndex} >
        <div className={"contentWrapper si" + this.state.screenIndex}>
          <div className={"content ssi" + this.state.subScreenindex}>
            <div className="aboveContent" />
            <div className="centreContent" />
            <div className={"belowContent screen" + this.state.screenIndex}>
              <br/>
              <h3 className={'centred screen' + this.state.screenIndex}>
                Welcome to the Wednesday Raffle!
              </h3>
              <p className="centred">
                Coming soon...
              </p>
            </div>
          </div>
        </div>
      </Subnav>
    )
  }
}
