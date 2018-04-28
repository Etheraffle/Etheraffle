import React from 'react'
import LOT from '../../components/lot'
import IWonBut from './questions/i_won_but'
import eLogo from '../../images/e_logo.svg'
import FreeLOT from '../../components/free_lot'
import WhatIsLot from './questions/what_is_lot'
import HowCanIBe from './questions/how_can_i_be'
import Accordion from '../../components/accordion'
import HowDoILogin from './questions/how_do_i_login'
import WhyAreYouBetter from './questions/why_are_you_better'
import WhatIsEtheraffle from './questions/what_is_etheraffle'
import IAccidentallyClosed from './questions/i_accidentally_closed'
import HowDoIEnterARaffle from './questions/how_do_i_enter_a_raffle'
import WillItKnowMyDetails from './questions/will_it_know_my_details'
import HowDoIKnowIfIveWon from './questions/how_do_i_know_if_ive_won'
import CanIEnterMoreThanOnce from './questions/can_i_enter_more_than_once'
import HowDoIClaimMyWinnings from './questions/how_do_i_claim_my_winnings'
import HowDoIKnowIfIveEntered from './questions/how_do_i_know_if_ive_entered'
/* Promo Q's */
import HowManyLOT from './questions/promo/how_many_lot'
import HowCanISeeLOT from './questions/promo/how_can_i_see_lot'
import WhatIsLOTPromo from './questions/promo/what_is_lot_promo'
import HowDoIClaimLOT from './questions/promo/how_do_i_claim_lot'
import ClaimPrevious from './questions/promo/can_i_claim_previous_weeks'
/* FreeLOT Q's */
import what_is_free from './questions/free_lot/what_is_free'
import how_do_i_get_freelot from './questions/free_lot/how_do_i_get_freelot'
import how_do_i_use_freelot from './questions/free_lot/how_do_i_use_freelot'

export default props => {
  /* LOT FAQ */
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
  /* Promo FAQ */
  let acc2 = [
    {title: 'What is the LOT Promotion?',
    component: WhatIsLOTPromo},
    {title: 'How many free LOT can I get?',
    component: HowManyLOT},
    {title: 'How do I claim my free LOT tokens?',
    component: HowDoIClaimLOT},
    {title: 'Can I claim from previous weeks?',
    component: ClaimPrevious},
    {title: 'How can I see my LOT tokens in my wallet?',
    component: HowCanISeeLOT}
  ]
  /* Main FAQ */
  let acc3 = [
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
  /* FreeLOT FAQ */
  let acc4 = [
    {title: 'What is FreeLOT?',
    component: what_is_free},
    {title: 'How do I get FreeLOT?',
    component: how_do_i_get_freelot},
    {title: 'How do I use my FreeLOT',
    component: how_do_i_use_freelot}
  ]

  return (
    <div className={`contentWrapper si${props.screenIndex}`}>
      <div className={`content ssi${props.subScreenIndex}`}>
        <h3 className={'centred screen' + props.screenIndex}>Frequently Asked Questions</h3>
        <br/>
        <LOT className='faqLogo' fill={props.screenIndex} />
        <p>Etheraffle Questions:</p>
        <Accordion arr={acc1} screenIndex={props.screenIndex} />
        <br/>
        <LOT className='faqLogo' fill='6' />
        <p>LOT Promotion Questions:</p>
        <Accordion arr={acc2} screenIndex={props.screenIndex} />
        <br/>
        <FreeLOT className='faqLogo' fill={props.screenIndex} />
        <p>FreeLOT Coupon Questions:</p>
        <Accordion arr={acc4} screenIndex={props.screenIndex} />
        <br/>
        <img className='faqLogo' src={eLogo} alt='e Logo' />
        <p>Raffle Questions:</p>
        <Accordion arr={acc3} screenIndex={props.screenIndex} />
      </div>
    </div>
  )
}
