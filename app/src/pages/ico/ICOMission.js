import React from 'react'

export default class ICOMission extends React.Component {

  render(){
    const ethrelief = [<a
      key={Math.random()}
      className={"invert screen" + this.props.screenIndex}
      target="_blank"
      rel="noopener noreferrer"
      href='https://www.ethrelief.com'>
      EthRelief
    </a>]


    return(
      <div>
        <p><span className="styledSpan centred largerFont screen" style={{'fontSize':'1.5em'}}><b>&#x274d;</b></span></p>

        <h2 className={"centred underlined screen" + this.props.screenIndex}>
          Our Mission:&ensp;What is this ICO for?
        </h2>

        <p className='justify'>
          <span className={'styledSpan screen' + this.props.screenIndex}>&emsp;&emsp;The Plan:&nbsp;</span>Etheraffle is an already functional, ether based, blockchain lottery and gaming platform whose goals going forward are threefold:
          <br/>
          <br/>
          <span className={"styledSpan screen" + this.props.screenIndex}>&emsp;&emsp;<b>&#x274d;</b></span> To become fully-decentralised by migrating onto the Swarm platform as it develops whilst the same time dissolving the ÐApp ownership and contract-control to a voting based, smart-contract powered, permissionless, Democratic Autonomous Organisation formed of and run by the Etheraffle LOT token holders.
          <br/>
          <br/>
          <span className={"styledSpan screen" + this.props.screenIndex}>&emsp;&emsp;<b>&#x274d;</b></span> To continue providing players with a simple and intuitive user experience that is designed to be navigable by anyone including those completely new to the ethereum ecosystem, giving them opportunities to win enormous prizes whilst their ticket sales go on to provide a host of benefits for both the LOT token holders and Etheraffle's sister company, {ethrelief}.
          <br/>
          <br/>
          <span className={"styledSpan screen" + this.props.screenIndex}>&emsp;&emsp;<b>&#x274d;</b></span> To develop the {ethrelief} portal, Etheraffle's sister blockchain company who will join the LOT token holders in the share of the profits from the Etheraffle ÐApp with the aim of creating and providing the largest source of decentralised altruism on the blockchain, controlled and managed by the same DAO of LOT token holders, and providing charitable donations worldwide.
          <br/>
          <br/>
          <span className={'styledSpan screen' + this.props.screenIndex}>&emsp;&emsp;The ICO:&nbsp;</span> This is your chance to become one of the LOT token holders via this token sale, and thus ultimately one of the decentralised owners of Etheraffle and {ethrelief}. The token is non-mintable and non-minable - those offered during this sale will form the entirety of the tokens that will ever be available.
          <br/>
          <br/>
          From the very beginning, the LOT Token will convey to the holder their share of the profits from the Etheraffle ÐApp, as it's primary utility. As Etheraffle evolves, the LOT's functionality will evolve too, giving LOT holders voting rights and enabling their say in the future of the ÐApp as part of the Etheraffle Democratic Autonomous Organization. Participation rights in the DAO will be endowed upon LOT holders as the smart-contract development and project matures, though LOT holders may be as active or as inactive as they wish <i>without</i> prejudicing their rights to the Etheraffle profit stream. You, as a LOT holder, will ultimately own, run and reap benefits from both Etheraffle and {ethrelief}.
        </p>

        {/*
        <p className='centred'>
          <a className={'inverted screen' + this.props.screenIndex} href='/ico#indepth'>
            ClWhere can I read more?
          </a>
        </p>

        <p className="justify">
          &emsp;&emsp;Lotteries are a profitable industry, with a market cap in excess of <a href="http://totallygaming.com/news/lottery/global-lottery-industry-maintains-growth-trajectory" className={'screen' + this.props.screenIndex} target='_blank' rel="noopener noreferrer">$279.9BN c.2015</a>.
          Cryptocurrencies are certain to disrupt this industry, especially Ethereum once its trustless, decentralized power is realised and adopted by the masses. For this reason, cryptocurrency including Ethererum lotteries already exist, but Etheraffle is different. What none of the extant crypto-lotteries acknowledge is that the vast majority of that lottery market-cap is comprised of none-crypto users, to whom Etheraffle is specicically focused. What these other existing lotteries also ignore is the fact that current, fiat lottiers, due to their extreme profitability, frequently funnel a portion of takings into charitable enterprises, and it is this last point Etheraffle also intends to focus on. As such, our focus is threefold:
          <br/>
          TURN THE FOLLOWING INTO REASONS BEHIND THE THREE MAIN TENETS OUTLINED ABOVE!
          <br/>
          <span className={"styledSpan screen" + this.props.screenIndex}>&emsp;&emsp;<b>&#x274d;</b> To provide an excellent and intuitive user experience</span> - whilst the ethererum technology is disruptive, it also currently has a relatively high barrier to entry. The lottery market is indeed enormous, but the vast majority of that market are not currently ethereum users. Etheraffle intends to change that. By providing the simplest possible way for the player to engage with our ÐApp, we hope to engage and bring ever more people into the ethereum user collective.
          <br/>
          <br/>
          <span className={"styledSpan screen" + this.props.screenIndex}>&emsp;&emsp;<b>&#x274d;</b> To provide long-term value to LOT token holders</span> - as Etheraffle continues to evolve toward full decentralisation, we intend to increase the value of the LOT tokens by providing long-term, stable return for LOT token holders, alongside the host other benefits that the LOT tokens will provide. As Etheraffle's DAO project matrues, LOT token holders will find themselves in control of the entirely of the Etheraffle ÐApp, which will then exist entirely on the blockchain, decentralized, and for the benefit of all.
          <br/>
          <br/>
          <span className={"styledSpan screen" + this.props.screenIndex}>&emsp;&emsp;<b>&#x274d;</b> To create the largest source of decentralised altruism in the world</span> - Etheraffle intends to leverage the power of the Etheraffle platform's profitability by developing the charity portal EthRelief into a fully decentralised, democratic autonomous organization, for the disbursal of profits to charities worldwide, with all LOT Token holders in complete control.
          <br/>
          <br/>
          &emsp;&emsp;Etheraffle provides an affiliated marketing scheme whereby we incentive others to create their own ÐApps to interact with our smart-contract setup, providing them with out-of-the-box access to large prize pools to attract custom, and to take their share of profits on a pro-rata basis per raffle entries made under their affiliate ID. Via this Etheraffle hopes to continuing growing in order to bolster exposure, profitabiltiy for LOT holders and ultimately a larger fund pool for the EthRelief arm.
        </p>
        */}
      </div>
    )
  }
}
