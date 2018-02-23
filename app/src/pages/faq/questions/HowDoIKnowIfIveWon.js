import React from 'react'
import winNums from './images/winnums.jpg'
import winAmounts from './images/winamounts.jpg'

export default () => {
  return(
    <div>
      <p className="justify">
        The results tab at the top of the page displays information about the most recent raffles you've entered. Once a raffle has been drawn, the results page will automatically update with the new information, and the head of the table will display the winning numbers:
      </p>

      <img className='image border centred' src={winNums} alt='Winning numbers at the head of the table'/>

      <p className='justify'>
        The rest of the table will show you your ticket details. From left to right, these columns are your entry number, your six chosen numbers, the number of matches you've made with the winning numbers, and the amount of ether your ticket has won. The final column will show a "Claim Prize" button if you've won!
      </p>

      <img className='image border centred' src={winAmounts} alt='Number of matches in a the results table'/>

    </div>
  )
}
