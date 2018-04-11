import React from 'react'
import moment from 'moment'
import Modal from 'react-modal'
import ReactTooltip from 'react-tooltip'
import lowGas from '../../web3/getLowGas'
import utils from '../../components/utils'
import claimPrize from '../../web3/claimPrize'
import ClipboardButton from 'react-clipboard.js'
import LoadingIcon from '../../images/loadingIconGrey.svg'

export default class BigTables extends React.Component {

	constructor(props) {
		super(props)
    this.state = {
      txErr: null,
      tableArr: [],
      safeLow: null,
      txHash: 'pending',
      modalIsOpen: false
    }
    this.toDollars = this.toDollars.bind(this)
    this.getLowGas = this.getLowGas.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.parseResults = this.parseResults.bind(this)
    this.getTableRows = this.getTableRows.bind(this)
    this.getTableHeads = this.getTableHeads.bind(this)
    this.sendTransaction = this.sendTransaction.bind(this)
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
        e.target.getAttribute("data-raffleid"),
        e.target.getAttribute("data-entrynum"),
        e.target.getAttribute("data-entrynumarr")
      )
      this.setState({modalIsOpen: true})
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
    return claimPrize(this.props.eth.web3, this.props.screenIndex, this.props.eth.ethAdd, _raffleID, _entryNum).then(txHash => {
      this.setState({txHash: txHash})
      //return this.updateDetails(txHash, raffleID, entryNum, entryNumArr, window.ethAdd)
    }).catch(err => {
      console.log(`Error sending ethereum transaction: ${err}`)
      this.setState({txHash: null }) // Will pop up the error modal
    })
  }

  closeModal() {
    this.setState({modalIsOpen: false, txHash: 'pending'})// Reset the txHash
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
      , timeStamp = moment().day('Saturday').format('dddd MMMM Do YYYY')//returns next occurring saturday
    if (resultsArr.timeStamp === null) {//results not drawn yet...
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
            <th data-tip='When the results are drawn<br>your number of matches will appear<br>here. Three or more means you win ether!' className={`column-matches textCenter screen${this.props.screenIndex}`}>Matches</th>
            <th data-tip='When the results are drawn,<br>the amount of ether your raffle<br> ticket won will appear here.' className={`column-prize textCenter screen${this.props.screenIndex}`}>Prize</th>
            <th data-tip='If you win ether, a<br>button will appear in this<br>column so you can claim it!' className={`column-claim textCenter screen${this.props.screenIndex}`}>Withdraw</th>
          </tr>
        </thead>
      )
    } else {//results are in...
      let wN = resultsArr.winningNumbers.map(x => { return x < 10 ? `0${x}` : x })
      timeStamp = moment.unix(resultsArr.timeStamp).format('Do MMM YYYY [at] h:mm a')
      tableHead.push(
        <thead key={raffleID + 1}>
          <tr key={raffleID + 2}>
            <th data-tip={`Drawn on ${timeStamp}`} className={`textCenter screen${this.props.screenIndex}`} colSpan={'5'}>
              Raffle Number:&ensp;{raffleID}<br/>Winning Numbers:&ensp;{wN[0]}&ensp;{wN[1]}&ensp;{wN[2]}&ensp;{wN[3]}&ensp;{wN[4]}&ensp;{wN[5]}</th>
          </tr>
          <tr key={raffleID + 3}>
            <th 
              data-tip='This is how many times you<br>have entered into this raffle.' 
              className={`column-entryNum textCenter screen${this.props.screenIndex}`}>
              Entry
            </th>
            <th 
              data-tip='These are your chosen<br>numbers for this raffle ticket.' 
              className={`column-chosenNums textCenter screen${this.props.screenIndex}`}>
              Chosen Numbers
            </th>
            <th 
              data-tip='This is how many<br>numbers you have matched.<br>Three or more means you win ether!' 
              className={`column-matches textCenter screen${this.props.screenIndex}`}>
              Matches
            </th>
            <th 
              data-tip='This is how much ether<br>you won with this ticket.' 
              className={`column-prize textCenter screen${this.props.screenIndex}`}>
              Prize
            </th>
            <th 
              data-tip='If you won a prize<br>you can claim it here.' 
              className={`column-claim textCenter screen${this.props.screenIndex}`}>
              Withdraw
            </th>
          </tr>
        </thead>
      )
    }
    return tableHead
  }

  getTableResArr(resultsArr, raffleID, entriesArr) {
    const tableResultsArr =[]
    for (let i = 0; i < entriesArr.length; i++) {//loop over entries array building an object at each iteration...
      let matches  = resultsArr.timeStamp === null ? 'Pending' : utils.getMatches(entriesArr[i].slice(0,6), resultsArr.winningNumbers)
        , entryNum = entriesArr[i][7]
        , obj = {
          matches: matches,
          entryNum: entryNum,
          entryNumArr: entriesArr[i],
          chosenNumbers: entriesArr[i].slice(0,6).map(x => { return x < 10 ? `0${x}` : x }), 
          prize: resultsArr.timeStamp === null ? 'Pending' : utils.toDecimals(this.props.eth.web3.fromWei(resultsArr.winningAmounts[matches],'ether'), 3),
          amount: resultsArr.timeStamp === null ? '' : resultsArr.winningAmounts[matches], 
          withdrawn: matches < 3 ? null : entriesArr[i].length > 8 ? true : false, 
          txHash: matches < 3 ? null : entriesArr[i].length > 8 ? entriesArr[i][8] : 'Not yet claimed...', 
          txHashTimeStamp: matches < 3 ? null : entriesArr[i].length > 8 ? entriesArr[i][9] : ''
        }
      tableResultsArr[entryNum - 1] = obj
    }
    return tableResultsArr
  }

  getTableRows(resultsArr, raffleID, entriesArr) {
    const tableResultsArr = this.getTableResArr(resultsArr, raffleID, entriesArr)
        , tRows = []
    for (let i = 0; i < tableResultsArr.length; i++) {
      let nums = `${tableResultsArr[i].chosenNumbers[0]}  ${tableResultsArr[i].chosenNumbers[1]}  ${tableResultsArr[i].chosenNumbers[2]}  ${tableResultsArr[i].chosenNumbers[3]}  ${tableResultsArr[i].chosenNumbers[4]}  ${tableResultsArr[i].chosenNumbers[5]}`
      if (tableResultsArr[i].matches >= 3 && tableResultsArr[i].withdrawn === false) {//claim prize button...
        tRows.push(
          <tr key={tableResultsArr[i].entryNum + raffleID}>
            <td className={`textCenter screen${this.props.screenIndex}`}><b>{tableResultsArr[i].entryNum}</b></td>
            <td className={`column-chosenNums textCenter screen${this.props.screenIndex}`}><b>{nums}</b></td>
            <td className={'textCenter screen' + this.props.screenIndex}><b>{tableResultsArr[i].matches}</b></td>
            <td data-tip={'Wohoo - you won!<br>Full prize amount:<br>' + this.props.eth.web3.fromWei(tableResultsArr[i].amount, 'ether') + ' Ether!' + this.toDollars(tableResultsArr[i].amount)} className={`textCenter screen${this.props.screenIndex}`}><b>{tableResultsArr[i].prize} Ether</b></td>
            <td className={`textCenter screen${this.props.screenIndex}`}>
            <button
              className={`claimButton screen${this.props.screenIndex}`}
              data-tip={`Congratulations, you've won ether!<br>Click this button to claim your prize!`}
              data-raffleid={raffleID}
              data-entrynum={tableResultsArr[i].entryNum}
              data-entrynumarr={tableResultsArr[i].entryNumArr}
              onClick={(e) => {this.openModal(e)}}>
              Claim Prize!
            </button></td>
          </tr>
        )
      }
      if (tableResultsArr[i].matches >= 3 && tableResultsArr[i].withdrawn === true) {//prize claimed with tooltip deets...
        tRows.push(
          <tr key={tableResultsArr[i].entryNum + raffleID}>
            <td className={`textCenter screen${this.props.screenIndex}`}>{tableResultsArr[i].entryNum}</td>
            <td className={`column-chosenNums textCenter screen${this.props.screenIndex}`}>{nums}</td>
            <td className={`textCenter screen${this.props.screenIndex}`}>{tableResultsArr[i].matches}</td>
            <td data-tip={`Wohoo - you won!<br>Full prize amount:<br>${this.props.eth.web3.fromWei(tableResultsArr[i].amount, 'ether')} Ether!`} className={`textCenter screen${this.props.screenIndex}`}><b>{tableResultsArr[i].prize} Ether</b></td>
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
      if (tableResultsArr[i].matches === 'Pending') {//Results not drawn yet...
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
      if (tableResultsArr[i].matches < 3) {//else drawn but unwinning ticket...
        tRows.push(
          <tr key={tableResultsArr[i].entryNum + raffleID}>
            <td className={`textCenter screen${this.props.screenIndex}`}>{tableResultsArr[i].entryNum}</td>
            <td className={`textCenter screen${this.props.screenIndex}`}>{nums}</td>
            <td className={`textCenter screen${this.props.screenIndex}`}>{tableResultsArr[i].matches}</td>
            <td className={`textCenter screen${this.props.screenIndex}`}>0 Ether</td>
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
        <ReactTooltip className={`customTheme screen${this.props.screenIndex}`} effect='solid' multiline={true} />
        <p className='centred'>Your ethereum address:<br/><span className={`styledSpan screen${this.props.screenIndex}`}>{`${this.props.eth.ethAdd.substring(0,20)} . . .`}</span></p>
        { 
          this.state.tableArr.length === 1 
          ? <p className='centred'>Here is the latest raffle result for your address:</p>
          : <p className="centred">Here are the latest <span className={`styledSpan largerFont screen${this.props.screenIndex}`}>{this.state.tableArr.length}</span> raffle results for your address:</p>
        }
        <div className='resultsTable'>
          {this.state.tableArr}
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel='Claim Prize Modal'
          className={`claimPrizeModal screen${this.props.screenIndex}`}
          overlayClassName={`Overlay screen${this.props.screenIndex}`}
          shouldCloseOnOverlayClick={true}>
            {
              this.state.txHash === 'pending'
              ? <Pending screenIndex={this.props.screenIndex} safeLow={this.state.safeLow} />
              : this.state.txHash
              ? <Success screenIndex={this.props.screenIndex} txHash={this.state.txHash} />
              : <Error   screenIndex={this.props.screenIndex} txErr={this.state.txErr} />
            }
        </Modal>
      </div>
		)
	}
}

// {(this.state.database === 1) &&
//   <p className={window.innerWidth > 450 ? 'rightAlign' : 'centred'}>
//     Showing
//     <span className={"styledSpan largerFont screen" + this.props.screenIndex}>
//       &ensp;{this.state.tableArr.length}&ensp;
//     </span>
//     results out of
//     <span className={"styledSpan largerFont screen" + this.props.screenIndex}>
//       &ensp;{this.state.numRaffles}&ensp;
//     </span>
//   </p>
// }

// {/* If more to show, this appears */}
// {(this.state.database === 1 && this.state.numRaffles > this.state.tableArr.length) &&
// <p className={window.innerWidth > 450 ? 'rightAlign' : 'centred'}>
//   <a className={"button screen" + this.props.screenIndex} onClick={() => {this.getResults()}}>
//     Click for more
//   </a>
// </p>
// }

const Pending = props => (
  <div>
    <h2 className={`screen${props.screenIndex}`}>Win Claim In Progress . . .</h2>
    <img className='loadingIcon' src={LoadingIcon} style={{'margin':'0.8em 0 0 0'}} alt='Loading icon' />
    {props.safeLow && 
      <p>Safe low gas price: <span className={`styledSpan screen${props.screenIndex}`}>{props.safeLow}</span></p>
    }
  </div>
)

const Success = props => (
  <div>
    <h2 className={`screen${props.screenIndex}`}>Transaction Sent!</h2>
    <p className='centred'>
      Your transaction hash: 
      <a
        rel='noopener noreferrer'
        target='_blank'
        className={`invert screen${props.screenIndex}`}
        href={`https://etherscan.io/tx/${props.txHash}`}>
          {` ${props.txHash.substring(0, 20)}. . .`}
      </a><br/>
    </p>
    <h2 className={`screen${props.screenIndex}`}>What now?</h2>
    <p className='justify'>
      Click the hash above to watch your transaction being mined in to the block chain! When your transaction is received by Etheraffle's smart-contract it will pay out your prize directly into your account!
      <br/><br/>
      Please be patient whilst this is occuring. If after 24 hours you have not received your prize, please contact support quoting your ethereum address and this transaction hash.
    </p>
  </div>
)

const Error = props => (
  <div>
    <h2 className={`screen${props.screenIndex}`}>Error Creating Transaction!</h2>
    {props.txErr 
      ? <p className='justify last'>{props.txErr}</p> 
      : <p className='justify last'>You may have rejected the transaction, or your connection may have dropped. Please check your ethereum client and make sure your account is unlocked.</p>
    }
  </div>
)