import React from 'react'

export default (props) => {
	let colours = ['','#28e973','#9689aa','#ec3ce0','#9e7be2','#25dfdf']
	return(
        <svg className={'eButton screen' + props.screenIndex}version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" 
            height={props.height ? props.height : "2em"} viewBox="0 0 270 270" enableBackground="new 0 0 270 270">
        <g id="bg">
            <g>
                
                <image overflow="visible" opacity="0.75" width="266" height="266" xlink:href="A605A4B.png"  transform="matrix(1 0 0 1 6.8408 6.9316)">
                </image>
                <g>
                    <circle fill={props.fill ? props.fill : "#28E973"} cx="135" cy="135" r="117.613"/>
                </g>
            </g>
        </g>
        <g id="e">
            <g>
                
                <image overflow="visible" opacity="0.75" width="188" height="188" transform="matrix(1 0 0 1 44.8408 44.9316)">
                </image>
                <g>
                    <g>
                        <path fill="#FFFFFF" d="M91.841,177.932h55v-15h-32v-8h32v-32h-55V177.932z M114.841,130.932h8v8h-8V130.932z"/>
                        <polygon fill="#FFFFFF" points="154.841,114.932 154.841,107.932 161.841,107.932 161.841,99.932 169.841,99.932 
                            169.841,91.932 114.841,91.932 114.841,99.932 106.841,99.932 106.841,107.932 98.841,107.932 98.841,114.932"/>
                        <polygon fill="#FFFFFF" points="161.841,107.932 161.841,114.932 154.841,114.932 154.841,146.932 161.841,146.932 
                            161.841,138.932 169.841,138.932 169.841,130.932 177.841,130.932 177.841,99.932 169.841,99.932 169.841,107.932 				"/>
                        <path fill="#FFFFFF" d="M135,53.75c-44.874,0-81.25,36.376-81.25,81.25c0,44.873,36.376,81.25,81.25,81.25
                            s81.25-36.377,81.25-81.25C216.25,90.126,179.874,53.75,135,53.75z M185.841,154.932h-8v8h-8v8h-8v7h-7v8h-71v-71h8v-7h7v-8h8
                            v-8h8v-8h71V154.932z"/>
                        <polygon fill="#FFFFFF" points="169.841,138.932 169.841,146.932 161.841,146.932 161.841,154.932 154.841,154.932 
                            154.841,170.932 161.841,170.932 161.841,162.932 169.841,162.932 169.841,154.932 177.841,154.932 177.841,138.932"/>
                    </g>
                </g>
            </g>
        </g>
    </svg>
    )
}
