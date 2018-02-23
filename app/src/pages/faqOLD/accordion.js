import React, { Component } from 'react'
import IWonBut from './questions/IWonBut'
import HowDoILogin from './questions/HowDoILogin'
import { Accordion, AccordionItem } from 'react-sanfona'
import HowDoIKnowIfIveWon from './questions/HowDoIKnowIfIveWon'
import HowDoIEnterARaffle from './questions/HowDoIEnterARaffle'
import WillItKnowMyDetails from './questions/WillItKnowMyDetails'
import IAccidentallyClosed from './questions/IAccidentallyClosed'
import CanIEnterMoreThanOnce from './questions/CanIEnterMoreThanOnce'
import HowDoIClaimMyWinnings from './questions/HowDoIClaimMyWinnings'
import HowDoIKnowIfIveEntered from './questions/HowDoIKnowIfIveEntered'

export default class TheAccordion extends Component {
/*
Other potential questions:

Can I get a refund on my ticket?
*/
	render() {
    const arr = [//This arr governs the rendered order...
			'How do I log in?',
			//"How do I enter a raffle?"
			/*,
			"Will it remember my details?",
			"How do I know I've entered?",
      "How do I know if I've won?",
			"How do I claim my winnings?",
      "I won but it hasn't appeared in my account yet?",
      "Can I enter the same raffle more than once?",
      "I accidentally closed the tab, am I still in the draw?"
			*/
      ]
		return (

			<Accordion
				allowMultiple={true}
				openNextAccordionItem={false}
				easing={'ease'}
				>

				{arr.map((item) => {
					return (

						<AccordionItem className={"screen" + this.props.screenIndex} title={`${ item }`} slug={item} key={item}>

							<div>
								{item === "How do I log in?" ?
									<HowDoILogin screenIndex={this.props.screenIndex} />
								: null}
							</div>

							<div>
								{item === "How do I enter a raffle?" ?
									<HowDoIEnterARaffle screenIndex={this.props.screenIndex} />
								: null}
							</div>

							<div>
								{item === "Will it remember my details?" ?
									<WillItKnowMyDetails screenIndex={this.props.screenIndex} />
								: null}
							</div>

							<div>
								{item === "How do I know I've entered?" ?
									<HowDoIKnowIfIveEntered screenIndex={this.props.screenIndex} />
								: null}
							</div>

							<div>
								{item === "How do I know if I've won?" ?
									<HowDoIKnowIfIveWon screenIndex={this.props.screenIndex} />
								: null}
							</div>

							<div>
								{item === "How do I claim my winnings?" ?
									<HowDoIClaimMyWinnings screenIndex={this.props.screenIndex} />
								: null}
							</div>

              <div>
                {item === "I won but it hasn't appeared in my account yet?" ?
									<IWonBut screenIndex={this.props.screenIndex}/>
								: null}
              </div>

							<div>
                {item === "Can I enter the same raffle more than once?" ?
                	<CanIEnterMoreThanOnce screenIndex={this.props.screenIndex}/>
                : null}
              </div>

							<div>
							{item === "I accidentally closed the tab, am I still in the draw?" ?
								<IAccidentallyClosed screenIndex={this.props.screenIndex}/>
							: null}
							</div>

            </AccordionItem>
					)
				})}
			</Accordion>
		)
	}
}
