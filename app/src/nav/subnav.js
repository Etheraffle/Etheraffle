import React from 'react'
import FAQ from '../pages/faq/faq'
import Results from '../pages/results/results'
import Instantraffle from '../pages/instantraffle/instantraffle'
import Saturdayraffle from '../pages/saturdayraffle/saturdayraffle'
import Wednesdayraffle from '../pages/wednesdayraffle/wednesdayraffle'

export default class Subnav extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      mounted: false,
      subScreenIndex: this.props.subScreenIndex
    }
  }

  componentWillMount(){
    this.setState({mounted: true})
  }

  handleClick(index){
    if(this.state.mounted === true) this.setState({subScreenIndex: index})
  }

  componentWillUnmount(){
    if(this.state.mounted === true) this.setState({mounted: false})
  }

  render(){
    return(
      <div className="screen">
        <div className="subNav">

          <div
            className ={this.state.subScreenIndex === 1 ? "subNav-item results active-subNav" : "subNav-item results"}
            onClick={(index) => this.handleClick(1)}
            style={this.state.subScreenIndex === 1 ? {color: 'rgba(62,214,126,1)'} : {color: 'lightgrey'}}>
              <h3 className="subScreen1">Results</h3>
          </div>

          <div className ="subNav-item spacerOne"></div>

          <div
            className ={this.state.subScreenIndex === 2 ? "subNav-item play active-subNav" : "subNav-item play"}
            onClick={(index) => this.handleClick(2)}
            style={this.state.subScreenIndex === 2 ? {color: 'rgba(236,60,226,1)'} : {color: 'lightgrey'}}>
            <h3 className="subScreen2">Play!</h3>
          </div>

          <div className ="subNav-item spacerTwo"></div>

          <div
            className ={this.state.subScreenIndex === 3 ? "subNav-item help active-subNav" : "subNav-item help"}
            onClick={(index) => this.handleClick(3)}
            style={this.state.subScreenIndex === 3 ? {color: 'rgba(51,211,224,1)'} : {color: 'lightgrey'}}>
            <h3 className="subScreen3">FAQ</h3>
          </div>
        </div>

        <div className="subcontent">
          {(this.state.subScreenIndex === 1) &&
            <Results
              screenIndex={this.props.screenIndex}
              subScreenIndex={this.state.subScreenIndex} />
          }

          {((this.state.subScreenIndex === 2) && (this.props.screenIndex === 1)) &&
            <Instantraffle
              screenIndex={this.props.screenIndex}
              subScreenIndex={this.state.subScreenIndex} />
          }

          {((this.state.subScreenIndex === 2) && (this.props.screenIndex === 3)) &&
            <Wednesdayraffle
              screenIndex={this.props.screenIndex}
              subScreenIndex={this.state.subScreenIndex} />
          }

          {((this.state.subScreenIndex === 2) && (this.props.screenIndex === 5)) &&
            <Saturdayraffle
              screenIndex={this.props.screenIndex}
              subScreenIndex={this.state.subScreenIndex} />
          }

          {(this.state.subScreenIndex === 3) &&
            <FAQ
              screenIndex={this.props.screenIndex}
              subScreenIndex={this.state.subScreenIndex} />
          }
        </div>
      </div>
    )
  }
}
