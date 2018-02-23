import React from 'react'
import rafflestruct from '../../../images/code/rafflestruct.jpg'
import getweek from '../../../images/code/getweek.jpg'
import entryparams from '../../../images/code/enterparams.jpg'
import entryreqs from '../../../images/code/entryreqs.jpg'
import entrantmap from '../../../images/code/entrantmap.jpg'
import enterfunc from '../../../images/code/enterfunction.jpg'

export default class ERMechanics extends React.Component{
  render(){
    return(
      <div>
        <h2 className={'screen' + this.props.screenIndex}>
          How Etheraffle Works
        </h2>

        <p className='justify'>
          &emsp;&emsp;Each weekly raffle is tracked via it's raffleID, a bytes32 keccak256 hash of the week number as defined as the number of weeks from the UNIX date 1500249600 - Etheraffle's birthday. The week number rolls over after the number of seconds have elapsed that denote the gap between the week in question's Monday 00:00 hour, and the time the raffle closes for entry, Saturday 19:30 UTC, per the following function.
        </p>

        <div className='image centred'>
          <img className='imageBorder' style={{'margin':'12px'}} src={getweek} alt='The getWeek function'/>
        </div>

        <p className='justify'>
          &emsp;&emsp;A simple mapping maps user's ethereum addresses to an array of the raffleID's of all the raffles they have entered.
        </p>

        <div className='image centred'>
          <img className='imageBorder' style={{'margin':'12px'}} src={entrantmap} alt='The entrant map'/>
        </div>

        <p className='justify'>
          &emsp;&emsp;The more complex raffle mapping maps a raffleID to a struct housing the details pertaining to that particular raffle. User entries are stored in a mapping of the user's ethererum address mapped to an array of arrays of their entry numbers. Two further arrays await the winning numbers and the prize amounts in wei alloted to three, four, five and six match winners, and which are populated after the raffle is closed, when the oraclize calls are returned. A timestamp is set on each structs creation, marking the UNIX time of the 00:00  hour of that raffle's Monday. The number of entries is tracked via a variable, and boolean governs whether or not winnings may be withdraw from this particular raffle. The unclaimed prize pool variable tracks the amount in wei that is subtracted from the contract's global prize pool at the raffle's completion, which value is calculated by the total of the total of each of the three, four, five and six match winners multipled by the winning amount in each tier. This sequestering of the individual raffle's prize pool allows the main prize pool to automatically roll over any amount not won into the next draw.
        </p>

        <div className='image centred'>
          <img className='imageBorder' style={{'margin':'12px'}} src={rafflestruct} alt='The raffle struct'/>
        </div>

        <p className='justify'>
          &emsp;&emsp;The enter raffle function takes seven parameters, the first six being the users chosen raffle numbers and the latter being the affiliate ID, used to track entries coming from affiliaties via the dispersal contract in order to properlly allocate shares of profit. The function can only be run if the global boolean functionsPaused is false.
        </p>

        <div className='image centred'>
          <img className='imageBorder' style={{'margin':'12px'}} src={entryparams} alt='Entry paratmeters'/>
        </div>

        <p className='justify'>
          &emsp;&emsp;A series a requirements made by the enter raffle function force the user's selected numbers to be bound between 1 and 49, and with no repeats. The method used, the most gaseously efficient, requires that entry numbers be submitted in order from lowest to highest. The Etheraffle ÐApp masks this requirement, alloweing users to select numbers in any order they wish, before sorting their entry numbers before submitting to the smart-contract. Since Etheraffle is a combination style lottery as oppposed to Smart Billions more difficult to win permutation based lottery, the order does not affect the odds of winning in anyway. The ÐApp however recognises the importance of number order, psychologically, to the user and so obfuscates the ordering requirement.
        </p>

        <div className='image centred'>
          <img className='imageBorder' style={{'margin':'12px'}} src={entryreqs} alt='Entry requirements'/>
        </div>

        <p className='justify'>
          &emsp;&emsp; Further requirements enforce the ticket price (with no upper-bound), and ensures the current raffleID in question's struct has a timestamp set, and then checks the difference between said timestamp and the time of the user's entry does not exceed the end of the raffle as outlined above, thus barring entries to a raffle that is already over. The function body stores the users selected numbers into the entries map in the raffle struct, increments the number of entires and adds the value of the transaction to the prize pool. Finally an event log is fired capturing the above details.
        </p>

        <div className='image centred'>
          <img className='imageBorder' style={{'margin':'12px'}} src={enterfunc} alt='Entry function'/>
        </div>

      </div>
    )
  }
}
