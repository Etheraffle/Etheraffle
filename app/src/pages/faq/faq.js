import React from 'react'
import LOT from '../../components/lot'
import IWonBut from './questions/IWonBut'
import eLogo from '../../images/eLogo.svg'
import WhatIsLot from './questions/WhatIsLot'
import HowCanIBe from './questions/HowCanIBe'
import HowDoILogin from './questions/HowDoILogin'
import WhyAreYouBetter from './questions/WhyAreYouBetter'
import WhatIsEtheraffle from './questions/WhatIsEtheraffle'
import HowDoIKnowIfIveWon from './questions/HowDoIKnowIfIveWon'
import HowDoIEnterARaffle from './questions/HowDoIEnterARaffle'
import WillItKnowMyDetails from './questions/WillItKnowMyDetails'
import IAccidentallyClosed from './questions/IAccidentallyClosed'
import CanIEnterMoreThanOnce from './questions/CanIEnterMoreThanOnce'
import HowDoIClaimMyWinnings from './questions/HowDoIClaimMyWinnings'
import HowDoIKnowIfIveEntered from './questions/HowDoIKnowIfIveEntered'
import '../../../node_modules/react-accessible-accordion/dist/react-accessible-accordion.css'
import { Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion'


export default (props) => {
  let accord1 = [], acc1 = [], accord2 = [], acc2 = []
  accord1.push(
    {title: 'What is Etheraffle?',
    component: WhatIsEtheraffle},
    {title: 'Why are you better than existing blockchain lotteries?',
    component: WhyAreYouBetter},
    {title: 'What is the LOT token?',
    component: WhatIsLot},
    {title: 'How can I be a part of Etheraffle?',
    component: HowCanIBe}
  )
  accord1.map((item, i) => {
    let Comp = item.component
    return acc1.push(
      <AccordionItem expanded={false} key={i}>
        <AccordionItemTitle>
          <p className={'screen' + props.screenIndex}>
            <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
            {item.title}
          </p>
        </AccordionItemTitle>
        <AccordionItemBody>
          <Comp screenIndex={props.screenIndex} key={i*2} />
        </AccordionItemBody>
      </AccordionItem>
    )
  })
  accord2.push(
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
  )
  accord2.map((item, i) => {
    let Comp = item.component
    return acc2.push(
      <AccordionItem expanded={false} key={i}>
        <AccordionItemTitle>
          <p className={'screen' + props.screenIndex}>
            <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
            {item.title}
          </p>
        </AccordionItemTitle>
        <AccordionItemBody>
          <Comp screenIndex={props.screenIndex} key={i*2} />
        </AccordionItemBody>
      </AccordionItem>
    )
  })
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
        <Accordion>
          {acc1}
        </Accordion>
        <br/>
        <img className='faqLogo' src={eLogo} alt='e Logo' />
        <p>
          Raffle Questions:
        </p>
        <Accordion>
          {acc2}
        </Accordion>
      </div>
    </div>
  )
}
