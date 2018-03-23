import React from 'react'
import Subnav from '../../components/subnav'

export default class Instant extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      screenIndex: 1,
      mounted: false,
      subScreenIndex: 2
    }
  }

  componentWillMount() {
    this.setState({mounted: true})
    this.props.eventEmitter.emit("navigateScreen", {screenIndex: 1})
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
            <div className={"content ssi" + this.state.subScreenIndex}>
              <div className="aboveContent" />
              <div className="centreContent" />
              <div className={"belowContent screen" + this.state.screenIndex}>
                <br/>
                <h3 className={'centred screen' + this.state.screenIndex}>
                  Welcome to the Instant Raffle!
                </h3>
                <p className='centred'>
                  Coming soon...
                </p>
              </div>
            </div>
          </div>
      </Subnav>
    )
  }
}
