import React from 'react'
import moment from 'moment'
import ICOContract from './utils/ICOContract'
import ICODates from './utils/ICODates'

export default class ICOHowToEnter extends React.Component{

  render(){
    return(
      <div>
        <p><span className="styledSpan centred largerFont" style={{'fontSize':'1.5em'}}><b>&#x274d;</b></span></p>

        <h2 className={"centred underlined screen" + this.props.screenIndex}>How do I take part?</h2>

        <p className="justify">
          &emsp;&emsp;If you want to take part in the Etheraffle ICO by buying LOT and thus claiming your share of the <span className={"styledSpan screen" + this.props.screenIndex}>Etheraffle & EthRelief Ðapps</span>, simply wait until the ICO is open and send ether to the crowdfund address above. You can use your ethereum client of choice to make the transaction, or, when ICO is open, the button above will give you a simple way to enter for your convience. A form will also appear allowing you to calculate the total LOT your amount of ether will be rewarded with! See below for the LOT reward information.
          <br/>
          <br/>
          However you choose to send ether, once your transaction is mined, the ICO smart contract will calculate your LOT token reward and send them straight to your ethereum account.
          <br/>
          <br/>
          <span className={"styledSpan largerFont centred screen" + this.props.screenIndex}>
            Congratulations, you now own part of Etheraffle & EthRelief!
          </span>
        </p>

        <p><span className="styledSpan centred largerFont" style={{'fontSize':'1.5em'}}><b>&#x274d;</b></span></p>

        <h2 className={"centred underlined screen" + this.props.screenIndex}>How many LOT do I get?</h2>

        <p className='justify'>
        &emsp;&emsp;The ICO has a unique tiered structure. It is split into three tiers, with each tier having its own exchange rate as outlined below. Earlier tiers award both more LOT per ether, plus larger LOT bonuses at the completion of the ICO - so get in early! Each tier has a cap on the amount of LOT available, and LOT are awarded on a first-come, first-serve basis.
        </p>

        <h3 className={'centred screen' + this.props.screenIndex}>
          <span className={"styledSpan screen" + this.props.screenIndex}><b>&#x274d;</b></span>
            &ensp;Tier One Rewards&ensp;
          <span className={"styledSpan screen" + this.props.screenIndex}><b>&#x274d;</b></span>
        </h3>


        <p className='centred'>
          <span className={"styledSpan largerFont screen" + this.props.screenIndex}>{ICOContract.tier1Reward}</span> LOT per Ether!
          <br />
          PLUS final bonus LOT based on Tier 2 sales!
          <br/>
          PLUS final bonus LOT based on Tier 3 sales!
        </p>

        <div className='row'>

          <div>
            <p>
              Tier Cap:
              <br/>
              Runs For:
              <br/>
              Opens:
              <br/>
              Deadline:
            </p>
          </div>

          <div>
            <p>
              {ICOContract.tier1Cap} Ether
              <br/>
              {ICODates().oneDur} Days
              <br/>
              <span className={"styledSpan screen" + this.props.screenIndex}>
                {moment.unix(ICODates().icoStart).format("ddd, MMMM Do YYYY, HH:mm:ss")}
              </span>
              <br/>
              <span className={"styledSpan screen" + this.props.screenIndex}>
                {moment.unix(ICODates().tierTwoStart).subtract(1, 'second').format("ddd, MMMM Do YYYY, HH:mm:ss")}
              </span>
            </p>
          </div>

        </div>

        <br/>

        <h3 className={'centred screen' + this.props.screenIndex}>
          <span className={"styledSpan screen" + this.props.screenIndex}><b>&#x274d;</b></span>
            &ensp;Tier Two Rewards&ensp;
          <span className={"styledSpan screen" + this.props.screenIndex}><b>&#x274d;</b></span>
        </h3>

        <p className='centred'>
          <span className={"styledSpan largerFont screen" + this.props.screenIndex}>{ICOContract.tier2Reward}</span> LOT per Ether!
          <br/>
          PLUS final bonus LOT based on Tier 3 sales!
        </p>

        <div className='row'>

          <div>
            <p>
              Tier Cap:
              <br/>
              Runs For:
              <br/>
              Opens:
              <br/>
              Deadline:
            </p>
          </div>

          <div>
            <p>
              {ICOContract.tier2Cap} Ether
              <br/>
              {ICODates().twoDur} Days
              <br/>
              <span className={"styledSpan screen" + this.props.screenIndex}>
                {moment.unix(ICODates().tierTwoStart).format("ddd, MMMM Do YYYY, HH:mm:ss")}
              </span>
              <br/>
              <span className={"styledSpan screen" + this.props.screenIndex}>
                {moment.unix(ICODates().tierThreeStart).subtract(1, 'second').format("ddd, MMMM Do YYYY, HH:mm:ss")}
              </span>
            </p>
          </div>

        </div>

        <br/>

        <h3 className={'centred screen' + this.props.screenIndex}>
          <span className={"styledSpan screen" + this.props.screenIndex}><b>&#x274d;</b></span>
            &ensp;Tier Three Rewards&ensp;
          <span className={"styledSpan screen" + this.props.screenIndex}><b>&#x274d;</b></span>
        </h3>


        <p className='centred'>
          <span className={"styledSpan largerFont screen" + this.props.screenIndex}>{ICOContract.tier3Reward}</span> LOT per Ether!
        </p>

        <div className='row'>

          <div>
            <p>
              Tier Cap:
              <br/>
              Runs For:
              <br/>
              Opens:
              <br/>
              Deadline:
            </p>
          </div>

          <div>
            <p>
              {ICOContract.tier3Cap} Ether
              <br/>
              {ICODates().threeDur} Days
              <br/>
              <span className={"styledSpan screen" + this.props.screenIndex}>
                {moment.unix(ICODates().tierThreeStart).format("ddd, MMMM Do YYYY, HH:mm:ss")}
              </span>
              <br/>
              <span className={"styledSpan screen" + this.props.screenIndex}>
                {moment.unix(ICODates().tierThreeStart).subtract(1, 'second').format("ddd, MMMM Do YYYY, HH:mm:ss")}
              </span>
            </p>
          </div>

        </div>

        <br/>

        <p className='justify'>
          &emsp;&emsp;The final bonus LOT are dependent on the number of LOT sold in tiers two and three, so if you've managed to get in early, spread the word: The more LOT sold after your purchase, the more bonus LOT you get!
        </p>

        <p><span className="styledSpan centred largerFont" style={{'fontSize':'1.5em'}}><b>&#x274d;</b></span></p>

        <h2 className={"centred underlined screen" + this.props.screenIndex}>Bonus LOT!</h2>

        <p className="justify">
          &emsp;&emsp;Once the ICO is finished, participants who purchased LOT during tier one or tier two (or both) are eligible for the bonus LOT rewards! Bonus LOT are are created at the rate of <span className={"styledSpan largerFont screen" + this.props.screenIndex}>{ICOContract.bonusReward}</span> per ether invested in tiers two and three. Which means there could be up to an extra <span className={"styledSpan largerFont screen" + this.props.screenIndex}>{(ICOContract.tier2Cap + ICOContract.tier3Cap) * ICOContract.bonusReward}</span> LOT available!
          <br/><br/>
          &emsp;&emsp;All tier one LOT purchasers are eligible for their share of the tier two bonus LOT, AND the tier three bonus LOT! All tier two LOT purchasers are eligible for their share of the tier three bonus LOT! The bonus LOT are shared out amongst the eligible purchasers in accordance to their percentage contribution to the total pools of ether raised in the bonus-eligible tiers they purchased LOT in.
          <br/>
        </p>
        <div className="code" style={{'marginLeft':'30px','marginRight':'30px'}}>
          <span style={{fontFamily:"Jockey One",fontWeight:"normal"}} className={"styledSpan centred largerFont screen" + this.props.screenIndex}>Example</span>
          <br/>
          Assume you purchased 10 ether's worth of LOT in tier one.
          <br/>
          Assume maximum ether is raised in each tier.
          <br/>
          <br/>
          Therefore bonus LOT avaible from tier two:
          <br/>
          &emsp;&emsp;&emsp;
          <span className={"styledSpan largerFont screen" + this.props.screenIndex}>
            {ICOContract.tier2Cap} Ether * {ICOContract.bonusReward} Bonus LOT = {ICOContract.tier2Cap * ICOContract.bonusReward} LOT
          </span>
          <br/>
          <br/>
          Therefore bonus LOT avaible from tier three:
          <br/>
          &emsp;&emsp;&emsp;
          <span className={"styledSpan largerFont screen" + this.props.screenIndex}>
            {ICOContract.tier3Cap} Ether * {ICOContract.bonusReward} Bonus LOT = {ICOContract.tier3Cap * ICOContract.bonusReward} LOT
            </span>
          <br/>
          <br/>
          Your percentage share of bonus tickets:
          <br/>
          &emsp;&emsp;&emsp;
          <span className={"styledSpan largerFont screen" + this.props.screenIndex}>
            10 Ether / {ICOContract.tier1Cap} Ether = {(10 / ICOContract.tier1Cap) * 100 + '%'}
          </span>
          <br/>
          <br/>
          Your number of bonus LOT from tier two:
          <br/>
          &emsp;&emsp;&emsp;
          <span className={"styledSpan largerFont screen" + this.props.screenIndex}>
            {(10 / ICOContract.tier1Cap) * 100 + '%'} of {ICOContract.tier2Cap * ICOContract.bonusReward} LOT = {((10 / ICOContract.tier1Cap)) * (ICOContract.tier2Cap * ICOContract.bonusReward)} LOT
          </span>
          <br/>
          <br/>
          Your number of bonus LOT from tier three:
          <br/>
          &emsp;&emsp;&emsp;
          <span className={"styledSpan largerFont screen" + this.props.screenIndex}>
            {(10 / ICOContract.tier1Cap) * 100 + '%'} of {ICOContract.tier3Cap * ICOContract.bonusReward} LOT = {((10 / ICOContract.tier1Cap)) *(ICOContract.tier3Cap * ICOContract.bonusReward)} LOT
          </span>
          <br/>
          <br/>
          Your total number of bonus LOT:
          &emsp;&emsp;&emsp;
          <span style={{fontFamily:"Jockey One",fontWeight:"normal"}} className={"styledSpan centred largerFont screen" + this.props.screenIndex}>
            {(((10 / ICOContract.tier1Cap)) * (ICOContract.tier2Cap * ICOContract.bonusReward)) + (((10 / ICOContract.tier1Cap)) *(ICOContract.tier3Cap * ICOContract.bonusReward))} LOT!
          </span>
        </div>

        <p className="justify">
          &emsp;&emsp;Sound complicated? Don't worry, Etheraffle's ICO smart contract does all the maths for you, meaning you can redeem your bonus LOT at the click of a button.
        </p>
      </div>
    )
  }
}
