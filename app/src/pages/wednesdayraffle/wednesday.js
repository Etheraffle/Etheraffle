import React from 'react'
import LOT from '../../components/lot'
import Subnav from '../../components/subnav'

export default class Wednesday extends React.Component {

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
              <h3 className='centred'>
                Welcome to the <span className={'styledSpan screen' + this.state.screenIndex}>Wednesday Raffle!</span>
              </h3>
              <br/>
                <LOT height='4em' fill={this.state.screenIndex} />
                <br/>

                <p className='justify'>
                  Whilst we continue developing the smart-contracts needed for the Wednesday raffle, why not check out how you playing Etheraffle is also <a className={'invert screen' + this.state.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>supporting good causes</a> world wide! Better still, right now you can become a part of Etheraffle by <a className={'invert screen' + this.state.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>joining our ICO!</a> Purchasing LOT tokens allows you to <a className={'invert screen' + this.state.screenIndex} href='https://etheraffle.com/ico' target='_blank' rel='noopener noreferrer'>receive ether</a> generated by Etheraffle, whilst also giving you voting rights on the only truly decentralized and charitable lottery ÐApp on the ethereum blockchain!
                </p>
            </div>
          </div>
        </div>
      </Subnav>
    )
  }
}