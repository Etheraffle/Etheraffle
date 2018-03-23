import React from 'react'
import FAQ from '../pages/faq/faq'
import Results from '../pages/results/results'

export default class Subnav extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      mounted: false,
      subScreenIndex: this.props.subScreenIndex
    }
  }

  componentWillMount() {
    this.setState({mounted: true})
  }

  handleClick(index) {
    if (this.state.mounted) this.setState({subScreenIndex: index})
  }

  componentWillUnmount()  {
    if (this.state.mounted) this.setState({mounted: false})
  }

  render() {
    return(
      <div className="screen">
        <div className="subNav">

          <div
            className ={this.state.subScreenIndex === 1 ? "subNav-item results active-subNav" : "subNav-item results"}
            onClick={(index) => this.handleClick(1)}>
            <h3 className="subScreen1">Results</h3>
          </div>

          <div className ="subNav-item spacerOne"></div>

          <div
            className ={this.state.subScreenIndex === 2 ? "subNav-item play active-subNav" : "subNav-item play"}
            onClick={(index) => this.handleClick(2)}>
            <h3 className="subScreen2">Play!</h3>
          </div>

          <div className ="subNav-item spacerTwo"></div>

          <div
            className ={this.state.subScreenIndex === 3 ? "subNav-item help active-subNav" : "subNav-item help"}
            onClick={(index) => this.handleClick(3)}>
            <h3 className="subScreen3">FAQ</h3>
          </div>
        </div>

        <div className="subcontent">
          {this.state.subScreenIndex === 1 &&
            <Results
              screenIndex={this.props.screenIndex}
              subScreenIndex={this.state.subScreenIndex} />
          }

          {this.state.subScreenIndex === 2 &&
            <div>
              {this.props.children}
            </div>
          }

          {this.state.subScreenIndex === 3 &&
            <FAQ
              screenIndex={this.props.screenIndex}
              subScreenIndex={this.state.subScreenIndex} />
          }
        </div>
      </div>
    )
  }
}
