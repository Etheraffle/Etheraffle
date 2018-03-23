import moment from 'moment'
import React from 'react'
import BelowContent from './belowcontent'
import Saturdayclock from './saturdayclock'
import Loading from '../../components/loadingIcon'
import Saturdayentryform from './saturdayentryform'
import closedButton from '../../images/closedButton.svg'

export default class Saturdayraffle extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      killDiv: 1,
      mounted: false,
      placeHolder: 1
    }
    this.endTime      = 'Saturday 19:00'//Raffle deadline
    this.closedFor    = 5 * 60 * 60//length of time (s) raffle is closed for
    this.getCallBacks = this.getCallBacks.bind(this)
  }

  componentWillMount() {
    this.setState({mounted: true})
  }

  componentWillUnmount() {
    this.setState({mounted: false})
  }

  getCallBacks(_killDiv, _placeHolder) {
    if (this.state.killDiv !== _killDiv) if (this.state.mounted) this.setState({killDiv: _killDiv})
    if (this.state.placeHolder !== _placeHolder) if (this.state.mounted) this.setState({placeHolder: _placeHolder})
  }

  render() {
    return(
      <div className={"contentWrapper si" + this.props.screenIndex}>
        <div className={"content ssi" + this.props.subScreenIndex}>

          <div className="aboveContent">
          </div>

          <div className="centreContent">
            {window.innerWidth <= 400 &&
              <h2 className='centred'>
                Welcome to the <span className={'styledSpan screen' + this.props.screenIndex}>Saturday Raffle!</span>
              </h2>
            }

            <br />

            <Saturdayclock
              callBacks={this.getCallBacks}
              screenIndex={this.props.screenIndex}
              mounted={this.state.mounted}
              endTime={this.endTime}
              closedFor={this.closedFor}/>

              {window.innerWidth > 400 &&
              <h1 className='centred'>
                Welcome to the <span className={'styledSpan screen' + this.props.screenIndex}>Saturday Raffle!</span>
              </h1>
            }


            {(this.state.placeHolder === 1) &&
              <div className={"entryFormLoading screen" + this.props.screenIndex}>

                <Loading />

                <p>
                  Checking connection status...
                </p>

              </div>
            }

            {(this.state.killDiv === 0 &&  this.state.placeHolder === 0) &&
              <Saturdayentryform
                screenIndex={this.props.screenIndex}
                killDiv={this.state.killDiv}/>
            }

            {(this.state.killDiv === 1 && this.state.placeHolder === 0) &&
              <div className='entryFormClosed'>
                <img className={'closedButton screen' + this.props.screenIndex} src={closedButton} alt='Entry closed!' />

                {window.innerWidth < 450 &&
                  <p className='centred'>
                    Next draw opens:
                    <br/>
                    <span className={'styledSpan screen' + this.props.screenIndex}>
                      {moment().day('Sunday').format('dddd, MMMM Do [at] 00:00')}
                    </span>
                  </p>
                }

                {window.innerWidth >= 450 &&
                  <p className='centred'>
                    Next draw opens:
                    <span className={'styledSpan screen' + this.props.screenIndex}>
                      &nbsp;{moment().day('Sunday').format('dddd, MMMM Do [at] 00:00')}&nbsp;
                    </span>
                  </p>
                }

              </div>
            }

          </div>

          <BelowContent screenIndex={this.props.screenIndex} />

        </div>
      </div>
    )
  }
}
