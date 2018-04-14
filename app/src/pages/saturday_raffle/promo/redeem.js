import React from 'react'
import moment from 'moment'
import dates from './ico_dates'
import Button from './redeem_button'

export default props => {
  if (moment().weekday() === 6) {// Show button on Saturdays only!(6)
    if (props.entries === 0) 
      return  <p className='justify last'>
        You haven't entered this week's raffle yet! You're missing out on <span className={'styledSpan screen' + props.screenIndex}>{dates.rate * props.tktPrice}</span> free <span className={'styledSpan screen' + props.screenIndex}>LOT</span> per entry!
      </p>
    if (props.entries === 1) 
      return <div>
        <Button screenIndex={props.screenIndex} entries={props.entries} eth={props.eth} />
        <p className='justify last'>
        You've entered this week's raffle <span className={'styledSpan  screen' + props.screenIndex}>once!</span> Click the button above to redeem the <span className={'styledSpan largerFont screen' + props.screenIndex}>{props.reward}</span> free <span className={'styledSpan screen' + props.screenIndex}>LOT</span> tokens you've earnt, or enter the raffle again to earn even more!
        </p>
      </div>
    if (props.entries === 2) 
      return <div>
        <Button screenIndex={props.screenIndex} entries={props.entries} eth={props.eth} />
        <p className='justify last'>
        You've entered this week's raffle <span className={'styledSpan  screen' + props.screenIndex}>twice!</span> Click the button above to redeem the <span className={'styledSpan largerFont screen' + props.screenIndex}>{props.reward}</span> free <span className={'styledSpan screen' + props.screenIndex}>LOT</span> tokens you've earnt, or enter the raffle again to earn even more!
        </p>
      </div>
    if (props.entries > 2)   
      return <div>
        <Button screenIndex={props.screenIndex} entries={props.entries} eth={props.eth} />
        <p className='justify last'>
        You've entered this week's raffle <span className={'styledSpan largerFont screen' + props.screenIndex}>{props.entries}</span> times! Click the button above to redeem the <span className={'styledSpan largerFont screen' + props.screenIndex}>{props.reward}</span> free <span className={'styledSpan screen' + props.screenIndex}>LOT</span> tokens you've earnt, or enter the raffle again to earn even more!
        </p>
      </div>
  } else {// Not showing redeem button
    if (props.entries === 0) 
      return <p className='justify last'>
        You haven't entered this week's raffle yet!
        <br/>
        Get entering so you can earn <span className={'styledSpan screen' + props.screenIndex}>{dates.rate * props.tktPrice}</span> free <span className={'styledSpan screen' + props.screenIndex}>LOT</span> tokens per entry!
      </p>
    if (props.entries === 1) 
      return <p className='justify last'>
        <span className={'styledSpan screen' + props.screenIndex}>Congratulations!</span> You've entered this week's raffle once and earnt {props.reward} free LOT tokens so far! Enter again to earn even more tokens, then come back on Saturday to redeem them!
      </p>
    if (props.entries === 2) 
      return <p className='justify last'>
        <span className={'styledSpan screen' + props.screenIndex}>Congratulations!</span> You've entered this week's raffle twice and earnt {props.reward} free LOT tokens so far! Enter again to earn even more tokens, then come back on Saturday to redeem them!
      </p>
    if (props.entries > 2)   
      return <p className='justify last'>
        <span className={'styledSpan screen' + props.screenIndex}>Congratulations!</span> You've entered this week's raffle {props.entries} times and earnt {props.reward} free LOT tokens so far! Enter again to earn even more tokens, then come back on Saturday to redeem them!
      </p>
  }
  return <div />
}
