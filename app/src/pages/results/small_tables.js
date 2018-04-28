import React from 'react'
import moment from 'moment'
import Modal from 'react-modal'
import utils from '../../components/utils'
import lowGas from '../../web3/get_low_gas'
import claimPrize from '../../web3/claim_prize'
// import LoadingIcon from '../../images/loading_icon_grey.svg'
// import { ScreenContext } from '../../contexts/screen_context'
import { Pending, Success, Error } from './tx_modal_components'



export default class SmallTables extends React.Component {

  constructor(props) {
		super(props)
    this.state = {
      txErr: null,
      tableArr: [],
      freeGo: false,
      safeLow: null,
      txHash: 'pending',
			modalIsOpen: false
    }
    this.raffleWin        = this.raffleWin.bind(this)
    this.getLowGas        = this.getLowGas.bind(this)
    this.openModal        = this.openModal.bind(this)
    this.closeModal       = this.closeModal.bind(this)
    this.raffleNoWin      = this.raffleNoWin.bind(this)
    this.parseResults     = this.parseResults.bind(this)
    this.parseEntries     = this.parseEntries.bind(this)
    this.raffleNotDrawn   = this.raffleNotDrawn.bind(this)
    this.sendTransaction  = this.sendTransaction.bind(this)
    this.raffleWinClaimed = this.raffleWinClaimed.bind(this)
  }

  componentDidMount() {
    this.parseResults(this.props.data)
    this.getLowGas()
  }
  
  getLowGas() {
    return lowGas()
    .then(safeLow => {
      this.setState({safeLow: `${safeLow} Gwei`})
    }).catch (err => console.log(`Error retrieving safe low gas rate: ${err}`))
  }

  openModal(e) {
    if (this.props.eth.ethAdd) {
      this.sendTransaction(
        e.target.getAttribute('data-raffleid'),
        e.target.getAttribute('data-entrynum'),
        e.target.getAttribute('data-entrynumarr')
      )
      this.setState({modalIsOpen: true, freeGo: e.target.getAttribute('data-matches') === '2'})
    } else {
      let txErr ='Error creating ethereum transaction - please check your connection and try again!'
      if (!this.props.eth.ethAdd) 
        txErr = 'Ethereum account address inaccessible - please check your connection and try again!'
      else if (!(this.state.tktPrice > 0)) 
        txErr = 'Cannot retrieve ticket price from the smart contract - please check your connection and try again!'
      else if (this.props.eth.web3.version.network > 1) 
        txErr = 'Test network detected - please connect to the main ethereum network!'
      this.setState({modalIsOpen: true, txHash: null, txErr: txErr})
    }
  }

  sendTransaction(_raffleID, _entryNum, _entryNumArr) {
    return claimPrize(this.props.eth.web3, 'Saturday', this.props.eth.ethAdd, _raffleID, _entryNum).then(txHash => {
      this.setState({txHash: txHash})
    }).catch(err => {
      console.log(`Error sending ethereum transaction: ${err}`)
      this.setState({txHash: null, freeGo: false}) // Will pop up the error modal
    })
  }

  closeModal() {
    this.setState({modalIsOpen: false, txHash: 'pending', freeGo: false}) // Reset the state
  }

  parseResults({ raffleIDs, results, entries }) { // Loop over raffle IDs sending corresponding entry & results arrays for parsing
    let tables = [], rIDs = raffleIDs.reverse()
    rIDs.forEach((e,i) => {tables.push(this.parseEntries(rIDs[i], entries[rIDs[i]], results[rIDs[i]]))})
    this.setState({tableArr: tables})
  }

