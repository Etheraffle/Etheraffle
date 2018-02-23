import React from 'react'
import moment from 'moment'
import Modal from 'react-modal'
import ReactTooltip from 'react-tooltip'
import lowGas from '../../web3/getLowGas'
import utils from '../../components/utils'
import claimPrize from '../../web3/claimPrize'
import ClipboardButton from 'react-clipboard.js'
import loadingIcon from '../../images/loadingIconGrey.svg'
import NotConnectedInfo from '../../components/modals/notconnectedinfo'

/*
TODO: Remove the updating of details in the db? Since the event watcher will do it when the tx is actually mined? The problem is that the user will see the "claim prize" button until it's mined...? Maybe not? If it errors we can manually update the db to undo their attempted withdraw as far as the app is concerned...?
*/
export default class Results extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      data: null,
      database: 1,//db starts as up. Changed if fetch fails ∴ eth connectivity gets priority in html rendering...
      tableArr: [],
      w3Con: false,
      numRaffles: 0,
      mounted: false,
      txHash: "pending",
      modalIsOpen: false,
      safeLow: "pending"
    }
  this.getPrize         = this.getPrize.bind(this)
  this.openModal        = this.openModal.bind(this)
  this.toDollars        = this.toDollars.bind(this)
  this.closeModal       = this.closeModal.bind(this)
  this.getResults       = this.getResults.bind(this)
  this.parseResults     = this.parseResults.bind(this)
  this.getTableRows     = this.getTableRows.bind(this)
  this.updateDetails    = this.updateDetails.bind(this)
  this.getTableHeads    = this.getTableHeads.bind(this)
  this.getTableResArr   = this.getTableResArr.bind(this)

  this.parseMobile      = this.parseMobile.bind(this)
  this.raffleNotDrawn   = this.raffleNotDrawn.bind(this)
  this.raffleNoWin      = this.raffleNoWin.bind(this)
  this.raffleWin        = this.raffleWin.bind(this)
  this.raffleWinClaimed = this.raffleWinClaimed.bind(this)
  this.parseEntriesMob  = this.parseEntriesMob.bind(this)
  }

  componentWillMount(){
    this.setState({mounted: true})
    if(window.web3 !== null && window.web3.isConnected() === true) this.setState({w3Con: true, ethAdd: window.ethAdd})
  }

  componentDidMount(){
    this.getResults()
  }

  openModal(e) {
    if(window.web3 !== null && window.ethAdd !== null && window.ethAdd !== undefined && window.web3.isConnected() === true) {
      /* Fetch low gas price from api */
      lowGas().then(safeLow => {
        if(this.state.mounted) this.setState({safeLow: safeLow})
      }).catch (err => console.log('Error retrieving safe low gas rate: ', err))
      /* Get Prize */

      console.log('get prize details: ', e.target.getAttribute("data-raffleID"),
      e.target.getAttribute("data-entryNum"),
      e.target.getAttribute("data-entryNumArr"))



      this.getPrize(
        e.target.getAttribute("data-raffleID"),
        e.target.getAttribute("data-entryNum"),
        e.target.getAttribute("data-entryNumArr")
      )
      /* Open Modal */
      if(this.state.mounted) return this.setState({modalIsOpen: true})
    } else {
      /* Eth connection dropped! */
      if(this.state.mounted) return this.setState({modalIsOpen: true, w3Con: false})
    }
  }

  closeModal(){
    /* Modal was open for prize claiming purposes */
    if(window.web3 !== null && window.web3.isConnected() === true) {
      /* Reset the tx hash since we're done with it */
      if(this.state.mounted) this.setState({modalIsOpen: false, txHash: "pending", tableArr: [], numRaffles: 0})
      /* Rerender results table since it's updated now */
      return this.getResults()
    } else {
      /* Modal was open for dropped connection purposes */
      if(this.state.mounted) this.setState({modalIsOpen: false, txHash: "pending"})
    }
  }

  getPrize(raffleID, entryNum, entryNumArr) {
    /* Perform web3 prize claim function for Saturday raffle (in future this will be var...) */
    claimPrize("Saturday", window.ethAdd, raffleID, entryNum)
    .then(txHash => {
      /* Put txhash in state */
      if(this.state.mounted) this.setState({txHash: txHash})
      /* Update details in the database */
      return this.updateDetails(txHash, raffleID, entryNum, entryNumArr, window.ethAdd)
    }).catch(err => {
      console.log("Error claiming prize: ", err)
      if(this.state.mounted) this.setState({txHash: null})
    })
  }

  updateDetails(txHash, raffleID, entryNum, entryNumArr, userAdd){
    return fetch("https://etheraffle.com/api/updateonwithdraw", {
      method:  "POST",
      headers: {'content-type': 'application/JSON'},
      body: JSON.stringify({
        txHash:      txHash,
        ethAdd:      userAdd,
        raffleID:    raffleID,
        entryNum:    entryNum,
        entryNumArr: entryNumArr
      })
    })
    .then(res => {
      if(res.status === 503) return this.setState({database: 503})
      if(res.status !== 200) return this.setState({database: 0})
      return res.json()
      .then(json => {
        if(json.success === false) throw new Error("Error in updateDetails - Mongo responded false!")
        return
      })
    }).catch(err => {
      console.log("Error updating details: ", err.stack)
      if(this.state.mounted) this.setState({database: 0})//database down...
    })
  }

  getResults(){
    return fetch("https://etheraffle.com/api/ethaddress", {
      method: "POST",
      headers: {'content-type': 'application/JSON'},
      body: JSON.stringify({ethAdd: window.ethAdd})
    })
    .then(res => {
      if(res.status === 503) return this.setState({database: 503})
      if(res.status !== 200) return this.setState({database: 0})
      return res.json()
      .then(json => {
        if(json.raffleIDs === undefined) {//None entered...
          if(this.state.mounted) this.setState({numRaffles: null})
        } else {
          console.log("db res: ", json)
          if(this.state.mounted) this.setState({numRaffles: json.raffleIDs.length, data: json})
          if(window.innerWidth < 450) return this.parseMobile(json)//no tooltips to rebuild
          this.parseResults(json)
          ReactTooltip.rebuild()
        }
      })
    }).catch(err => {
      console.log("Error retrieving results: ", err)
      if(this.state.mounted) this.setState({database: 0})
    })
  }

  parseResults(JSON){
    let tableArr = this.state.tableArr,
        arr      = JSON.raffleIDs.reverse()
    for(let i = 0; i < arr.length; i++){
      const table = [],
            tHead = this.getTableHeads(arr[i], JSON.results[arr[i]]),
            tRows = this.getTableRows(JSON.results[arr[i]], arr[i], JSON.entries[arr[i]])
      table.push(
        <div className="tableDiv">
          <table className={"tableFill screen" + this.props.screenIndex}>
              {tHead}
            <tbody className={"tableHover screen" + this.props.screenIndex}>
              {tRows}
            </tbody>
          </table>
        </div>
        )
      tableArr.push(table)
    }
    if(this.state.mounted) this.setState({tableArr: tableArr})
  }

  getTableHeads(raffleID, resultsArr){
    let tableHead = [],
        timeStamp = moment().day('Saturday').format('dddd MMMM Do YYYY')//returns next occurring saturday
    if(resultsArr.timeStamp === null){//results not drawn yet...
      tableHead.push(
        <thead key={raffleID + 1}>
          <tr key={raffleID + 2}>
            <th data-tip={"Draw due on " + timeStamp} className={"textCenter screen" + this.props.screenIndex} colSpan={"5"}>
              Raffle Number:&ensp;{raffleID}
              <br/>
              Draw due on {timeStamp}
            </th>
          </tr>
          <tr key={raffleID + 3}>
            <th data-tip="This is your personal entry<br>number for raffle." className={"column-entryNum textCenter screen" + this.props.screenIndex}>Entry</th>
            <th data-tip="These are your chosen<br>numbers for this raffle." className={"column-chosenNums textCenter screen" + this.props.screenIndex}>Chosen Numbers</th>
            <th data-tip="When the results are drawn<br>your number of matches will appear<br>here. Three or more means you win ether!" className={"column-matches textCenter screen" + this.props.screenIndex}>Matches</th>
            <th data-tip="When the results are drawn,<br>the amont of ether your raffle<br> ticket won will appear here." className={"column-prize textCenter screen" + this.props.screenIndex}>Prize</th>
            <th data-tip="If you win ether, a<br>button will appear in this<br>column so you can claim it!" className={"column-claim textCenter screen" + this.props.screenIndex}>Withdraw</th>
          </tr>
        </thead>
      )
    } else {//results are in...
      const winningNums = resultsArr.winningNumbers
      let temp = []
      for(let j = 0; j < winningNums.length; j++){//add leading zeros
        temp[j] = winningNums[j] < 10 ? "0" + winningNums[j] : winningNums[j]
      }
      timeStamp = moment.unix(resultsArr.timeStamp).format("Do MMM YYYY [at] h:mm a")
      tableHead.push(
        <thead key={raffleID + 1}>
          <tr key={raffleID + 2}>
            <th data-tip={"Drawn on " + timeStamp} className={"textCenter screen" + this.props.screenIndex} colSpan={"5"}>
              Raffle Number:&ensp;{raffleID}
              <br/>
              Winning Numbers:&ensp;{temp[0]}&ensp;{temp[1]}&ensp;{temp[2]}&ensp;{temp[3]}&ensp;{temp[4]}&ensp;{temp[5]}&ensp;
            </th>
          </tr>
          <tr key={raffleID + 3}>
            <th data-tip="This is how many times you<br>have entered into this raffle." className={"column-entryNum textCenter screen" + this.props.screenIndex}>Entry</th>
            <th data-tip="These are your chosen<br>numbers for this raffle ticket." className={"column-chosenNums textCenter screen" + this.props.screenIndex}>Chosen Numbers</th>
            <th data-tip="This is how many<br>numbers you have matched.<br>Three or more means you win ether!" className={"column-matches textCenter screen" + this.props.screenIndex}>Matches</th>
            <th data-tip="This is how much ether<br>you won with this ticket." className={"column-prize textCenter screen" + this.props.screenIndex}>Prize</th>
            <th data-tip="If you won a prize<br>you can claim it here." className={"column-claim textCenter screen" + this.props.screenIndex}>Withdraw</th>
          </tr>
        </thead>
      )
    }
    return tableHead
  }

  getTableResArr(resultsArr, raffleID, entriesArr){
    const tableResultsArr =[]
    for(let i = 0; i < entriesArr.length; i++){//loop over entries array building an object at each iteration...
      let matches, prize, amountWei, withdrawn, txHash, txHashTimeStamp, entryNum = entriesArr[i][7], entryNumArr = entriesArr[i], chosenNumbers = entriesArr[i].slice(0,6)
      for(let j = 0; j < chosenNumbers.length; j++){
        if(chosenNumbers[j] < 10) chosenNumbers[j] = "0" + chosenNumbers[j]//add leading zeros
      }
      if(resultsArr.timeStamp === null){//no results drawn yet...
        matches = "Pending"
        prize   = "Pending"
      } else {//results drawn...
        matches   = utils.getMatches(entriesArr[i].slice(0,6), resultsArr.winningNumbers)
        prize     = utils.toDecimals(window.web3.fromWei(resultsArr.winningAmounts[matches],'ether'), 3)
        amountWei = resultsArr.winningAmounts[matches]
      }
      if(matches < 3){//no prize
        withdrawn       = null
        txHash          = null
        txHashTimeStamp = null
      } else if (entriesArr[i].length > 8){//prize won & withdrawn
        withdrawn       = true
        txHash          = entriesArr[i][8]
        txHashTimeStamp = entriesArr[i][9]
      } else {//prize won but not withdrawn yet...
        withdrawn = false
        txHash    = "Not yet claimed..."
      }
      const obj = {
        amount: amountWei, entryNum: entryNum, entryNumArr: entryNumArr,
        chosenNumbers: chosenNumbers, matches: matches, prize: prize,
        withdrawn: withdrawn, txHash: txHash, txHashTimeStamp: txHashTimeStamp
      }
      tableResultsArr[entryNum - 1] = obj
    }
    return tableResultsArr
  }

  getTableRows(resultsArr, raffleID, entriesArr){
    const tableResultsArr = this.getTableResArr(resultsArr, raffleID, entriesArr)
    const tRows = []
    for(let i = 0; i < tableResultsArr.length; i++){
      if(tableResultsArr[i].matches >= 3 && tableResultsArr[i].withdrawn === false){//claim prize button...
        tRows.push(
          <tr key={tableResultsArr[i].entryNum + raffleID}>
            <td className={"textCenter screen" + this.props.screenIndex}><b>{tableResultsArr[i].entryNum}</b></td>
            <td className={"column-chosenNums textCenter screen" + this.props.screenIndex}>
              <b>
              {tableResultsArr[i].chosenNumbers[0]}&ensp;
              {tableResultsArr[i].chosenNumbers[1]}&ensp;
              {tableResultsArr[i].chosenNumbers[2]}&ensp;
              {tableResultsArr[i].chosenNumbers[3]}&ensp;
              {tableResultsArr[i].chosenNumbers[4]}&ensp;
              {tableResultsArr[i].chosenNumbers[5]}
              </b>
            </td>
            <td className={"textCenter screen" + this.props.screenIndex}><b>{tableResultsArr[i].matches}</b></td>
            <td data-tip={"Wohoo - you won!<br>Full prize amount:<br>" + window.web3.fromWei(tableResultsArr[i].amount, "ether") + " Ether!" + this.toDollars(tableResultsArr[i].amount)} className={"textCenter screen" + this.props.screenIndex}><b>{tableResultsArr[i].prize} Ether</b></td>
            <td className={"textCenter screen" + this.props.screenIndex}>
            <button
              className={"claimButton screen" + this.props.screenIndex}
              data-tip="Congratulations, you've won ether!<br>Click this button to claim your prize!"
              data-raffleID={raffleID}
              data-entryNum={tableResultsArr[i].entryNum}
              data-entryNumArr={tableResultsArr[i].entryNumArr}
              onClick={(e) => {this.openModal(e)}}>
              Claim Prize!
            </button></td>
          </tr>
        )
      }
      if(tableResultsArr[i].matches >= 3 && tableResultsArr[i].withdrawn === true){//prize claimed with tooltip deets...
        tRows.push(
          <tr key={tableResultsArr[i].entryNum + raffleID}>
            <td className={"textCenter screen" + this.props.screenIndex}>{tableResultsArr[i].entryNum}</td>
            <td className={"column-chosenNums textCenter screen" + this.props.screenIndex}>
              {tableResultsArr[i].chosenNumbers[0]}&ensp;
              {tableResultsArr[i].chosenNumbers[1]}&ensp;
              {tableResultsArr[i].chosenNumbers[2]}&ensp;
              {tableResultsArr[i].chosenNumbers[3]}&ensp;
              {tableResultsArr[i].chosenNumbers[4]}&ensp;
              {tableResultsArr[i].chosenNumbers[5]}
            </td>
            <td className={"textCenter screen" + this.props.screenIndex}>{tableResultsArr[i].matches}</td>
            <td data-tip={"Wohoo - you won!<br>Full prize amount:<br>" + window.web3.fromWei(tableResultsArr[i].amount, "ether") + " Ether!"}className={"textCenter screen" + this.props.screenIndex}><b>{tableResultsArr[i].prize} Ether</b></td>
            <td
              data-tip={"You claimed on:<br>" + moment.unix(tableResultsArr[i].txHashTimeStamp).format("Do MMM YYYY [at] h:mm a") + "<br>Your transaction hash:<br>" + tableResultsArr[i].txHash + "<br> Click on 'Claimed' to copy these details to the clipboard."}
              className={"textCenter screen" + this.props.screenIndex}>
            <ClipboardButton
              className={"clipBoardButtonClaimPrize screen" + this.props.screenIndex}
              data-clipboard-text={"My ethereum address is: " + window.ethAdd + ", and I claimed the prize on: " + moment.unix(tableResultsArr[i].txHashTimeStamp).format("Do MMM YYYY [at] h:mm a") + ". The transaction hash was: " + tableResultsArr[i].txHash}>
              Claimed!
            </ClipboardButton>
            </td>
          </tr>
        )
      }
      if(tableResultsArr[i].matches === "Pending"){//Results not drawn yet...
        tRows.push(
          <tr key={tableResultsArr[i].entryNum + raffleID}>
            <td className={"textCenter screen" + this.props.screenIndex}>{tableResultsArr[i].entryNum}</td>
            <td className={" column-chosenNums textCenter screen" + this.props.screenIndex}>
              {tableResultsArr[i].chosenNumbers[0]}&ensp;
              {tableResultsArr[i].chosenNumbers[1]}&ensp;
              {tableResultsArr[i].chosenNumbers[2]}&ensp;
              {tableResultsArr[i].chosenNumbers[3]}&ensp;
              {tableResultsArr[i].chosenNumbers[4]}&ensp;
              {tableResultsArr[i].chosenNumbers[5]}
              </td>
            <td className={"textCenter screen" + this.props.screenIndex}>n/a</td>
            <td className={"textCenter screen" + this.props.screenIndex}>Pending</td>
            <td className={"textCenter screen" + this.props.screenIndex}>n/a</td>
          </tr>
        )
      }
      if(tableResultsArr[i].matches < 3){//else drawn but unwinning ticket...
        tRows.push(
          <tr key={tableResultsArr[i].entryNum + raffleID}>
            <td className={"textCenter screen" + this.props.screenIndex}>{tableResultsArr[i].entryNum}</td>
            <td className={"textCenter screen" + this.props.screenIndex}>
              {tableResultsArr[i].chosenNumbers[0]}&ensp;
              {tableResultsArr[i].chosenNumbers[1]}&ensp;
              {tableResultsArr[i].chosenNumbers[2]}&ensp;
              {tableResultsArr[i].chosenNumbers[3]}&ensp;
              {tableResultsArr[i].chosenNumbers[4]}&ensp;
              {tableResultsArr[i].chosenNumbers[5]}
            </td>
            <td className={"textCenter screen" + this.props.screenIndex}>{tableResultsArr[i].matches}</td>
            <td className={"textCenter screen" + this.props.screenIndex}>0 Ether</td>
            <td className={"textCenter screen" + this.props.screenIndex}>No Prize</td>
          </tr>
        )
      }
    }
    return tRows
  }

  toDollars(_amount){
    if(window.exRate !== null && window.exRate > 0){
      let num = utils.toDecimals((window.web3.fromWei(_amount, "ether") * window.exRate), 2)
      return '<br>Approximately $' + num + '!'
    }
    else return ''
  }

  /* Mobile table logic follows */

  parseMobile(_data) {
    let tables  = [],
        results = _data.results,
        entries = _data.entries,
        rIDs    = _data.raffleIDs
    /* Loop over raffle IDs sending corresponding entry & results arrays for parsing */
    for(let i = 0; i < rIDs.length; i++) {
      tables.push(this.parseEntriesMob(rIDs[i], entries[rIDs[i]].reverse(), results[rIDs[i]]))
    }
    if(this.state.mounted) this.setState({tableArr: tables})
  }

  parseEntriesMob(_rafID, _entArr, _resObj) {
    console.log('ParseEntries rafID: ', _rafID, ' entArr: ', _entArr, ' _resObj: ', _resObj)
    let table = []
    /* Loop over each entry building obj needed for table */
    for(let i = 0; i < _entArr.length; i++) {
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
      let num               = _resObj['timeStamp'] !== null ? obj['winningAmounts'][obj['matches']] : 0
      obj['prize']          = _resObj['timeStamp'] !== null ? utils.toDecimals(window.web3.fromWei(num,'ether'), 3) : null
      /* Retrieve table html */
      if(_resObj['timeStamp'] === null) table.push(this.raffleNotDrawn(obj)) //not drawn
      else if(obj['matches'] < 3) table.push(this.raffleNoWin(obj)) //drawn but no win
      else if(!obj['claimed']) table.push(this.raffleWin(obj)) //drawn, won but not claimed
      else table.push(this.raffleWinClaimed(obj)) //won and claimed
      }
    console.log('table: ', table)
    return table
  }

  raffleNotDrawn(_o) {
    let table = []
    table.push(
      <div className={'resultsTable screen' + this.props.screenIndex}>
        <table className={'tableFill screen' + this.props.screenIndex}>
          <thead>
            <tr>
              <th className={'textCenter screen' + this.props.screenIndex}>
                Raffle Nº {_o['rafID']} &emsp; Entry Nº {_o['entryNumber']}
              </th>
            </tr>
          </thead>
          <tbody className={'tableHover screen' + this.props.screenIndex}>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex}>
                Draw Due On: <br/>
                {moment().day('Saturday').format('dddd MMMM Do YYYY')}
              </td>
            </tr>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex}>
                Chosen Numbers:<br/>
                  {_o['chosenNumbers'][0]}&ensp;
                  {_o['chosenNumbers'][1]}&ensp;
                  {_o['chosenNumbers'][2]}&ensp;
                  {_o['chosenNumbers'][3]}&ensp;
                  {_o['chosenNumbers'][4]}&ensp;
                  {_o['chosenNumbers'][5]}
              </td>
            </tr>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex}>
                Good Luck!
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
    return table
  }

  raffleNoWin(_o) {
    let table = []
    table.push(
      <div className={'resultsTable screen' + this.props.screenIndex}>
        <table className={'tableFill screen' + this.props.screenIndex}>
          <thead>
            <tr>
              <th className={'textCenter screen' + this.props.screenIndex}>
                Raffle Nº {_o['rafID']} &emsp; Entry Nº {_o['entryNumber']}<br/>
                Winning Numbers: &nbsp;
                  {_o['winningNumbers'][0]}&ensp;
                  {_o['winningNumbers'][1]}&ensp;
                  {_o['winningNumbers'][2]}&ensp;
                  {_o['winningNumbers'][3]}&ensp;
                  {_o['winningNumbers'][4]}&ensp;
                  {_o['winningNumbers'][5]}
              </th>
            </tr>
          </thead>
          <tbody className={'tableHover screen' + this.props.screenIndex}>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex}>
                Drawn On: <br/>
                {moment.unix(_o['rafTimeStamp']).format('dddd Do MMMM YYYY')}
              </td>
            </tr>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex}>
                Chosen Numbers:<br/>
                  {_o['chosenNumbers'][0]}&ensp;
                  {_o['chosenNumbers'][1]}&ensp;
                  {_o['chosenNumbers'][2]}&ensp;
                  {_o['chosenNumbers'][3]}&ensp;
                  {_o['chosenNumbers'][4]}&ensp;
                  {_o['chosenNumbers'][5]}
              </td>
            </tr>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex}>
                Matches: {_o['matches']}
              </td>
            </tr>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex}>
                No Prize &#9785;
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
    return table
  }

  raffleWin(_o) {
    let table = []
    table.push(
      <div className={'resultsTable screen' + this.props.screenIndex}>
        <table className={'tableFill screen' + this.props.screenIndex}>
          <thead>
            <tr>
              <th className={'textCenter screen' + this.props.screenIndex}>
                Raffle Nº {_o['rafID']} &emsp; Entry Nº {_o['entryNumber']}<br/>
                Winning Numbers: &nbsp;
                  {_o['winningNumbers'][0]}&ensp;
                  {_o['winningNumbers'][1]}&ensp;
                  {_o['winningNumbers'][2]}&ensp;
                  {_o['winningNumbers'][3]}&ensp;
                  {_o['winningNumbers'][4]}&ensp;
                  {_o['winningNumbers'][5]}
              </th>
            </tr>
          </thead>
          <tbody className={'tableHover screen' + this.props.screenIndex}>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex}>
                Drawn On: <br/>
                {moment.unix(_o['rafTimeStamp']).format('dddd Do MMMM YYYY')}
              </td>
            </tr>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex}>
                Chosen Numbers: <br/>
                  {_o['chosenNumbers'][0]}&ensp;
                  {_o['chosenNumbers'][1]}&ensp;
                  {_o['chosenNumbers'][2]}&ensp;
                  {_o['chosenNumbers'][3]}&ensp;
                  {_o['chosenNumbers'][4]}&ensp;
                  {_o['chosenNumbers'][5]}
              </td>
            </tr>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex}>
                Matches: {_o['matches']}
              </td>
            </tr>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex} style={{'fontWeight':'bold'}}>
                Prize: {_o['prize']} Ether!
              </td>
            </tr>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex}>
                <button
                  className={"claimButton screen" + this.props.screenIndex}
                  data-raffleID={_o['rafID']}
                  data-entryNum={_o['entryNumber']}
                  data-entryNumArr={_o['entArr']}
                  onClick={(e) => {this.openModal(e)}}>
                  Claim Prize!
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
    return table
  }

  raffleWinClaimed(_o) {
    let table = []
    table.push(
      <div className={'resultsTable screen' + this.props.screenIndex}>
        <table className={'tableFill screen' + this.props.screenIndex}>
          <thead>
            <tr>
              <th className={'textCenter screen' + this.props.screenIndex}>
                Raffle Nº {_o['rafID']} &emsp; Entry Nº {_o['entryNumber']}<br/>
                Winning Numbers: &nbsp;
                  {_o['winningNumbers'][0]}&ensp;
                  {_o['winningNumbers'][1]}&ensp;
                  {_o['winningNumbers'][2]}&ensp;
                  {_o['winningNumbers'][3]}&ensp;
                  {_o['winningNumbers'][4]}&ensp;
                  {_o['winningNumbers'][5]}
              </th>
            </tr>
          </thead>
          <tbody className={'tableHover screen' + this.props.screenIndex}>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex}>
                Drawn On: <br/>
                {moment.unix(_o['rafTimeStamp']).format('dddd Do MMMM YYYY')}
              </td>
            </tr>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex}>
                Chosen Numbers: <br/>
                  {_o['chosenNumbers'][0]}&ensp;
                  {_o['chosenNumbers'][1]}&ensp;
                  {_o['chosenNumbers'][2]}&ensp;
                  {_o['chosenNumbers'][3]}&ensp;
                  {_o['chosenNumbers'][4]}&ensp;
                  {_o['chosenNumbers'][5]}
              </td>
            </tr>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex}>
                Matches: {_o['matches']}
              </td>
            </tr>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex} style={{'fontWeight':'bold'}}>
                Prize: {_o['prize']} Ether!
              </td>
            </tr>
            <tr>
              <td className={'textCenter screen' + this.props.screenIndex}>
                Prize claimed on:
                <br/>
                  <b>{moment.unix(_o['txTimeStamp']).format('dddd Do MMMM, YYYY')}</b>
                <br/>
                <br/>
                Transaction Hash:
                <br/>
                <a
                  className={'screen' + this.props.screenIndex}
                  rel='noopener noreferrer'
                  target= '_blank'
                  href={'https://www.etherscan.io/tx/' + _o['txHash']}
                >
                 <b>{_o['txHash'].substring(0,20) + '. . .'}</b>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
    return table
  }

  componentWillUnmount(){
    this.setState({mounted: false})
  }

  render(){
    return(
      <div className={"contentWrapper si" + this.props.screenIndex}>
        <div className={"content ssi" + this.props.subScreenIndex}>

        {/* Not connected modal if not connected to eth network*/}
        {(this.state.w3Con === false || window.ethAdd === null || window.ethAdd === undefined) &&
          <div>
            <br/>
            <h3 className={"centred screen" + this.props.screenIndex}>
              No Ethereum Address Detected!
            </h3>
            <p className='centred'>
              <a className={"centred screen" + this.props.screenIndex} style={{cursor: 'pointer'}} onClick={()=>this.openModal()}>
                Click here for connection issue solutions.
              </a>
            </p>
            <Modal
             isOpen={this.state.modalIsOpen}
             onRequestClose={this.closeModal}
             contentLabel="No Ethereum Connection Modal"
             className={"welcomeModal screen" + this.props.screenIndex}
             overlayClassName={"Overlay screen" + this.props.screenIndex}
             shouldCloseOnOverlayClick={true}
            >

              <NotConnectedInfo screenIndex={this.props.screenIndex}/>

              <p className="justify" style={{"padding": "30px"}}>
                If you were connected before seeing this message, your connection may have dropped or you may have rejected a transaction. Please check your ethereum connection method. If you're using Metamask, please make sure you are signed in. If using Mist, please make sure you have an account connected and have authorized it to interact with the
                <span className={"styledSpan screen" + this.props.screenIndex}>
                  Etheraffle
                </span>
                ÐApp.
              </p>
              <a className={"centred screen" + this.props.screenIndex} style={{cursor: 'pointer'}} onClick={()=>{window.location.reload()}}>
                Click here to reload.
              </a>
            </Modal>
          </div>
        }

        {/* Loading results whilst fetches come in */}
        {(this.state.w3Con === true &&
          window.ethAdd !== null &&
          window.ethAdd !== undefined &&
          this.state.numRaffles === 0 &&
          this.state.database === 1
          ) &&

          <div>
            <br/>

            <h2 className={'centred screen' + this.props.screenIndex}>
              Loading results!
            </h2>

            <br/>

            <img className='loadingIcon centred' src={loadingIcon} alt='Loading Icon' />

          </div>
        }

        {/* If fetches fail when web3 is live, database is down */}
        {(this.state.database === 0 && this.state.w3Con === true) &&
          <div>
            <br/>
            <h2 className={'centred screen' + this.props.screenIndex}>
              Database Error!
            </h2>
            <p className='centred'>
              We apologise and are working to fix the problem.
            </p>
          </div>
        }

        {/* If fetches fail (overloaded) when web3 is live, database is down */}
        {(this.state.database === 503 && this.state.w3Con === true) &&
          <div>
            <br/>
            <h2 className={"centred screen" + this.props.screenIndex}>
              Database unavailable - too many requests from this IP!
            </h2>
            <p className='centred'>
              Please try again later.
            </p>
          </div>
        }

        {/* Web3 & Databse both live, but no results */}
        {(this.state.w3Con === true &&
          window.ethAdd !== null &&
          window.ethAdd !== undefined &&
          this.state.numRaffles === null &&
          this.state.database === 1
          ) &&
          <div>
            <br/>

            <h2 className={'centred screen' + this.props.screenIndex}>
              {window.ethAdd.substring(0,15) + '...'}
            </h2>

            <br/>

            <p className="centred">
              You haven't entered any raffles yet!
            </p>
          </div>
        }

        {/* DB & Web3 Live, results are in */}
        {(this.state.numRaffles > 0) &&
          <div className='resultsPage'>
            <ReactTooltip className={"customTheme screen" + this.props.screenIndex} effect="solid" multiline={true} />

              <p className='centred'>
                Your ethereum address:
                <br/>
                <span className={"styledSpan screen" + this.props.screenIndex}>
                  {window.ethAdd.substring(0,20) + ' . . .'}
                </span>
              </p>

              {/* One raffle result (non-mobile) */}
              {(window.innerWidth > 450 && this.state.tableArr.length === 1) &&
                <p className="centred">
                  Here is the latest raffle result for your address:
                </p>
              }

              {/* Greater than one raffle result (non-mobile) */}
              {(window.innerWidth > 450 && this.state.tableArr.length > 1) &&
                <p className="centred">
                  Here are the latest
                  <span className={"styledSpan largerFont screen" + this.props.screenIndex}>
                    &nbsp;{this.state.tableArr.length}&nbsp;
                  </span>
                  raffle results for your address:
                </p>
              }

              {/* Mobile version - one result */}
              {(window.innerWidth <= 450 && this.state.tableArr.length === 1) &&
                <p className="centred">
                  Here are your entries from the latest raffle for your address:
                </p>
              }

              {/* Mobile version - greater than one result */}
              {(window.innerWidth <= 450 && this.state.tableArr.length > 1) &&
                <p className="centred">
                  Here are your entries from the latest
                  <span className={"styledSpan largerFont screen" + this.props.screenIndex}>
                    &nbsp;{this.state.tableArr.length}&nbsp;
                  </span>
                  raffles for your address:
                </p>
              }

              {/* The results table */}
              <div className='resultsTable'>
                {this.state.tableArr}
              </div>

              {/* Modal Stuff */}
              <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                contentLabel="Claim Prize Modal"
                className={"claimPrizeModal screen" + this.props.screenIndex}
                overlayClassName={"Overlay screen" + this.props.screenIndex}
                shouldCloseOnOverlayClick={true}
              >
              {(this.state.txHash === "pending") &&
                <div>
                  <h2 className={"screen" + this.props.screenIndex}>
                    Withdrawal In Progress...
                  </h2>

                  <img className='loadingIcon centred' src={loadingIcon} alt='Loading icon' />

                {(this.state.safeLow !== "pending") &&
                  <p>
                    Safe low gas price:
                    <span className={'styledSpan screen' + this.props.screenIndex}>
                      &nbsp;{this.state.safeLow}
                    </span>
                  </p>
                }
                </div>
              }

              {/* txHash in means transaction successfully sent */}
              {(this.state.txHash !== null && this.state.txHash !== "pending") &&
                <div>
                  <h2 className={"centred screen" + this.props.screenIndex}>
                    Transaction sent! Your transaction hash:
                  </h2>
                  <p>
                    <a
                    className={"centered screen" + this.props.screenIndex}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={"https:/www.etherscan.io/tx/" + this.state.txHash}
                    >
                    {this.state.txHash.substring(0,30) + '. . .'}
                    </a>
                  </p>
                  <br/>
                  <h2 className={"screen" + this.props.screenIndex}>
                    What now?
                  </h2>
                  <p className='justify'>
                    Click the hash above to watch your transaction being mined in to the block chain! When your transaction is received by Etheraffle's smart contract, it will perform checks to verify this prize claim, and then it will pay out your ether directly into your account!
                    <br/><br/>
                    Please be patient whilst this is occuring. If after 24 hours you have not received your prize, please contact support quoting your ethereum address and this transaction hash.
                  </p>
                </div>
              }

              {/* txHash null = an error somewhere in the transaction attempt */}
              { (this.state.txHash === null) &&
              <div>
                <h2
                className={"screen" + this.props.screenIndex}>
                  Error Claiming Prize!
                </h2>

                <p className="centred">
                  You may have rejected the transaction, or your connection may have dropped. Please check your ethereum client and make sure your account is unlocked.
                </p>

              </div>
              }
              </Modal>

              {/* Conditional rendering for when the db is up, regarding the number of results shown */}
              {(this.state.database === 1) &&
                <p className={window.innerWidth > 450 ? 'rightAlign' : 'centred'}>
                  Showing
                  <span className={"styledSpan largerFont screen" + this.props.screenIndex}>
                    &ensp;{this.state.tableArr.length}&ensp;
                  </span>
                  results out of
                  <span className={"styledSpan largerFont screen" + this.props.screenIndex}>
                    &ensp;{this.state.numRaffles}&ensp;
                  </span>
                </p>
              }

              {/* If more to show, this appears */}
              {(this.state.database === 1 && this.state.numRaffles > this.state.tableArr.length) &&
              <p className={window.innerWidth > 450 ? 'rightAlign' : 'centred'}>
                <a className={"button screen" + this.props.screenIndex} onClick={() => {this.getResults()}}>
                  Click for more
                </a>
              </p>
              }
            </div>
          }
        </div>
      </div>
    )
  }
}
/*

<div className='resultsTable screen5'>
<table className='tableFill screen5'>
<thead>
<tr>
<th className='textCentre screen5' colSpan={"2"}> Lottery Odds
</th>
</tr>

<tr>
<th className='textCentre screen5'>Matches</th>
<th className='textCentre screen5'>Odds</th>
</tr>
</thead>
<tbody className='tableHover screen5'>
<tr>
<td className='textCenter screen5'>0</td>
<td className='textCenter screen5'>1 in 2.29</td>
</tr>
<tr>
<td className='textCenter screen5'>1</td>
<td className='textCenter screen5'>1 in 2.42</td>
</tr>
<tr>
<td className='textCenter screen5'>2</td>
<td className='textCenter screen5'>1 in 7.55</td>
</tr>
<tr>
<td className='textCenter screen5'>3</td>
<td className='textCenter screen5'>1 in 56.6</td>
</tr>
<tr>
<td className='textCenter screen5'>4</td>
<td className='textCenter screen5'>1 in 1032</td>
</tr>
<tr>
<td className='textCenter screen5'>5</td>
<td className='textCenter screen5'>1 in 54200</td>
</tr>
<tr>
<td className='textCenter screen5'>6</td>
<td className='textCenter screen5'>1 in 13983816</td>
</tr>

</tbody>
</table>
</div>



<div className='resultsTable screen5' style={{'width':'70%'}}>
<table className='tableFill screen5'>
<thead>
<tr>
<th className='textCentre screen5' colSpan={"4"}>Etheraffle ICO Particulars
</th>
</tr>

<tr>
<th className='textCentre screen5' style={{'width':'20%'}}>Tier</th>
<th className='textCentre screen5' style={{'width':'40%'}}>Exchange Rate (LOT/ETH)</th>
<th className='textCentre screen5' style={{'width':'20%'}}>Length (Weeks)</th>
<th className='textCentre screen5' style={{'width':'20%'}}>Cap (ETH)</th>
</tr>
</thead>
<tbody className='tableHover screen5' style={{'fontSize':'1em'}}>
<tr>
<td className='textCenter screen5'>0</td>
<td className='textCenter screen5'>110,000</td>
<td className='textCenter screen5'>1</td>
<td className='textCenter screen5'>700</td>
</tr>
<tr>
<td className='textCenter screen5'>1</td>
<td className='textCenter screen5'>100,000</td>
<td className='textCenter screen5'>2</td>
<td className='textCenter screen5'>2,500</td>
</tr>
<tr>
<td className='textCenter screen5'>2</td>
<td className='textCenter screen5'>90,000</td>
<td className='textCenter screen5'>3</td>
<td className='textCenter screen5'>7,000</td>
</tr>
<tr>
<td className='textCenter screen5'>3</td>
<td className='textCenter screen5'>80,000</td>
<td className='textCenter screen5'>4</td>
<td className='textCenter screen5'>20,000</td>
</tr>
<tr>
<td className='textCenter screen5'>All</td>
<td className='textCenter screen5'>1,500 Bonus LOT<br/>per ETH per Tier</td>
<td className='textCenter screen5'>n/a</td>
<td className='textCenter screen5'>n/a</td>
</tr>

</tbody>
</table>
</div>

<div className="code" style={{'width':'75%'}}>
  <span className={"styledSpan centred largerFont screen2"}>Example</span>
  <br/>
  Assume you purchase 1 ether's worth of LOT in during Pre-ICO
  <br/>
  Assume maximum ether is raised in each tier
  <br/>
  <br/>
  LOT purchased from Pre-ICO
  <br/>
  &emsp;&emsp;&emsp;
  <span className={"styledSpan largerFont screen2"}>
    {1} Ether * {110000} LOT = {110000} LOT
  </span>
  <br/>
  <br/>
  Bonus LOT pool available from tier one:
  <br/>
  &emsp;&emsp;&emsp;
  <span className={"styledSpan largerFont screen2"}>
    {2500} Ether * {1500} Bonus LOT = {2500 * 1500} LOT
  </span>
  <br/>
  <br/>
  Bonus LOT pool available from tier two:
  <br/>
  &emsp;&emsp;&emsp;
  <span className={"styledSpan largerFont screen2"}>
    {7000} Ether * {1500} Bonus LOT = {7000 * 1500} LOT
  </span>
  <br/>
  <br/>
  Bonus LOT pool available from tier three:
  <br/>
  &emsp;&emsp;&emsp;
  <span className={"styledSpan largerFont screen2"}>
    {20000} Ether * {1500} Bonus LOT = {20000 * 1500} LOT
    </span>
  <br/>
  <br/>
  Your percentage share of bonus LOT:
  <br/>
  &emsp;&emsp;&emsp;
  <span className={"styledSpan largerFont screen2"}>
    1 / {700} Ether = {((1 / 700) * 100 + '').substring(0,5) + '..%'}
  </span>
  <br/>
  <br/>
  Your bonus LOT from tier one:
  <br/>
  &emsp;&emsp;&emsp;
  <span className={"styledSpan largerFont screen2"}>
    {((1 / 700) * 100 + '').substring(0,5) + '..%'} of {2500 * 1500} LOT ≈ {(((1 / 700)) * (2500 * 1500)+'').substring(0,4)} LOT
  </span>
  <br/>
  <br/>
  Your bonus LOT from tier two:
  <br/>
  &emsp;&emsp;&emsp;
  <span className={"styledSpan largerFont screen2"}>
    {((1 / 700) * 100 + '').substring(0,5) + '..%'} of {7000 * 15000} LOT ≈ {((1 / 700)) * (7000 * 1500)} LOT
  </span>
  <br/>
  <br/>
  Your bonus LOT from tier three:
  <br/>
  &emsp;&emsp;&emsp;
  <span className={"styledSpan largerFont screen2"}>
    {((1 / 700) * 100 + '').substring(0,5) + '..%'} of {20000 * 1500} LOT ≈ {(((1 / 700)) *(20000 * 1500)+'').substring(0,5)} LOT
  </span>
  <br/>
  <br/>
  Your total number of bonus LOT:
  &emsp;&emsp;&emsp;
  <span className={"styledSpan centred largerFont screen2"} styles={{'fontWeight':'bold', 'marginTop': '7px', 'fontSize': '1.2em'}}>
    ≈ {((((1 / 700)) * (2500 * 1500) + ((1 / 700)) * (7000 * 1500)) + (((1 / 700)) * (20000 * 1500))+'').substring(0,2) + '000'} LOT
  </span>
  ∴ Your total LOT acquired:
  &emsp;&emsp;&emsp;
  <span className={"styledSpan centred largerFont screen2"} styles={{'fontSize':'1.2em', 'marginTop': '7px', 'fontSize': '1.2em'}}>
    ≈ {173000} LOT
  </span>

</div>

*/
