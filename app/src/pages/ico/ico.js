import React from 'react'
import ICOTierZero from './ICOTierZero'
import ScrollableAnchor from 'react-scrollable-anchor'
import ICOContract from './utils/ICOContract'
import ICODates from './utils/ICODates'
import ICOClock from './ICOClock'
import ICOButton from './ICOButton'
import ICOKeyDates from './ICOKeyDates'
import ICOMission from './ICOMission'
import ICOHowToEnter from './ICOHowToEnter'
import ICOHowDoIRedeemBonus from './ICOHowDoIRedeemBonus'
import ICOWhatDoesLOTDo from './ICOWhatDoesLOTDo'
import ICOWatchTokens from './ICOWatchTokens'
//import ICOInDepth from './InDepth/ICOInDepth'

/*
TODO: Ico redeem button hasn't got the functionality attached yet!!
TODO: Enter button hasn't got functionality attached yet!
*/

export default class ICO extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      mounted: false,
      countdown: "",
      tier: ICODates().tier,
      tierCap: 15000//ether...
    }
  }

  componentWillMount(){
    this.setState({mounted:true})
  }

  render() {
    return (
      <div className={(window.innerWidth < 800) ? "" : "ICOWrapper si" + this.props.screenIndex} style={this.props.style || {}}>
        <div className={this.props.mobile ? "" : "ICOContent"}>

          <h1 className={"centred underlined screen" + this.props.screenIndex}>
            Welcome to the Etheraffle ICO!
          </h1>

          <p
            className="centred"
            data-tip=
            "This is Etheraffle's ICO contract address. Sending ether<br>
            here is how you purchase your Etheraffle LOT tokens.<br>
            The button below provides an easy way to create such a <br>
            transaction, for your convenience."
          >
          ICO Contract Address:&ensp;
            <a
              className={"invert largerFont screen" + this.props.screenIndex}
              target="_blank"
              rel="noopener noreferrer"
              href={"https://etherscan.io/address/" + ICOContract.icoAdd}>
              {ICOContract.icoAdd}
            </a>
          </p>

          <ScrollableAnchor id={'clock'}>
            <ICOClock
              className="clockComponent"
              screenIndex={this.props.screenIndex}/>
          </ScrollableAnchor>

          <ICOButton screenIndex={this.props.screenIndex}/>

          <ScrollableAnchor id={"keydates"}>
            <ICOKeyDates screenIndex={this.props.screenIndex}/>
          </ScrollableAnchor>

          <ScrollableAnchor id={"mission"}>
            <ICOMission screenIndex={this.props.screenIndex}/>
          </ScrollableAnchor>

          <ScrollableAnchor id={"howtoenter"}>
            <ICOHowToEnter screenIndex={this.props.screenIndex} />
          </ScrollableAnchor>

          <ScrollableAnchor id={"howtowatch"}>
            <ICOWatchTokens screenIndex={this.props.screenIndex} />
          </ScrollableAnchor>

          <ScrollableAnchor id={"redeembonus"}>
            <ICOHowDoIRedeemBonus screenIndex={this.props.screenIndex} />
          </ScrollableAnchor>

          <ScrollableAnchor id={"redeembonus"}>
            <ICOWhatDoesLOTDo screenIndex={this.props.screenIndex} />
          </ScrollableAnchor>

          {/*
          <ScrollableAnchor id={"indepth"}>
            <ICOInDepth screenIndex={this.props.screenIndex} />
          </ScrollableAnchor>
          */}

          <ScrollableAnchor id={"tierzero"}>
            <ICOTierZero screenIndex={this.props.screenIndex}/>
          </ScrollableAnchor>

        </div>
      </div>
    )
  }
}
//
