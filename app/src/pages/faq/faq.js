import React from 'react'
import LOT from '../../components/lot'
import IWonBut from './questions/IWonBut'
import eLogo from '../../images/eLogo.svg'
import WhatIsLot from './questions/WhatIsLot'
import HowCanIBe from './questions/HowCanIBe'
import HowDoILogin from './questions/HowDoILogin'
import Accordion from '../../components/accordion'
import WhyAreYouBetter from './questions/WhyAreYouBetter'
import WhatIsEtheraffle from './questions/WhatIsEtheraffle'
import HowDoIKnowIfIveWon from './questions/HowDoIKnowIfIveWon'
import HowDoIEnterARaffle from './questions/HowDoIEnterARaffle'
import WillItKnowMyDetails from './questions/WillItKnowMyDetails'
import IAccidentallyClosed from './questions/IAccidentallyClosed'
import CanIEnterMoreThanOnce from './questions/CanIEnterMoreThanOnce'
import HowDoIClaimMyWinnings from './questions/HowDoIClaimMyWinnings'
import HowDoIKnowIfIveEntered from './questions/HowDoIKnowIfIveEntered'


export default (props) => {
  let acc1 = [
    {title: 'What is Etheraffle?',
    component: WhatIsEtheraffle},
    {title: 'Why are you better than existing blockchain lotteries?',
    component: WhyAreYouBetter},
    {title: 'What is the LOT token?',
    component: WhatIsLot},
    {title: 'How can I be a part of Etheraffle?',
    component: HowCanIBe}
  ]
  let acc2 = [
    {title: 'How do I login?',
    component: HowDoILogin},
    {title: 'How do I enter a raffle?',
    component: HowDoIEnterARaffle},
    {title: 'Will it remember my details?',
    component: WillItKnowMyDetails},
    {title: 'How do I know I\'ve entered?',
    component: HowDoIKnowIfIveEntered},
    {title: 'How do I know if I\'ve won?',
    component: HowDoIKnowIfIveWon},
    {title: 'How do I claim my winnings?',
    component: HowDoIClaimMyWinnings},
    {title: 'I won but it hasn\'t appeared in my account yet?',
    component: IWonBut},
    {title: 'Can I enter the same raffle more than once?',
    component: CanIEnterMoreThanOnce},
    {title: 'I accidentally closed the tab, am I still in the draw?',
    component: IAccidentallyClosed}
  ]

  return(
    <div className={"contentWrapper si" + props.screenIndex}>
      <div className={"content ssi" + props.subScreenIndex}>
        <h3 className={'centred screen' + props.screenIndex}>
            Frequently Asked Questions
        </h3>
        <br/>
        <LOT className='faqLogo' fill={props.screenIndex} />
        <p>
          Etheraffle Questions:
        </p>
          <Accordion arr={acc1} screenIndex={props.screenIndex} />
        <br/>
        <img className='faqLogo' src={eLogo} alt='e Logo' />
        <p>
          Raffle Questions:
        </p>
         <Accordion arr={acc2} screenIndex={props.screenIndex} />
      </div>
    </div>
  )
}
