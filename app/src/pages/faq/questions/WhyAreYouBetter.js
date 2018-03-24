import React from 'react'
import compTable from './images/compTable.png'

export default (props) => {
    return(
        <div>
            <p className='justify'>
                None of <span className={'styledSpan screen' + props.screenIndex}>Etheraffle's</span> competitors come even close to <span className={'styledSpan screen' + props.screenIndex}>Etheraffle</span> in nearly all of the aspects that matter when it comes to blockchain technology. The table below highlights the many facets in which <span className={'styledSpan screen' + props.screenIndex}>Etheraffle</span> comes out on top:
            </p>

            <img className='image centred' src={compTable} alt='Comparison table' />

            <p className='justify'>
                By focusing on true, 100% decentralization, Etheraffle has <span className={'styledSpan screen' + props.screenIndex}>none</span> of the primary dangers that players of all other blockchain lotteries face - such as the owners running away with the ether. By mitigating these risks and becoming fully <span className={'styledSpan screen' + props.screenIndex}>trustless</span> and <span className={'styledSpan screen' + props.screenIndex}>ownerless</span> means that Etheraffle can continue to grow provide <span className={'styledSpan screen' + props.screenIndex}>huge prizes</span> to players, <span className={'styledSpan screen' + props.screenIndex}>sustainable rewards</span> to LOT holders, and <span className={'styledSpan screen' + props.screenIndex}>life-changing funding</span> to charities.
            </p>
        </div>
    )
}