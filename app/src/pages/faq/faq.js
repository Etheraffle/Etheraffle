import React from 'react'
import IWonBut from './questions/IWonBut'
import HowDoILogin from './questions/HowDoILogin'
import HowDoIKnowIfIveWon from './questions/HowDoIKnowIfIveWon'
import HowDoIEnterARaffle from './questions/HowDoIEnterARaffle'
import WillItKnowMyDetails from './questions/WillItKnowMyDetails'
import IAccidentallyClosed from './questions/IAccidentallyClosed'
import CanIEnterMoreThanOnce from './questions/CanIEnterMoreThanOnce'
import HowDoIClaimMyWinnings from './questions/HowDoIClaimMyWinnings'
import HowDoIKnowIfIveEntered from './questions/HowDoIKnowIfIveEntered'
import '../../../node_modules/react-accessible-accordion/dist/react-accessible-accordion.css'
import { Accordion,AccordionItem,AccordionItemTitle,AccordionItemBody } from 'react-accessible-accordion'


export default class Help extends React.Component {

  render() {
    return(
      <div className={"contentWrapper si" + this.props.screenIndex}>
        <div className={"content ssi" + this.props.subScreenIndex}>

          <h3 className={'centred screen' + this.props.screenIndex}>
              Frequently Asked Questions
          </h3>

          <br/>

          <Accordion>
            
          <AccordionItem expanded={true}>
            <AccordionItemTitle>
              <p className={'screen' + this.props.screenIndex}>
                <span className={'styledSpan screen' + this.props.screenIndex}><b>&#x274d;&ensp;</b></span>
                How do I login?
              </p>
              {/*<div>With a bit of description</div>*/}
            </AccordionItemTitle>
            <AccordionItemBody>
              <HowDoILogin screenIndex={this.props.screenIndex} />
            </AccordionItemBody>
          </AccordionItem>

          <AccordionItem>
            <AccordionItemTitle>
              <p className={'screen' + this.props.screenIndex}>
                <span className={'styledSpan screen' + this.props.screenIndex}><b>&#x274d;&ensp;</b></span>
                How do I enter a raffle?
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <HowDoIEnterARaffle screenIndex={this.props.screenIndex}/>
            </AccordionItemBody>
          </AccordionItem>

          <AccordionItem>
            <AccordionItemTitle>
              <p className={'screen' + this.props.screenIndex}>
                <span className={'styledSpan screen' + this.props.screenIndex}><b>&#x274d;&ensp;</b></span>
                Will it remember my details?
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <WillItKnowMyDetails screenIndex={this.props.screenIndex}/>
            </AccordionItemBody>
          </AccordionItem>

          <AccordionItem>
            <AccordionItemTitle>
              <p className={'screen' + this.props.screenIndex}>
                <span className={'styledSpan screen' + this.props.screenIndex}><b>&#x274d;&ensp;</b></span>
                How do I know I've entered?
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <HowDoIKnowIfIveEntered screenIndex={this.props.screenIndex}/>
            </AccordionItemBody>
          </AccordionItem>

          <AccordionItem>
            <AccordionItemTitle>
              <p className={'screen' + this.props.screenIndex}>
                <span className={'styledSpan screen' + this.props.screenIndex}><b>&#x274d;&ensp;</b></span>
                How do I know if I've won?
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <HowDoIKnowIfIveWon screenIndex={this.props.screenIndex}/>
            </AccordionItemBody>
          </AccordionItem>

          <AccordionItem>
            <AccordionItemTitle>
              <p className={'screen' + this.props.screenIndex}>
                <span className={'styledSpan screen' + this.props.screenIndex}><b>&#x274d;&ensp;</b></span>
                How do I claim my winnings?
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <HowDoIClaimMyWinnings screenIndex={this.props.screenIndex}/>
            </AccordionItemBody>
          </AccordionItem>

          <AccordionItem>
            <AccordionItemTitle>
              <p className={'screen' + this.props.screenIndex}>
                <span className={'styledSpan screen' + this.props.screenIndex}><b>&#x274d;&ensp;</b></span>
                I won but it hasn't appeared in my account yet?
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <IWonBut screenIndex={this.props.screenIndex}/>
            </AccordionItemBody>
          </AccordionItem>

          <AccordionItem>
            <AccordionItemTitle>
              <p className={'screen' + this.props.screenIndex}>
                <span className={'styledSpan screen' + this.props.screenIndex}><b>&#x274d;&ensp;</b></span>
                Can I enter the same raffle more than once?
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <CanIEnterMoreThanOnce screenIndex={this.props.screenIndex}/>
            </AccordionItemBody>
          </AccordionItem>

          <AccordionItem>
            <AccordionItemTitle>
              <p className={'screen' + this.props.screenIndex}>
                <span className={'styledSpan screen' + this.props.screenIndex}><b>&#x274d;&ensp;</b></span>
                I accidentally closed the tab, am I still in the draw?
              </p>
            </AccordionItemTitle>
            <AccordionItemBody>
              <IAccidentallyClosed screenIndex={this.props.screenIndex}/>
            </AccordionItemBody>
          </AccordionItem>

        </Accordion>

        </div>
      </div>
    )
  }
}
