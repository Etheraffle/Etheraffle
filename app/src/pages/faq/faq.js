import React from 'react'
import eLogo from '../../images/eLogo.svg'
import LOT from '../../components/lot'
import IWonBut from './questions/IWonBut'
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
import { Accordion,AccordionItem,AccordionItemTitle,AccordionItemBody } from 'react-accessible-accordion'


export default (props) => {
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

          <AccordionItem>
            <AccordionItemTitle>
              <p className={'screen' + props.screenIndex}>
                <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
                What is Etheraffle?
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <WhatIsEtheraffle screenIndex={props.screenIndex} />
            </AccordionItemBody>
          </AccordionItem>

          <AccordionItem>
            <AccordionItemTitle>
              <p className={'screen' + props.screenIndex}>
                <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
                Why are you better than existing blockchain lotteries?
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <WhyAreYouBetter screenIndex={props.screenIndex} />
            </AccordionItemBody>
          </AccordionItem>

          <AccordionItem>
            <AccordionItemTitle>
              <p className={'screen' + props.screenIndex}>
                <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
                What is the LOT token?
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <WhatIsLot screenIndex={props.screenIndex} />
            </AccordionItemBody>
          </AccordionItem>

          <AccordionItem>
            <AccordionItemTitle>
              <p className={'screen' + props.screenIndex}>
                <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
                How can I be a part of Etheraffle?
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <HowCanIBe screenIndex={props.screenIndex} />
            </AccordionItemBody>
          </AccordionItem>

        </Accordion>

        <br/>

        <img className='faqLogo' src={eLogo} alt='e Logo' />
        <p>
          Raffle Questions:
        </p>

        <Accordion>

        <AccordionItem expanded={false}>
          <AccordionItemTitle>
            <p className={'screen' + props.screenIndex}>
              <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
              How do I login?
            </p>
          </AccordionItemTitle>
          <AccordionItemBody>
            <HowDoILogin screenIndex={props.screenIndex} />
          </AccordionItemBody>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemTitle>
            <p className={'screen' + props.screenIndex}>
              <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
              How do I enter a raffle?
            </p>
          </AccordionItemTitle>
          <AccordionItemBody>
            <HowDoIEnterARaffle screenIndex={props.screenIndex}/>
          </AccordionItemBody>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemTitle>
            <p className={'screen' + props.screenIndex}>
              <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
              Will it remember my details?
            </p>
          </AccordionItemTitle>
          <AccordionItemBody>
            <WillItKnowMyDetails screenIndex={props.screenIndex}/>
          </AccordionItemBody>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemTitle>
            <p className={'screen' + props.screenIndex}>
              <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
              How do I know I've entered?
            </p>
          </AccordionItemTitle>
          <AccordionItemBody>
            <HowDoIKnowIfIveEntered screenIndex={props.screenIndex}/>
          </AccordionItemBody>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemTitle>
            <p className={'screen' + props.screenIndex}>
              <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
              How do I know if I've won?
            </p>
          </AccordionItemTitle>
          <AccordionItemBody>
            <HowDoIKnowIfIveWon screenIndex={props.screenIndex}/>
          </AccordionItemBody>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemTitle>
            <p className={'screen' + props.screenIndex}>
              <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
              How do I claim my winnings?
            </p>
          </AccordionItemTitle>
          <AccordionItemBody>
            <HowDoIClaimMyWinnings screenIndex={props.screenIndex}/>
          </AccordionItemBody>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemTitle>
            <p className={'screen' + props.screenIndex}>
              <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
              I won but it hasn't appeared in my account yet?
            </p>
          </AccordionItemTitle>
          <AccordionItemBody>
            <IWonBut screenIndex={props.screenIndex}/>
          </AccordionItemBody>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemTitle>
            <p className={'screen' + props.screenIndex}>
              <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
              Can I enter the same raffle more than once?
            </p>
          </AccordionItemTitle>
          <AccordionItemBody>
            <CanIEnterMoreThanOnce screenIndex={props.screenIndex}/>
          </AccordionItemBody>
        </AccordionItem>

        <AccordionItem>
          <AccordionItemTitle>
            <p className={'screen' + props.screenIndex}>
              <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
              I accidentally closed the tab, am I still in the draw?
            </p>
          </AccordionItemTitle>
          <AccordionItemBody>
            <IAccidentallyClosed screenIndex={props.screenIndex}/>
          </AccordionItemBody>
        </AccordionItem>

      </Accordion>

      </div>
    </div>
  )
}