  parseEntries(_rafID, _entArr, _resObj) {
    let table = []
    /* Loop over each entry building obj needed for table */
    for (let i = 0; i < _entArr.length; i++) {
      let obj = {rafID: _rafID, entArr: _entArr[i]}
      /* If _resObj timeStamp === null then raffle not drawn yet... */
      obj['rafTimeStamp']   = _resObj['timeStamp'] !== null ? _resObj['timeStamp'] : null
      obj['winningNumbers'] = _resObj['timeStamp'] !== null ? _resObj['winningNumbers'] : null
      obj['winningAmounts'] = _resObj['timeStamp'] !== null ? _resObj['winningAmounts'] : null
      obj['chosenNumbers']  = _entArr[i].slice(0,6)
      obj['entryNumber']    = _entArr[i][7]
      obj['claimed']        = _entArr[i].length > 8 ? true : false
      obj['txHash']         = _entArr[i].length > 8 ? _entArr[i][8] : null
      obj['txTimeStamp']    = _entArr[i].length > 8 ? _entArr[i][9] : null
      obj['matches']        = _resObj['timeStamp'] !== null ? utils.getMatches(obj['chosenNumbers'], obj['winningNumbers']) : null
      obj['prize']          = _resObj['timeStamp'] === null 
                                ? null 
                                : obj['matches'] === 2
                                ? 'A Free Go!'
                                : `${utils.toDecimals(window.web3.fromWei(obj['winningAmounts'][obj['matches']],'ether'), 3)} Ether!`
      /* Retrieve table html */
      if (_resObj['timeStamp'] === null) table.push(this.raffleNotDrawn(obj, i)) // Not drawn
      else if (obj['matches'] < 2) table.push(this.raffleNoWin(obj, i)) // Drawn but no win
      else if (!obj['claimed']) table.push(this.raffleWin(obj, i)) // Drawn, won but not claimed
      else table.push(this.raffleWinClaimed(obj, i)) // Won and claimed
      }
    return table
  }

