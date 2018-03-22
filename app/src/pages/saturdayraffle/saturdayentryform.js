import React from 'react'
import Modal from 'react-modal'
import ReactTooltip from 'react-tooltip'
import lowGas from '../../web3/getLowGas'
import utils from '../../components/utils'
import buyTicket from '../../web3/buyTicket'
import getPrizePool from '../../web3/getPrizePool'
import getTktPrice from '../../web3/getTicketPrice'
import loadingIcon from '../../images/loadingIconGrey.svg'
import NotConnectedInfo from '../../components/modals/notconnectedinfo'

export default class Saturdayentryform extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      key: null,
      txError: "",
      w3Con: "...",
      mounted: false,
      prizePool: "...",
      tktPrice: ". . .",
      txHash: "pending",
      safeLow: "pending",
      modalIsOpen: false,
      priceDol: "Exchange rate pending",
      prizeDol: "Exchange rate pending",
      n1: 1, n2: 2, n3: 3, n4: 4, n5: 5, n6: 6,
      n1Arr: [], n2Arr: [], n3Arr: [], n4Arr: [], n5Arr: [], n6Arr: []
    }
    this.openModal        = this.openModal.bind(this)
    this.closeModal       = this.closeModal.bind(this)
    this.handleChange     = this.handleChange.bind(this)
    this.sendTransaction  = this.sendTransaction.bind(this)
    this.getOptionsArrays = this.getOptionsArrays.bind(this)
    this.getPriceAndPrize = this.getPriceAndPrize.bind(this)
  }

  componentWillMount() {
    this.setState({mounted: true})
    if  (window.web3 !== null && window.web3 !== undefined && this.state.mounted && this.state.killDiv !== 1)
      this.setState({w3Con: window.web3.isConnected()})
  }

  componentDidMount() {
    this.getPriceAndPrize()
    this.getOptionsArrays()
  }

  componentWillUnmount() {
    this.setState({mounted: false})
  }

  openModal() {
    if (this.state.w3Con === true && window.web3 !== null && window.web3.isConnected() === true){//Eth connection good...
      if (this.state.tktPrice > 0 && window.ethAdd !== null){//Everything fine, buy ticket...

        lowGas().then(safeLow => {
          if (this.state.mounted) this.setState({safeLow: safeLow})
        }).catch (err => console.log('Error retrieving safe low gas rate: ', err))

        this.sendTransaction()

        if (this.state.mounted && this.props.killDiv !== 1) this.setState({modalIsOpen: true})
      } else {//Either tktPrice or ethAdd are missing...
        let txErr
        if (!(this.state.tktPrice > 0)) txErr = "Cannot retreive ticket price from the smart contract!"
        if (window.ethAdd === null) txErr = "Ethereum account address inaccessible!"
        if (window.web3.version.network > 1) txErr = 'Test network detected - please connect to the main ethereum network!'
        if (this.state.mounted && this.props.killDiv !== 1) this.setState({modalIsOpen: true, w3Con: true, txHash: null, txError: txErr})
      }
    } else {//No ethereum connection modal!
      if (this.state.mounted && this.props.killDiv !== 1) this.setState({modalIsOpen: true, w3Con: false, txHash: null})
    }
  }

  closeModal() {
    if (this.state.mounted && this.props.killDiv !== 1) this.setState({modalIsOpen: false, txHash: "pending"})//reset the txHash
    this.getPriceAndPrize()
  }

  getPriceAndPrize() {
    let p1 = getPrizePool("Saturday")
      , p2 = getTktPrice("Saturday")
    return Promise.all([p1, p2])
    .then(([prize,price]) => {
      let pool = window.web3.fromWei(prize, 'ether')
        , tkt  = window.web3.fromWei(price, 'ether')
        , poolDol = window.exRate > 0 ? 'Approximately $' + utils.toDecimals(window.exRate * pool, 2) : 'Exchange rate currently unavailable'
        , priceDol = window.exRate > 0 ? 'Approximately $' + utils.toDecimals(window.exRate * tkt, 2) : 'Exchange rate currently unavailable'
      if (this.state.mounted && this.props.killDiv !== 1) {
      this.setState({
        w3Con: true,
        tktPrice: tkt,
        prizePool: pool,
        poolDol: poolDol,
        priceDol: priceDol,
        key: Math.random()
      })
      ReactTooltip.rebuild()
    }
    }).catch(err => {
      console.log("Err in getPriceAndPrize: ", err)
      if (this.state.mounted && this.props.killDiv !== 1) {
        this.setState({w3Con: false})
      }//will pop up eth connection modal
    })
  }

  sendTransaction(){
    let eNums = [this.state.n1,this.state.n2,this.state.n3,this.state.n4,this.state.n5, this.state.n6]
    buyTicket("Saturday", window.ethAdd, eNums, this.state.tktPrice)
    .then(txHash => {
      if (this.state.mounted && this.props.killDiv !== 1) this.setState({txHash: txHash})
    }).catch(err =>{//will popup the error buying ticket modal
      if (this.state.mounted && this.props.killDiv !== 1) this.setState({w3Con: true, txHash: null})
    })
  }

  getOptionsArrays(changedNum, newNum){
    const selectedArr = [this.state.n1, this.state.n2, this.state.n3, this.state.n4, this.state.n5, this.state.n6]
    if (changedNum === "n1") selectedArr[0] = newNum
    if (changedNum === "n2") selectedArr[1] = newNum
    if (changedNum === "n3") selectedArr[2] = newNum
    if (changedNum === "n4") selectedArr[3] = newNum
    if (changedNum === "n5") selectedArr[4] = newNum
    if (changedNum === "n6") selectedArr[5] = newNum
    const allOptionsArr = []
    for (let j = 0; j < 6; j++){
      const optionsArr = []
      for (let i = 0; i < 49; i++){
        if (selectedArr.indexOf(i + 1) < 0) optionsArr.push(<option key={"num" + j + (i+1)}>{i + 1}</option>)
      }
      optionsArr.unshift(<option key={"num" + j + "0"}>{selectedArr[j]}</option>)
      allOptionsArr.push(optionsArr)
    }
    if(this.state.mounted)
      this.setState({
        n1Arr: allOptionsArr[0], n1: selectedArr[0],
        n2Arr: allOptionsArr[1], n2: selectedArr[1],
        n3Arr: allOptionsArr[2], n3: selectedArr[2],
        n4Arr: allOptionsArr[3], n4: selectedArr[3],
        n5Arr: allOptionsArr[4], n5: selectedArr[4],
        n6Arr: allOptionsArr[5], n6: selectedArr[5]
      })
  }

  handleChange(event) {
    this.getOptionsArrays(event.target.name, parseInt(event.target.value, 10))
  }

  render() {
    return (
      <div key={this.state.key}>

      {/* Render the entry form IF eth & address are good */}
      {(this.state.w3Con === true && window.ethAdd !== null && window.ethAdd !== undefined) &&
        <div className={"entryForm screen" + this.props.screenIndex}>

          <ReactTooltip className={"customTheme screen" + this.props.screenIndex} effect="solid" multiline={true} />

          <h2 className='prizePool' data-tip={this.state.poolDol}>
            Prizepool:
            <span className={"styledSpan largerFont screen" + this.props.screenIndex}>
              &nbsp;{this.state.prizePool}&nbsp;
            </span>
            Ether!
          </h2>

          <div className={"pickNumbersForm screen" + this.props.screenIndex}>
            <form className={"submitForm screen" + this.props.screenIndex} onChange={this.handleChange}>
              <label className='numberPicker'>
                <select className={"screen" + this.props.screenIndex} name="n1" id="n1" value={this.state.n1} onChange={this.handleChange}>{this.state.n1Arr}</select>
                <select className={"screen" + this.props.screenIndex} name="n2" id="n2" value={this.state.n2} onChange={this.handleChange}>{this.state.n2Arr}</select>
                <select className={"screen" + this.props.screenIndex} name="n3" id="n3" value={this.state.n3} onChange={this.handleChange}>{this.state.n3Arr}</select>
                <select className={"screen" + this.props.screenIndex} name="n4" id="n4" value={this.state.n4} onChange={this.handleChange}>{this.state.n4Arr}</select>
                <select className={"screen" + this.props.screenIndex} name="n5" id="n5" value={this.state.n5} onChange={this.handleChange}>{this.state.n5Arr}</select>
                <select className={"screen" + this.props.screenIndex} name="n6" id="n6" value={this.state.n6} onChange={this.handleChange}>{this.state.n6Arr}</select>
              </label>
            </form>
          </div>

          <div className={"entryButton screen" + this.props.screenIndex} onClick={() => this.openModal()}>

            {/* Ticket bought modal */}
            {this.state.w3Con === true &&

              <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                contentLabel="Ticket Bought Modal"
                className={"ticketBoughtModal screen" + this.props.screenIndex}
                overlayClassName={"Overlay screen" + this.props.screenIndex}
                shouldCloseOnOverlayClick={true}>

                {/* Modal whilst waiting for txHash to come in */}
                {(this.state.txHash === "pending") &&
                  <div>

                    <h2 className={"screen" + this.props.screenIndex}>
                      Ticket Purchase In Progress . . .
                    </h2>

                    <img className='loadingIcon' src={loadingIcon} style={{'margin':'0.8em 0 0 0'}} alt='Loading icon' />


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

                {/* Modal when txHash successfully comes in */}
                {(this.state.txHash !== null && this.state.txHash !== "pending") &&
                  <div>
                    <h2
                    className={"screen" + this.props.screenIndex}>
                      Ticket Bought - Good Luck!
                    </h2>
                    <p className='centred'>
                      Your transaction hash: <a
                        rel="noopener noreferrer"
                        target="_blank"
                        className={"screen" + this.props.screenIndex}
                        href={"https://etherscan.io/tx/" + this.state.txHash}>
                        {this.state.txHash.substring(0, 20) + ' . . .'}
                      </a>
                    </p>
                  </div>
                }

                {/* Modal for when there's an error buying the ticket */}
                {(this.state.txHash === null) &&
                  <div>
                    <h2 className={"screen" + this.props.screenIndex}>
                      Error buying ticket!
                    </h2>

                    {(this.state.txError !== "") &&
                      <p>
                        {this.state.txError}
                      </p>
                    }

                    {(this.state.txError === "") &&
                      <p className="centred justify">
                        You may have rejected the transaction, or your connection may have dropped. Please check your ethereum client and make sure your account is unlocked.
                      </p>
                    }

                  </div>
                }
              </Modal>
            }
          </div>

            <p className='ticketPrice centred' data-tip={this.state.priceDol} >
              Ticket Price:
              <span className={"styledSpan screen" + this.props.screenIndex}>
                &nbsp;{this.state.tktPrice}&nbsp;
              </span>
              Ether
            </p>

          </div>
         }

         {/* No entry form if no web3 connection OR eth address! */}
         {(this.state.w3Con === false || window.ethAdd === null || window.ethAdd === undefined) &&
          <div className="entryFormNotConnected">
            <p className={"centred styledSpan screen" + this.props.screenIndex}>
              No ethereum address detected!
              <br/>
              <a
                className={"centred screen" + this.props.screenIndex}
                style={{cursor: 'pointer'}}
                onClick={()=>this.openModal()}>
                Click here for connection issue solutions
              </a>
            </p>

            <Modal
             isOpen={this.state.modalIsOpen}
             onRequestClose={this.closeModal}
             contentLabel="No Ethereum Connection Modal"
             className={"welcomeModalNotConnected screen" + this.props.screenIndex}
             overlayClassName={"Overlay screen" + this.props.screenIndex}
             shouldCloseOnOverlayClick={true}>

              <NotConnectedInfo screenIndex={this.props.screenIndex}/>

              <p className="justify" style={{"padding" : "1em"}}>
                If you were connected before seeing this message, your connection may have dropped or you may have rejected a transaction. Please check your ethereum connection method. If you're using Metamask, please make sure you are signed in. If using Mist, please make sure you have an account connected and have authorized it to interact with the <span className={"styledSpan screen" + this.props.screenIndex}>Etheraffle</span> ÐApp.
              </p>
              <p>
                <a
                  className={"centred screen" + this.props.screenIndex}
                  style={{cursor: 'pointer'}}
                  onClick={()=>{window.location.reload()}}>
                  Click to reload.
                </a>
              </p>
            </Modal>
          </div>
        }
      </div>
    )
  }
}
