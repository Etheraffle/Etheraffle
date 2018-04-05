import React from 'react'
import '../../node_modules/react-accessible-accordion/dist/react-accessible-accordion.css'
import { Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion'

export default props => {
    let acc = [] 
    props.arr.map((item, i) => {
        let Comp = item.component
        return acc.push(
            <AccordionItem key={i}>
                <AccordionItemTitle>
                    <p className={'screen' + props.screenIndex}>
                        <span className={'styledSpan screen' + props.screenIndex}><b>&#x274d;&ensp;</b></span>
                        {item.title}
                    </p>
                </AccordionItemTitle>
                <AccordionItemBody>
                    <Comp screenIndex={props.screenIndex} key={i} />
                </AccordionItemBody>
            </AccordionItem>
        )
    })

    return(
        <Accordion>
            {acc}
        </Accordion>
    )
}