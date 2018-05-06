import React from 'react'
import moment from 'moment'
import Modal from 'react-modal'
import ReactTooltip from 'react-tooltip'
import utils from '../../components/utils'
import getGas from '../../web3/get_gas_prices'
import claimPrize from '../../web3/claim_prize'
import ClipboardButton from 'react-clipboard.js'
import { Pending, Success, Error } from './tx_modal_components'

export default class BigTables extends React.Component {

	constructor(props) {
		super(props)
    this.state = {
      txErr: null,
      tableArr: [],
      safeLow: null,
      freeGo: false,
      txHash: 'pending',
      modalIsOpen: false
    }
    this.toDollars       = this.toDollars.bind(this)
    this.getLowGas       = this.getLowGas.bind(this)
    this.openModal       = this.openModal.bind(this)
    this.closeModal      = this.closeModal.bind(this)
    this.parseResults    = this.parseResults.bind(this)
    this.getTableRows    = this.getTableRows.bind(this)
    this.getTableHeads   = this.getTableHeads.bind(this)
    this.sendTransaction = this.sendTransaction.bind(this)
  }

  componentDidMount() {
    this.parseResults(this.props.data)
    this.getLowGas()
  }
  
  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  getLowGas() {
    return getGas().then(({ low }) => {
      this.setState({safeLow: `${low} Gwei`})
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
    claimPrize(this.props.eth.web3, 'Saturday', this.props.eth.ethAdd, _raffleID, _entryNum).then(txHash => { 
      this.setState({txHash: txHash})
    }).catch(err => {
      console.log(`Error sending ethereum transaction: ${err}`)
      this.setState({txHash: null, freeGo: false}) // Will pop up the error modal
    })
  }

  closeModal() {
    this.setState({modalIsOpen: false, txHash: 'pending', freeGo: false}) // Reset the txHash
  }

  parseResults(_data) {
    let tableArr = this.state.tableArr
      , arr      = _data.raffleIDs.reverse()
    for (let i = 0; i < arr.length; i++) {
      const table = []
          , tHead = this.getTableHeads(arr[i], _data.results[arr[i]])
          , tRows = this.getTableRows(_data.results[arr[i]], arr[i], _data.entries[arr[i]])
      table.push(
        <div key={i} className='tableDiv'>
          <table className={`tableFill screen${this.props.screenIndex}`}>
              {tHead}
            <tbody className={`tableHover screen${this.props.screenIndex}`}>{tRows}</tbody>
          </table>
        </div>
        )
      tableArr.push(table)
    }
    this.setState({tableArr: tableArr})
  }

  getTableHeads(raffleID, resultsArr) {
    let tableHead = []
      , timeStamp = moment().day('Saturday').format('dddd MMMM Do YYYY') // Returns next occurring saturday
    if (resultsArr.timeStamp === null) { // Results not drawn yet...
      tableHead.push(
        <thead key={raffleID + 1}>
          <tr key={raffleID + 2}>
            <th data-tip={`Draw due on ${timeStamp}`} className={`textCenter screen${this.props.screenIndex}`} colSpan={'5'}>
              Raffle Number:&ensp;{raffleID}<br/>Draw due on {timeStamp}
            </th>
          </tr>
          <tr key={raffleID + 3}>
            <th data-tip='This is your personal entry<br>number for raffle.' className={`column-entryNum textCenter screen${this.props.screenIndex}`}>Entry</th>
            <th data-tip='These are your chosen<br>numbers for this raffle.' className={`column-chosenNums textCenter screen${this.props.screenIndex}`}>Chosen Numbers</th>
            <th data-tip='When the results are drawn<br>your number of matches will appear<br>here. Two or more means you win a prize!' className={`column-matches textCenter screen${this.props.screenIndex}`}>Matches</th>
            <th data-tip='When the results are drawn,<br>the amount of ether your raffle<br> ticket won will appear here.' className={`column-prize textCenter screen${this.props.screenIndex}`}>Prize</th>
            <th data-tip='If you win ether, a<br>button will appear in this<br>column so you can claim it!' className={`column-claim textCenter screen${this.props.screenIndex}`}>Withdraw</th>
          </tr>
        </thead>
      )
    } else { // Results are in...
      let wN = resultsArr.winningNumbers.map(x => { return x < 10 ? `0${x}` : x })
      timeStamp = moment.unix(resultsArr.timeStamp).format('Do MMM YYYY [at] h:mm a')
      tableHead.push(
        <thead key={raffleID + 1}>
          <tr key={raffleID + 2}>
            <th data-tip={`Drawn on ${timeStamp}`} className={`textCenter screen${this.props.screenIndex}`} colSpan={'5'}>
              Raffle Number:&ensp;{raffleID}<br/>Winning Numbers:&ensp;{wN[0]}&ensp;{wN[1]}&ensp;{wN[2]}&ensp;{wN[3]}&ensp;{wN[4]}&ensp;{wN[5]}</th>
          </tr>
          <tr key={raffleID + 3}>
            <th data-tip='This is how many times you<br>have entered into this raffle.' 
              className={`column-entryNum textCenter screen${this.props.screenIndex}`}>Entry</th>
            <th data-tip='These are your chosen<br>numbers for this raffle ticket.' 
              className={`column-chosenNums textCenter screen${this.props.screenIndex}`}>Chosen Numbers</th>
            <th data-tip='This is how many<br>numbers you have matched.<br>Two or more means you win a prize!' 
              className={`column-matches textCenter screen${this.props.screenIndex}`}>Matches</th>
            <th data-tip='This is the prize<br>you won with this ticket.' 
              className={`column-prize textCenter screen${this.props.screenIndex}`}>Prize</th>
            <th data-tip='If you won a prize<br>you can claim it here.' 
              className={`column-claim textCenter screen${this.props.screenIndex}`}>Withdraw</th>
          </tr>
        </thead>
      )
    }
    return tableHead
  }

  getTableResArr(resultsArr, raffleID, entriesArr) {
    const tableResultsArr =[]
    for (let i = 0; i < entriesArr.length; i++) { // Loop over entries array building an object at each iteration...
      let matches  = resultsArr.timeStamp === null ? 'Pending' : utils.getMatches(entriesArr[i].slice(0,6), resultsArr.winningNumbers)
        , entryNum = entriesArr[i][7]
        , obj = {
          matches: matches,
          entryNum: entryNum,
          entryNumArr: entriesArr[i],
          chosenNumbers: entriesArr[i].slice(0,6).map(x => { return x < 10 ? `0${x}` : x }), 
          prize: resultsArr.timeStamp === null 
            ? 'Pending'
            : matches === 2 && raffleID > 37
            ? 'a free go!'
            : `${utils.toDecimals(this.props.eth.web3.fromWei(resultsArr.winningAmounts[matches],'ether'), 3)} ETH!`,
          withdrawn: matches < 2 ? null : entriesArr[i].length > 8 ? true : false, 
          txHash: matches < 2 ? null : entriesArr[i].length > 8 ? entriesArr[i][8] : 'Not yet claimed...', 
          txHashTimeStamp: matches < 2 ? null : entriesArr[i].length > 8 ? entriesArr[i][9] : ''
        }
      tableResultsArr[entryNum - 1] = obj
    }
    return tableResultsArr
  }

  getTableRows(resultsArr, raffleID, entriesArr) {
    const tableResultsArr = this.getTableResArr(resultsArr, raffleID, entriesArr)
        , tRows = []
    for (let i = 0; i < tableResultsArr.length; i++) {
      let nums = tableResultsArr[i].chosenNumbers.reduce((acc, e) => `${acc}  ${e}`)
      if (tableResultsArr[i].matches >= 2 && !tableResultsArr[i].withdrawn && raffleID > 37) { // Claim prize button...
        tRows.push(
          <tr key={tableResultsArr[i].entryNum + raffleID}>
            <td className={`textCenter screen${this.props.screenIndex}`}><b>{tableResultsArr[i].entryNum}</b></td>
            <td className={`column-chosenNums textCenter screen${this.props.screenIndex}`}><b>{nums}</b></td>
            <td className={`textCenter screen${this.props.screenIndex}`}><b>{tableResultsArr[i].matches}</b></td>
            <td data-tip={`Wohoo - you won ${tableResultsArr[i].prize}`} className={`textCenter screen${this.props.screenIndex}`}><b>{utils.capitalize(tableResultsArr[i].prize)}</b></td>
            <td className={`textCenter screen${this.props.screenIndex}`}>
              <button
                data-raffleid={raffleID}
                onClick={(e) => {this.openModal(e)}}
                data-matches={tableResultsArr[i].matches}
                data-entrynum={tableResultsArr[i].entryNum}
                data-entrynumarr={tableResultsArr[i].entryNumArr} 
                className={`claimButton screen${this.props.screenIndex}`}
                data-tip={`Congratulations, you've won a prize!<br>Click this button to claim it!`} >Claim Prize!</button>
            </td>
          </tr>
        )
      }
      if (tableResultsArr[i].matches >= 2 && tableResultsArr[i].withdrawn) {// prize claimed with tooltip deets...
        tRows.push(
          <tr key={tableResultsArr[i].entryNum + raffleID}>
            <td className={`textCenter screen${this.props.screenIndex}`}>{tableResultsArr[i].entryNum}</td>
            <td className={`column-chosenNums textCenter screen${this.props.screenIndex}`}>{nums}</td>
            <td className={`textCenter screen${this.props.screenIndex}`}>{tableResultsArr[i].matches}</td>
            <td data-tip={`Wohoo - you won ${tableResultsArr[i].prize}`} className={`textCenter screen${this.props.screenIndex}`}><b>{utils.capitalize(tableResultsArr[i].prize)}</b></td>
            <td
              data-tip={`You claimed on:<br>${moment.unix(tableResultsArr[i].txHashTimeStamp).format('Do MMM YYYY [at] h:mm a')}<br>Your transaction hash:<br> ${tableResultsArr[i].txHash}<br> Click on 'Claimed' to copy these details to the clipboard.`}
              className={`textCenter screen${this.props.screenIndex}`}>
            <ClipboardButton
              className={`clipBoardButtonClaimPrize screen${this.props.screenIndex}`}
              data-clipboard-text={`My ethereum address is: ${this.props.eth.ethAdd}, and I claimed the prize on: ${moment.unix(tableResultsArr[i].txHashTimeStamp).format('Do MMM YYYY [at] h:mm a')}. The transaction hash was: ${tableResultsArr[i].txHash}`}>
              Claimed!
            </ClipboardButton>
            </td>
          </tr>
        )
      }
      if (tableResultsArr[i].matches === 'Pending') { // Results not drawn yet...
        tRows.push(
          <tr key={tableResultsArr[i].entryNum + raffleID}>
            <td className={`textCenter screen${this.props.screenIndex}`}>{tableResultsArr[i].entryNum}</td>
            <td className={`column-chosenNums textCenter screen${this.props.screenIndex}`}>{nums}</td>
            <td className={`textCenter screen${this.props.screenIndex}`}>n/a</td>
            <td className={`textCenter screen${this.props.screenIndex}`}>Pending</td>
            <td className={`textCenter screen${this.props.screenIndex}`}>n/a</td>
          </tr>
        )
      }
      if ((tableResultsArr[i].matches >= 2 && !tableResultsArr[i].withdrawn && raffleID <= 37) || // Old, non-winning 2 match wins...
          tableResultsArr[i].matches < 2) { // Raffle drawn but unwinning ticket...
        tRows.push(
          <tr key={tableResultsArr[i].entryNum + raffleID}>
            <td className={`textCenter screen${this.props.screenIndex}`}>{tableResultsArr[i].entryNum}</td>
            <td className={`textCenter screen${this.props.screenIndex}`}>{nums}</td>
            <td className={`textCenter screen${this.props.screenIndex}`}>{tableResultsArr[i].matches}</td>
            <td className={`textCenter screen${this.props.screenIndex}`}>0 ETH</td>
            <td className={`textCenter screen${this.props.screenIndex}`}>No Prize</td>
          </tr>
        )
      }
    }
    return tRows
  }

  toDollars(_amount) {
    if (this.props.eth.exRate !== null && this.props.eth.exRate > 0) {
      let num = utils.toDecimals((this.props.eth.web3.fromWei(_amount, 'ether') * this.props.eth.exRate), 2)
      return `<br>Approximately $${num}!`
    }
    else return ''
  }

	render() {
		return (
      <div className='resultsPage' >
        <p className='centred'>Your ethereum address:<br/><span className={`styledSpan screen${this.props.screenIndex}`}>{`${this.props.eth.ethAdd.substring(0,20)} . . .`}</span></p>
        { 
          this.state.tableArr.length === 1 
          ? <p className='centred'>Here is the latest raffle result for your address:</p>
          : <p className="centred">Here are the latest <span className={`styledSpan largerFont screen${this.props.screenIndex}`}>{this.state.tableArr.length}</span> raffle results for your address:</p>
        }
        <ReactTooltip className={`customTheme screen${this.props.screenIndex}`} effect='solid' multiline={true} />
        <div className='resultsTable'>
          {this.state.tableArr}
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          shouldCloseOnOverlayClick={true}
          contentLabel='Claim Prize Modal'
          overlayClassName={`Overlay screen${this.props.screenIndex}`}
          className={`claimPrizeModal screen${this.props.screenIndex}`}>
            {
              this.state.txHash === 'pending'
              ? <Pending screenIndex={this.props.screenIndex} safeLow={this.state.safeLow} freeGo={this.state.freeGo} />
              : this.state.txHash
              ? <Success screenIndex={this.props.screenIndex} txHash={this.state.txHash} freeGo={this.state.freeGo} />
              : <Error   screenIndex={this.props.screenIndex} txErr={this.state.txErr} />
            }
        </Modal>
      </div>
		)
	}
}