  raffleNotDrawn(_o, i) {
    return (
      <div key={i} className={`resultsTable screen${this.props.screenIndex}`}>
        <table className={`tableFill screen${this.props.screenIndex}`}>
          <thead>
            <tr>
              <th className={`textCenter screen${this.props.screenIndex}`}>
                Raffle Nº {_o['rafID']} &emsp; Entry Nº {_o['entryNumber']}
              </th>
            </tr>
          </thead>
          <tbody className={`tableHover screen${this.props.screenIndex}`}>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`}>
                Draw Due On: <br/>
                {moment().day('Saturday').format('dddd MMMM Do YYYY')}
              </td>
            </tr>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`}>
                Chosen Numbers:<br/>{utils.getNumStr(_o['chosenNumbers'])}
              </td>
            </tr>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`}>
                <b>Good Luck!</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  raffleNoWin(_o, i) {
    return (
      <div key={i} className={`resultsTable screen${this.props.screenIndex}`}>
        <table className={`tableFill screen${this.props.screenIndex}`}>
          <thead>
            <tr>
              <th className={`textCenter screen${this.props.screenIndex}`}>
                Raffle Nº {_o['rafID']} &emsp; Entry Nº {_o['entryNumber']}<br/>
                Winning Numbers: {utils.getNumStr(_o['winningNumbers'])}
              </th>
            </tr>
          </thead>
          <tbody className={`tableHover screen${this.props.screenIndex}`}>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`}>
                Drawn On:<br/>{moment.unix(_o['rafTimeStamp']).format('dddd Do MMMM YYYY')}
              </td>
            </tr>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`}>
                Chosen Numbers:<br/>{utils.getNumStr(_o['chosenNumbers'])}
              </td>
            </tr>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`}>
                Matches: {_o['matches']}
              </td>
            </tr>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`}>
                No Prize &#9785;
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
  
  raffleWin(_o, i) {
    if (_o['rafID'] <= 37) return this.raffleNoWin(_o, i) // 2 match wins from old raffles do not win a prize
    return (
      <div key={i} className={`resultsTable screen${this.props.screenIndex}`}>
        <table className={`tableFill screen${this.props.screenIndex}`}>
          <thead>
            <tr>
              <th className={`textCenter screen${this.props.screenIndex}`}>
                Raffle Nº {_o['rafID']} &emsp; Entry Nº {_o['entryNumber']}<br/>Winning Numbers: {utils.getNumStr(_o['winningNumbers'])}
              </th>
            </tr>
          </thead>
          <tbody className={`tableHover screen${this.props.screenIndex}`}>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`}>
                Drawn On:<br/>{moment.unix(_o['rafTimeStamp']).format('dddd Do MMMM YYYY')}
              </td>
            </tr>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`}>
                Chosen Numbers:<br/>{utils.getNumStr(_o['chosenNumbers'])}
              </td>
            </tr>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`}>
                Matches: {_o['matches']}
              </td>
            </tr>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`} style={{'fontWeight':'bold'}}>
                Prize: {_o['prize']}
              </td>
            </tr>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`}>
                <button
                  data-raffleid={_o['rafID']}
                  data-matches={_o['matches']}
                  data-entrynumarr={_o['entArr']}
                  data-entrynum={_o['entryNumber']}
                  onClick={(e) => {this.openModal(e)}}
                  className={`claimButton screen${this.props.screenIndex}`} >
                  Claim Prize!
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  raffleWinClaimed(_o, i) {
    return (
      <div key={i} className={`resultsTable screen${this.props.screenIndex}`}>
        <table className={`tableFill screen${this.props.screenIndex}`}>
          <thead>
            <tr>
              <th className={`textCenter screen${this.props.screenIndex}`}>
                Raffle Nº {_o['rafID']} &emsp; Entry Nº {_o['entryNumber']}<br/>Winning Numbers: {utils.getNumStr(_o['winningNumbers'])}
              </th>
            </tr>
          </thead>
          <tbody className={`tableHover screen${this.props.screenIndex}`}>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`}>
                Drawn On: <br/>
                {moment.unix(_o['rafTimeStamp']).format('dddd Do MMMM YYYY')}
              </td>
            </tr>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`}>
                Chosen Numbers:<br/>{utils.getNumStr(_o['chosenNumbers'])}
              </td>
            </tr>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`}>
                Matches: {_o['matches']}
              </td>
            </tr>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`} style={{'fontWeight':'bold'}}>
                Prize: {_o['prize']}
              </td>
            </tr>
            <tr>
              <td className={`textCenter screen${this.props.screenIndex}`}>
                Prize claimed on:<br/>
                <b>{moment.unix(_o['txTimeStamp']).format('dddd Do MMMM, YYYY')}</b><br/><br/>
                Transaction Hash:<br/>
                {_o['txHash']
                  ? <a className={`screen${this.props.screenIndex}`} rel='noopener noreferrer' target= '_blank' href={`https://www.etherscan.io/tx/${_o['txHash']}`} ><b>{`${_o['txHash'].substring(0,20)}. . .`}</b></a>
                  : <b>Not captured!</b>
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

	render() {
		return (
			<div className='resultsPage' >
				<p className='centred'>Your ethereum address:<br/><span className={`styledSpan screen${this.props.screenIndex}`}>{`${this.props.eth.ethAdd.substring(0,20)} . . .`}</span></p>
				{ 
          !this.state.tableArr
          ? <p/>
          : this.state.tableArr.length > 1 
          ? <p className="centred">Here are the latest raffle tickets for your address:</p>
          : (this.state.tableArr === 1 && this.state.tableArr[0].length > 1)
          ? <p className='centred'>Here are the latest raffle tickets for your address:</p>
          : <p className='centred'>Here is the latest raffle ticket for your address:</p>
				}
				<div className='resultsTable'>
				  {this.state.tableArr}
				</div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          shouldCloseOnOverlayClick={true}
          contentLabel='Claim Prize Modal'
          overlayClassName={`Overlay screen${this.props.screenIndex}`}
          className={`claimPrizeModal screen${this.props.screenIndex}`} >
            {
              this.state.txHash === 'pending'
              ? <Pending screenIndex={this.props.screenIndex} safeLow={this.state.safeLow} freeGo={this.state.freeGo} />
              : this.state.txHash
              ? <Success screenIndex={this.props.screenIndex} txHash={this.state.txHash} freeGo={this.state.freeGo} />
              : <Error screenIndex={this.props.screenIndex} txErr={this.state.txErr} />
            }
        </Modal>
			</div>
		)
	}
}
