import React from 'react'
import claim from './images/claim.jpg'
import claimed from './images/claimed.jpg'

export default () => (
  <React.Fragment>
    <p className="justify">
      Any winning tickets associated with your ethereum address will be easily spotted byt the "Claim Prize" button which appears in the results tab. If a ticket you've bought matches two or more numbers to the winning numbers drawn at the end of the raffle, congratulations, you've won a prize! To claim, simply click that "Claim Prize" button that appears alongside your winning ticket:
    </p>
    <img className='image border centred' src={claim} alt='The Claim Prize button'/>
    <p className="justify">
      This will pop-up your ethereum browser's transaction window, which will be pre-filled in with the correct details. All blockchain transactions require a fee paid in the form of gas. After your transaction is submitted and mined, Etheraffle's smart-contract will pay your winnings directly to your ethereum address. The "Claim Prize" button will have turned into "Prize Claimed", and a tooltip will appear over it with the details of your prize claim:
    </p>
    <img className='image border centred' src={claimed} alt='The Prize Claimed button'/>
  </React.Fragment>
)
