import React from 'react'

export default props => (
  <p className="justify">
    The Etheraffle <span className={`styledSpan screen${props.screenIndex}`}>FreeLOT coupon</span> is a token you can win by playing Etheraffle. You can then use this coupon to play Etheraffle <i>again</i> for <span className={`styledSpan screen${props.screenIndex}`}>free</span>! There are no limits on the number of FreeLOT coupons you can win and own, and there are no time limits on redeeming them. They last as long as you keep them! 
  </p>
)