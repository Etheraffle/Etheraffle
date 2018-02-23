pragma solidity^0.4.15;

import "github.com/Arachnid/solidity-stringutils/strings.sol";
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";
/*

IF RE DEPLOYING, DOM'T SET A CUSTOM GAS PRICE - ORACLIZE SORT IT OUT APPARENTLY - done
ANY MORE USEFUL FUNCTIONS TO ADD? - done (functioned out the pause stuff)
LOOK AT TXS ON CHAIN TO SEE THE PRICE OF THE CALLBACK FUNCTION - done, averages 480 000 highest
WHY DID IT ERROR OVER THE WEEKEND? GET ALL EVENTS TO SEE IF LOGFUNDS DISBURSED HAPPENED?

IF NEW CONTRACT NEEDED, MAYBE FUNCTION OUT THE EVENTS LIKE THE ORACLIE CALL BACK SO IT'LL AT LEAST RUN OVER THAT EVEN SUCCESFULLY VIA A FUNCTION AND SO THE CALLBACK WILL GET LOGGED EVEN IF THE FOLLOWING LOGIC FAILS

The disbursal can underflow! Fix in later update?
Check other maths too?Especially anything that subtracts from prizepool. Have it perform check then continue or pause the contract depending on outcome.

When prizepools allow, do a millionairre maker every week? Random number drawn pointing toward am entrant?
(100000 is biggest randomORg can do so that doesn't work - THINK)

TODO: SEND ETH WITH CONTRACT CREATION SO FIRST ORACLE CALL WORKS!

TODO: Set Etheraffle contract as destroyer to allow the free entry mechanism to work!

Rinkeby Deploy string:
"0x11c646018576a1c0102a4e1c55b3f97250b35c5b", "0x77ba9a1343b549879394d201514211fa5a8a1b08", "0xB608678520EE8b741759B6DE187939dEE3514906", "0x917fd46a742482ff0be4d22ba90fe30e7e061f16"


Main Chain Deploy string (_freeLOT, _dsbrs, _msig, _ethRelief)
"0x4c388dce25665ea602b92f15718ca278bba45a9a","0xfb6dD07FE7D471f8aCa03a442f8175F64f1AE991","0x79BD7d159aBA396B68d714aF62E954FDEF09D16A","0x882F0D9c4504Ee176114Ba6D94859BC47d684557"

USE NEW ENCRYPTION STRINGS!!

*/

  contract FreeLOTInterface {
      function balanceOf(address who) constant public returns (uint) {}
      function destroy(address _from, uint _amt) external {}
  }

  contract EtheraffleUpgrade {
      function addToPrizePool() payable external {}
  }

  contract ReceiverInterface {
      function receiveEther() external payable {}
  }

  contract Etheraffle is EtheraffleUpgrade, FreeLOTInterface, ReceiverInterface, usingOraclize {
      using strings for *;

      uint    public week;
      bool    public paused;
      uint    public upgraded;
      uint    public prizePool;
      address public ethRelief;
      address public etheraffle;
      address public upgradeAddr;
      address public disburseAddr;
      uint    public take         = 150;//ppt
      uint    public gasAmt       = 550000;
      uint    public gasPrc       = 20000000000;//20 gwei


      uint    public rafEnd       = (4 * 24*60*60) + (13*60*60) + (10*60);



      uint    public tktPrice     = 2000000000000000;
      uint    public oracCost     = 1500000000000000;//$1 @ $700
      uint    public wdrawBfr     = 6048000;
      uint[]  public pctOfPool    = [520, 114, 47, 319];//ppt...
      uint    public resultsDelay = 60;//3600;
      uint    public matchesDelay = 60;//3600;
      uint  constant weekDur      = 604800;
      uint  constant birthday     = 1500249600;//Etheraffle's birthday <3

      FreeLOTInterface freeLOT;

      string randomStr1 = "[URL] ['json(https://api.random.org/json-rpc/1/invoke).result.random[\"data\", \"serialNumber\"]','\\n{\"jsonrpc\": \"2.0\",\"method\":\"generateSignedIntegers\",\"id\":\"";
      string randomStr2 = "\",\"params\":{\"n\":\"6\",\"min\":1,\"max\":49,\"replacement\":false,\"base\":10,\"apiKey\":${[decrypt] BAUyXozHTXPcvn9DsMo7Hx9pmJc3Z7lEQGpOCa9AsCgpoUBTLY1+3sEF2YOa+vcL5ZYdqemLodZerUNlbAkj56EWlGv4KHQB1eEM2CWVJS8Eq7PKqVj6Xt1iRRsAmOrtfEcM1RYUjp1RrCQ86Abx3nOtMNVqCbQ8Vw==}}']";
      string apiStr1 = "[URL] ['json(https://etheraffle.com/api/e).m','{\"r\":\"";
      string apiStr2 = "\",\"k\":${[decrypt] BPVph2hX+jr5tMZP3t+pagpm1XOd272R9IBFHpO3XILL5iN0HYbVbjFvsVfhwYOWNIaFjFVc+wit7OthhrUGAe6eWd4KFLfHtuA6OuFR0WiMEuqaG8kORv/ZVlWeIlXdQIOv64SN}}']";

      mapping (uint => rafStruct) public raffle;
      struct rafStruct {
          mapping (address => uint[][]) entries;
          uint unclaimed;
          uint[] winNums;
          uint[] winAmts;
          uint timeStamp;
          bool wdrawOpen;
          uint numEntries;
          uint freeEntries;
      }

      mapping (bytes32 => qIDStruct) public qID;
      struct qIDStruct {
          uint weekNo;
          bool isRandom;
          bool isManual;
      }
      /**
      * @dev  Modifier to prepend to functions adding the additional
      *       conditional requiring caller of the method to be the
      *       etheraffle address.
      */
      modifier onlyEtheraffle() {
          require(msg.sender == etheraffle);
          _;
      }
      /**
      * @dev  Modifier to prepend to functions adding the additional
      *       conditional requiring the paused bool to be false.
      */
      modifier onlyIfNotPaused() {
          require(!paused);
          _;
      }
      event LogFunctionsPaused(uint identifier, uint atTime);
      event LogQuerySent(bytes32 queryID, uint dueAt, uint sendTime);
      event LogReclaim(uint indexed fromRaffle, uint amount, uint atTime);
      event LogUpgrade(address newContract, uint ethTransferred, uint atTime);
      event LogPrizePoolAddition(address fromWhom, uint howMuch, uint atTime);
      event LogOraclizeCallback(bytes32 queryID, string result, uint indexed forRaffle, uint atTime);
      event LogFundsDisbursed(uint indexed forRaffle, uint oraclizeTotal, uint amount, address indexed toAddress, uint atTime);
      event LogWithdraw(uint indexed forRaffle, address indexed toWhom, uint forEntryNumber, uint matches, uint amountWon, uint atTime);
      event LogWinningNumbers(uint indexed forRaffle, uint numberOfEntries, uint[] wNumbers, uint currentPrizePool, uint randomSerialNo, uint atTime);
      event LogTicketBought(uint indexed forRaffle, uint indexed entryNumber, address indexed theEntrant, uint[] chosenNumbers, uint personalEntryNumber, uint tktCost, uint atTime, uint affiliateID);
      event LogPrizePoolsUpdated(uint newMainPrizePool, uint indexed forRaffle, uint unclaimedPrizePool, uint threeMatchWinAmt, uint fourMatchWinAmt, uint fiveMatchWinAmt, uint sixMatchwinAmt, uint atTime);
      /**
       * @dev   Constructor - sets the Etheraffle contract address &
       *        the disbursal contract address for investors, calls
       *        the newRaffle() function with sets the current
       *        raffle ID global var plus sets up the first raffle's
       *        struct with correct time stamp. Sets the withdraw
       *        before time to a ten week period, and prepares the
       *        initial oraclize call which will begin the recursive
       *        function.
       *
       * @param _freeLOT    The address of the Etheraffle FreeLOT special token.
       * @param _dsbrs      The address of the Etheraffle disbursal contract.
       * @param _msig       The address of the Etheraffle managerial multisig wallet.
       * @param _ethRelief  The address of the EthRelief charity contract.
       */

       //RINKEBY DEPLOY STR:
       //"0x11c646018576a1c0102a4e1c55b3f97250b35c5b","0xf58ea2ed7d5748e0a251c1752e6cf644e3aea122","0xb608678520ee8b741759b6de187939dee3514906","0xefbf9dd742049eb10489ad5621f368bbddf5ca73"

      function Etheraffle(address _freeLOT, address _dsbrs, address _msig, address _ethRelief) payable {
          week         = getWeek();
          etheraffle   = _msig;
          disburseAddr = _dsbrs;
          ethRelief    = _ethRelief;
          freeLOT      = FreeLOTInterface(_freeLOT);
          uint delay   = (week * weekDur) + birthday + rafEnd + resultsDelay;
          raffle[week].timeStamp = (week * weekDur) + birthday;// - (weekDur / 7);
          bytes32 query = oraclize_query(1518786600, "nested", strConcat(randomStr1, uint2str(getWeek()), randomStr2), gasAmt);
          qID[query].weekNo = week;
          qID[query].isRandom = true;
          LogQuerySent(query, delay, now);
      }
      function boom() {
        selfdestruct(etheraffle);
      }
      /**
       * @dev   Function using Etheraffle's birthday to calculate the
       *        week number since then.
       */
      function getWeek() public constant returns (uint) {
          uint curWeek = (now - birthday) / weekDur;
          if (now - ((curWeek * weekDur) + birthday) > rafEnd) {
              curWeek++;
          }
          return curWeek;
      }
      /**
       * @dev   Function which gets current week number and if different
       *        from the global var week number, it updates that and sets
       *        up the new raffle struct. Should only be called once a
       *        week after the raffle is closed. Should it get called
       *        sooner, the contract is paused for inspection.
       */
      function newRaffle() internal {
          uint newWeek = getWeek();
          if(newWeek == week) {
              pauseContract(4);
              return;
          } else {//∴ new raffle...
              week = newWeek;
              raffle[newWeek].timeStamp = birthday + (newWeek * weekDur);// - (weekDur / 7);
          }
      }
      /**
       * @dev  To pause the contract's functions should the need arise. Internal.
       *       Logs an event of the pausing.
       *
       * @param _id    A uint to identify the caller of this function.
       */
      function pauseContract(uint _id) internal {
        paused = true;
        LogFunctionsPaused(_id, now);
      }
      /**
       * @dev  Function to enter the raffle. Requires the caller to send ether
       *       of amount greater than or equal to the ticket price.
       *
       * @param _cNums    Ordered array of entrant's six selected numbers.
       * @param _affID    Affiliate ID of the source of this entry.
       */
      function enterRaffle(uint[] _cNums, uint _affID) payable external onlyIfNotPaused {
          require(msg.value >= tktPrice);
          buyTicket(_cNums, msg.sender, msg.value, _affID);
      }
      /**
       * @dev  Function to enter the raffle for free. Requires the caller's
       *       balance of the Etheraffle freeLOT token to be greater than
       *       zero. Function destroys one freeLOT token, increments the
       *       freeEntries variable in the raffle struct then purchases the
       *       ticket.
       *
       * @param _cNums    Ordered array of entrant's six selected numbers.
       * @param _affID    Affiliate ID of the source of this entry.
       */
      function enterFreeRaffle(uint[] _cNums, uint _affID) payable external onlyIfNotPaused {
          freeLOT.destroy(msg.sender, 1);
          raffle[week].freeEntries++;
          buyTicket(_cNums, msg.sender, msg.value, _affID);
      }
      /**
       * @dev   Function to buy tickets. Internal. Requires the entry number
       *        array to be of length 6, requires the timestamp of the current
       *        raffle struct to have been set, and for this time this function
       *        is call to be before the end of the raffle. Then requires that
       *        the chosen numbers are ordered lowest to highest & bound between
       *        1 and 49. Function increments the total number of entries in the
       *        current raffle's struct, increments the prize pool accordingly
       *        and pushes the chosen number array into the entries map and then
       *        logs the ticket purchase.
       *
       * @param _cNums       Array of users selected numbers.
       * @param _entrant     Entrant's ethereum address.
       * @param _value       The ticket purchase price.
       * @param _affID       The affiliate ID of the source of this entry.
       */
      function buyTicket
      (
          uint[]  _cNums,
          address _entrant,
          uint    _value,
          uint    _affID
      )
          internal
      {
          require
          (
              _cNums.length == 6 &&
              raffle[week].timeStamp > 0 &&
              now - raffle[week].timeStamp < rafEnd &&
              0         < _cNums[0] &&
              _cNums[0] < _cNums[1] &&
              _cNums[1] < _cNums[2] &&
              _cNums[2] < _cNums[3] &&
              _cNums[3] < _cNums[4] &&
              _cNums[4] < _cNums[5] &&
              _cNums[5] <= 49
          );
          raffle[week].numEntries++;
          prizePool += _value;
          raffle[week].entries[_entrant].push(_cNums);
          LogTicketBought(week, raffle[week].numEntries, _entrant, _cNums, raffle[week].entries[_entrant].length, _value, now, _affID);
      }
      /**
       * @dev Withdraw Winnings function. User calls this function in order to withdraw
       *      whatever winnings they are owed. Function can be paused via the modifier
       *      function "onlyIfNotPaused"
       *
       * @param _week        Week number of the raffle the winning entry is from
       * @param _entryNum    The entrants entry number into this raffle
       */
      function withdrawWinnings(uint _week, uint _entryNum) onlyIfNotPaused external {
          require
          (
              raffle[_week].timeStamp > 0 &&
              //change here, adding an extra day to withdraw time to make it start Sunday 00:00 following draw...
              now - raffle[_week].timeStamp > weekDur - (weekDur / 7) &&

              now - raffle[_week].timeStamp < wdrawBfr &&
              raffle[_week].wdrawOpen == true &&
              raffle[_week].entries[msg.sender][_entryNum - 1].length == 6
          );
          uint matches = getMatches(_week, msg.sender, _entryNum);
          require
          (
              matches >= 3 &&
              raffle[_week].winAmts[matches - 3] > 0 &&
              raffle[_week].winAmts[matches - 3] <= this.balance
          );
          raffle[_week].entries[msg.sender][_entryNum - 1].push(0);
          if(raffle[_week].winAmts[matches - 3] <= raffle[_week].unclaimed) {
              raffle[_week].unclaimed -= raffle[_week].winAmts[matches - 3];
          } else {
              raffle[_week].unclaimed = 0;
              pauseContract(5);
          }
          msg.sender.transfer(raffle[_week].winAmts[matches - 3]);
          LogWithdraw(_week, msg.sender, _entryNum, matches, raffle[_week].winAmts[matches - 3], now);
      }

      /**
       * @dev    Called by the weekly oraclize callback. Checks raffle 10
       *         weeks older than current raffle for any unclaimed prize
       *         pool. If any found, returns it to the main prizePool and
       *         zeros the amount.
       */
      function reclaimUnclaimed() internal {
          uint old = getWeek() - 11;
          prizePool += raffle[old].unclaimed;
          LogReclaim(old, raffle[old].unclaimed, now);
      }
      /**
       * @dev  Function totals up oraclize cost for the raffle, subtracts
       *       it from the prizepool (if less than, if greater than if
       *       pauses the contract and fires an event). Calculates profit
       *       based on raffle's tickets sales and the take percentage,
       *       then forwards that amount of ether to the disbursal contract.
       *
       * @param _week   The week number of the raffle in question.
       */
      function disburseFunds(uint _week) internal {
          uint oracTot = 2 * ((gasAmt * gasPrc) + oracCost);//2 queries per draw...
          if(oracTot > prizePool) {
            pauseContract(1);
            return;
          }
          prizePool -= oracTot;
          uint profit;
          if(raffle[_week].numEntries > 0) {
              profit = ((raffle[_week].numEntries - raffle[_week].freeEntries) * tktPrice * take) / 1000;
              prizePool -= profit;
              uint half = profit / 2;
              ReceiverInterface(disburseAddr).receiveEther.value(half)();
              ReceiverInterface(ethRelief).receiveEther.value(profit - half)();
              LogFundsDisbursed(_week, oracTot, profit - half, ethRelief, now);
              LogFundsDisbursed(_week, oracTot, half, disburseAddr, now);
              return;
          }
          LogFundsDisbursed(_week, oracTot, profit, 0, now);
          return;
      }
      /**
       * @dev   The Oralize call back function. The oracalize api calls are
       *        recursive. One to random.org for the draw and the other to
       *        the Etheraffle api for the numbers of matches each entry made
       *        against the winning numbers. Each calls the other recursively.
       *        The former when calledback closes and reclaims any unclaimed
       *        prizepool from the raffle ten weeks previous to now. Then it
       *        disburses profit to the disbursal contract, then it sets the
       *        winning numbers received from random.org into the raffle
       *        struct. Finally it prepares the next oraclize call. Which
       *        latter callback first sets up the new raffle struct, then
       *        sets the payouts based on the number of winners in each tier
       *        returned from the api call, then prepares the next oraclize
       *        query for a week later to draw the next raffle's winning
       *        numbers.
       *
       * @param _myID     bytes32 - Unique id oraclize provides with their
       *                            callbacks.
       * @param _result   string - The result of the api call.
       */
      function __callback(bytes32 _myID, string _result) onlyIfNotPaused {
          require(msg.sender == oraclize_cbAddress());
          LogOraclizeCallback(_myID, _result, qID[_myID].weekNo, now);
          if(qID[_myID].isRandom == true){//460,241 gas per etherscan tx: 0xf4a93ae7e1620adfe619b043128f9fb70016a43da1313f64a943354a4f5d683b
              reclaimUnclaimed();
              disburseFunds(qID[_myID].weekNo);
              setWinningNumbers(qID[_myID].weekNo, _result);
              if(qID[_myID].isManual == true) { return; }
              bytes32 query = oraclize_query(matchesDelay, "nested", strConcat(apiStr1, uint2str(qID[_myID].weekNo), apiStr2), gasAmt);
              qID[query].weekNo = qID[_myID].weekNo;
              LogQuerySent(query, matchesDelay + now, now);
          } else {//is api callback
              newRaffle();//Sets up next raffle ∴ setting its stamp to following mon...
              setPayOuts(qID[_myID].weekNo, _result);
              if(qID[_myID].isManual == true) { return; }
              uint delay = (getWeek() * weekDur) + birthday + rafEnd + resultsDelay;//by now the week should be next...
              query = oraclize_query(delay, "nested", strConcat(randomStr1, uint2str(getWeek()), randomStr2), gasAmt);
              qID[query].weekNo = getWeek();//should be next weeks ID by now..
              qID[query].isRandom = true;//for next week's draw...
              LogQuerySent(query, delay, now);
          }
      }
      /**
       * @dev   Slices a string according to specified delimiter, returning
       *        the sliced parts in an array.
       *
       * @param _string   The string to be sliced.
       */
      function stringToArray(string _string) internal returns (string[]) {
          var str    = _string.toSlice();
          var delim  = ",".toSlice();
          var parts  = new string[](str.count(delim) + 1);
          for(uint i = 0; i < parts.length; i++) {
              parts[i] = str.split(delim).toString();
          }
          return parts;
      }
      /**
       * @dev   Takes oraclize random.org api call result string and splits
       *        it at the commas into an array, parses those strings in that
       *        array as integers and pushes them into the winning numbers
       *        array in the raffle's struct. Fires event logging the data,
       *        including the serial number of the random.org callback so
       *        its veracity can be proven.
       *
       * @param _week    The week number of the raffle in question.
       * @param _result   The results string from oraclize callback.
       */
      function setWinningNumbers(uint _week, string _result) internal {
          string[] memory arr = stringToArray(_result);
          for(uint i = 0; i < arr.length; i++){
              raffle[_week].winNums.push(parseInt(arr[i]));
          }
          uint serialNo = parseInt(arr[6]);
          LogWinningNumbers(_week, raffle[_week].numEntries, raffle[_week].winNums, prizePool, serialNo, now);
      }

      /**
       * @dev   Takes the results of the oraclize Etheraffle api call back
       *        and uses them to calculate the prizes due to each tier
       *        (3 matches, 4 matches etc) then pushes them into the winning
       *        amounts array in the raffle in question's struct. Calculates
       *        the total winnings of the raffle, subtracts it from the
       *        global prize pool sequesters that amount into the raffle's
       *        struct "unclaimed" variable, ∴ "rolling over" the unwon
       *        ether. Enables winner withdrawals by setting the withdraw
       *        open bool to true.
       *
       * @param _week    The week number of the raffle in question.
       * @param _result  The results string from oraclize callback.
       */
      function setPayOuts(uint _week, string _result) internal {//197,927 gas...
          string[] memory numWinnersStr = stringToArray(_result);
          if(numWinnersStr.length < 4) {
            pauseContract(2);
            return;
          }
          uint[] memory numWinnersInt = new uint[](4);
          for (uint i = 0; i < 4; i++) {
              numWinnersInt[i] = parseInt(numWinnersStr[i]);
          }
          uint[] memory payOuts = new uint[](4);
          uint total;
          for(i = 0; i < 4; i++) {
              if(numWinnersInt[i] != 0) {
                  payOuts[i] = (prizePool * pctOfPool[i]) / (numWinnersInt[i] * 1000);
                  total += payOuts[i] * numWinnersInt[i];
              }
          }
          raffle[_week].unclaimed = total;
          if(raffle[_week].unclaimed > prizePool) {
            pauseContract(3);
            return;
          }
          prizePool -= raffle[_week].unclaimed;
          for(i = 0; i < payOuts.length; i++) {
              raffle[_week].winAmts.push(payOuts[i]);
          }
          raffle[_week].wdrawOpen = true;
          LogPrizePoolsUpdated(prizePool, _week, raffle[_week].unclaimed, payOuts[0], payOuts[1], payOuts[2], payOuts[3], now);
      }
      /**
       * @dev   Function compares array of entrant's 6 chosen numbers to
        *       the raffle in question's winning numbers, counting how
        *       many matches there are.
        *
        * @param _week         The week number of the Raffle in question
        * @param _entrant      Entrant's ethereum address
        * @param _entryNum     number of entrant's entry in question.
       */
      function getMatches(uint _week, address _entrant, uint _entryNum) constant internal returns (uint) {
          uint matches;
          for(uint i = 0; i < 6; i++) {
              for(uint j = 0; j < 6; j++) {
                  if(raffle[_week].entries[_entrant][_entryNum - 1][i] == raffle[_week].winNums[j]) {
                      matches++;
                      break;
                  }
              }
          }
          return matches;
      }
      /**
       * @dev     Manually make an Oraclize API call, incase of automation
       *          failure. Only callable by the Etheraffle address.
       *
       * @param _delay      Either a time in seconds before desired callback
       *                    time for the API call, or a future UTC format time for
       *                    the desired time for the API callback.
       * @param _week       The week number this query is for.
       * @param _isRandom   Whether or not the api call being made is for
       *                    the random.org results draw, or for the Etheraffle
       *                    API results call.
       * @param _isManual   The Oraclize call back is a recursive function in
       *                    which each call fires off another call in perpetuity.
       *                    This bool allows that recursiveness for this call to be
       *                    turned on or off depending on caller's requirements.
       */
      function manuallyMakeOraclizeCall
      (
          uint _week,
          uint _delay,
          bool _isRandom,
          bool _isManual
      )
          onlyEtheraffle external
      {
          string memory weekNumStr = uint2str(_week);
          if(_isRandom == true){
              bytes32 query = oraclize_query(_delay, "nested", strConcat(randomStr1, weekNumStr, randomStr2), gasAmt);
              qID[query].weekNo   = _week;
              qID[query].isRandom = true;
              qID[query].isManual = _isManual;
          } else {
              query = oraclize_query(_delay, "nested", strConcat(apiStr1, weekNumStr, apiStr2), gasAmt);
              qID[query].weekNo   = _week;
              qID[query].isManual = _isManual;
          }
      }
      /**
       * @dev Set the gas relevant price parameters for the Oraclize calls, in case
       *      of future needs for higher gas prices for adequate transaction times,
       *      or incase of Oraclize price hikes. Only callable be the Etheraffle
       *      address.
       *
       * @param _newAmt    uint - new allowed gas amount for Oraclize.
       * @param _newPrice  uint - new gas price for Oraclize.
       * @param _newCost   uint - new cose of Oraclize service.
       *
       */
      function setGasForOraclize
      (
          uint _newAmt,
          uint _newCost,
          uint _newPrice
      )
          onlyEtheraffle external
      {
          gasAmt   = _newAmt;
          oracCost = _newCost;
          if(_newPrice > 0) {
              oraclize_setCustomGasPrice(_newPrice);
              gasPrc = _newPrice;
          }
      }
      /**
       * @dev    Set the Oraclize strings, in case of url changes. Only callable by
       *         the Etheraffle address  .
       *
       * @param _newRandomHalfOne       string - with properly escaped characters for
       *                                the first half of the random.org call string.
       * @param _newRandomHalfTwo       string - with properly escaped characters for
       *                                the second half of the random.org call string.
       * @param _newEtheraffleHalfOne   string - with properly escaped characters for
       *                                the first half of the EtheraffleAPI call string.
       * @param _newEtheraffleHalfTwo   string - with properly escaped characters for
       *                                the second half of the EtheraffleAPI call string.
       *
       */
      function setOraclizeString
      (
          string _newRandomHalfOne,
          string _newRandomHalfTwo,
          string _newEtheraffleHalfOne,
          string _newEtheraffleHalfTwo
      )
          onlyEtheraffle external
      {
          randomStr1 = _newRandomHalfOne;
          randomStr2 = _newRandomHalfTwo;
          apiStr1    = _newEtheraffleHalfOne;
          apiStr2    = _newEtheraffleHalfTwo;
      }
      /**
       * @dev   Set the ticket price of the raffle. Only callable by the
       *        Etheraffle address.
       *
       * @param _newPrice   uint - The desired new ticket price.
       *
       */
      function setTktPrice(uint _newPrice) onlyEtheraffle external {
          tktPrice = _newPrice;
      }
      /**
       * @dev    Set new take percentage. Only callable by the Etheraffle
       *         address.
       *
       * @param _newTake   uint - The desired new take, parts per thousand.
       *
       */
      function setTake(uint _newTake) onlyEtheraffle external {
          take = _newTake;
      }
      /**
       * @dev     Set the payouts manually, in case of a failed Oraclize call.
       *          Only callable by the Etheraffle address.
       *
       * @param _week         The week number of the raffle to set the payouts for.
       * @param _numMatches   Number of matches. Comma-separated STRING of 4
       *                      integers long, consisting of the number of 3 match
       *                      winners, 4 match winners, 5 & 6 match winners in
       *                      that order.
       */
      function setPayouts(uint _week, string _numMatches) onlyEtheraffle external {
          setPayOuts(_week, _numMatches);
      }
      /**
       * @dev   Set the FreeLOT token contract address, in case of future updrades.
       *        Only allable by the Etheraffle address.
       *
       * @param _newAddr   New address of FreeLOT contract.
       */
      function setFreeLOT(address _newAddr) onlyEtheraffle external {
          freeLOT = FreeLOTInterface(_newAddr);
        }
      /**
       * @dev   Set the EthRelief contract address. Only allable by the
       *        Etheraffle address.
       *
       * @param _newAddr   New address of the EthRelief contract.
       */
      function setEthRelief(address _newAddr) onlyEtheraffle external {
          ethRelief = _newAddr;
      }
      /**
       * @dev   Set the dividend contract address. Only callable by the
       *        Etheraffle multisig address.
       *
       * @param _newAddr   New address of dividend contract.
       */
      function setDisbursingAddr(address _newAddr) onlyEtheraffle external {
          disburseAddr = _newAddr;
      }
      /**
       * @dev   Set the Etheraffle multisig contract address, in case of future
       *        upgrades. Only callable by the current Etheraffle address.
       *
       * @param _newAddr   New address of Etheraffle multisig contract.
       */
      function setEtheraffle(address _newAddr) onlyEtheraffle external {
          etheraffle = _newAddr;
      }
      /**
       * @dev     Set the raffle end time, in number of seconds passed
       *          the start time of 00:00am Monday. Only callable by
       *          the Etheraffle address.
       *
       * @param _newTime    The time desired in seconds.
       */
      function setRafEnd(uint _newTime) onlyEtheraffle external {
          rafEnd = _newTime;
      }
      /**
       * @dev     Set the wdrawBfr time - the time a winner has to withdraw
       *          their winnings before the unclaimed prizepool is rolled
       *          back into the global prizepool. Only callable by the
       *          Etheraffle address.
       *
       * @param _newTime    The time desired in seconds.
       */
      function setWithdrawBeforeTime(uint _newTime) onlyEtheraffle external {
          wdrawBfr = _newTime;
      }
      /**
       * @dev     Set the paused status of the raffles. Only callable by
       *          the Etheraffle address.
       *
       * @param _status    The desired status of the raffles.
       */
      function setPaused(bool _status) onlyEtheraffle external {
          paused = _status;
      }
      /**
       * @dev     Set the percentage-of-prizepool array. Only callable by the
       *          Etheraffle address.
       *
       * @param _newPoP     An array of four integers totalling 1000.
       */
      function setPercentOfPool(uint[] _newPoP) onlyEtheraffle external {
          pctOfPool = _newPoP;
      }
      /**
       * @dev     Get a entrant's number of entries into a specific raffle
       *
       * @param _week       The week number of the queried raffle.
       * @param _entrant    The entrant in question.
       */
      function getUserNumEntries(address _entrant, uint _week) constant external returns (uint) {
          return raffle[_week].entries[_entrant].length;
      }
      /**
       * @dev     Get chosen numbers of an entrant, for a specific raffle.
       *          Returns an array.
       *
       * @param _entrant    The entrant in question's address.
       * @param _week       The week number of the queried raffle.
       * @param _entryNum   The entrant's entry number in this raffle.
       */
      function getChosenNumbers(address _entrant, uint _week, uint _entryNum) constant external returns (uint[]) {
          return raffle[_week].entries[_entrant][_entryNum-1];
      }
      /**
       * @dev     Get winning details of a raffle, ie, it's winning numbers
       *          and the prize amounts. Returns two arrays.
       *
       * @param _week   The week number of the raffle in question.
       */
      function getWinningDetails(uint _week) constant external returns (uint[], uint[]) {
          return (raffle[_week].winNums, raffle[_week].winAmts);
      }
      /**
       * @dev     Upgrades the Etheraffle contract. Only callable by the
       *          Etheraffle address. Calls an addToPrizePool method as
       *          per the abstract contract above. Function renders the
       *          entry method uncallable, cancels the Oraclize recursion,
       *          then zeroes the prizepool and sends the funds to the new
       *          contract. Sets a var tracking when upgrade occurred and logs
       *          the event.
       *
       * @param _newAddr   The new contract address.
       */
      function upgradeContract(address _newAddr) onlyEtheraffle external {
          require(upgraded == 0 && upgradeAddr == address(0));
          uint amt    = prizePool;
          upgradeAddr = _newAddr;
          upgraded    = now;
          week        = 0;//no struct for this raffle ∴ no timestamp ∴ no entry possible
          prizePool   = 0;
          gasAmt      = 0;//will arrest the oraclize recursive function
          apiStr1     = "";
          randomStr1  = "";
          require(this.balance >= amt);
          //EtheraffleUpgrade newCont = EtheraffleUpgrade(_newAddr);
          //newCont.addToPrizePool.value(amt)();
          EtheraffleUpgrade(_newAddr).addToPrizePool.value(amt)();

          LogUpgrade(_newAddr, amt, upgraded);
      }
      /**
       * @dev     Self destruct contract. Only callable by Etheraffle address.
       *          function. It deletes all contract code and data and forwards
       *          any remaining ether from non-claimed winning raffle tickets
       *          to the EthRelief charity contract. Requires the upgrade contract
       *          method to have been called 10 or more weeks prior, to allow
       *          winning tickets to be claimed within the usual withdrawal time
       *          frame.
       */
      function selfDestruct() onlyEtheraffle external {
          require(now - upgraded > weekDur * 10);
          selfdestruct(ethRelief);
      }
      /**
       * @dev     Function allowing manual addition to the global prizepool.
       *          Requires the caller to send ether.
       */
      function addToPrizePool() payable external {
          require(msg.value > 0);
          prizePool += msg.value;
          LogPrizePoolAddition(msg.sender, msg.value, now);
      }
      /**
       * @dev   Fallback function.
       */
      function () payable external {}
}
/*

tx: https://etherscan.io/tx/0x80442248da98f556d12c0c722583fb40831ee871f89b9273f7da5b18125214d1

var raffleAdd = '0x7C34B881789D670B0eDE217D9Eaf69aC784Cc101'
var raffleABI = eth.contract([{"constant":true,"inputs":[{"name":"_week","type":"uint256"}],"name":"getWinningDetails","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ethRelief","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"gasAmt","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_cNums","type":"uint256[]"},{"name":"_affID","type":"uint256"}],"name":"enterRaffle","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"pctOfPool","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"upgradeAddr","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_week","type":"uint256"},{"name":"_delay","type":"uint256"},{"name":"_isRandom","type":"bool"},{"name":"_isManual","type":"bool"}],"name":"manuallyMakeOraclizeCall","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"take","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newTime","type":"uint256"}],"name":"setRafEnd","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_status","type":"bool"}],"name":"setPaused","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_myID","type":"bytes32"},{"name":"_result","type":"string"}],"name":"__callback","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newPoP","type":"uint256[]"}],"name":"setPercentOfPool","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newTime","type":"uint256"}],"name":"setWithdrawBeforeTime","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newAddr","type":"address"}],"name":"setEthRelief","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newPrice","type":"uint256"}],"name":"setTktPrice","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"result","type":"string"},{"name":"proof","type":"bytes"}],"name":"__callback","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newAddr","type":"address"}],"name":"setFreeLOT","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"week","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newAddr","type":"address"}],"name":"setDisbursingAddr","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newRandomHalfOne","type":"string"},{"name":"_newRandomHalfTwo","type":"string"},{"name":"_newEtheraffleHalfOne","type":"string"},{"name":"_newEtheraffleHalfTwo","type":"string"}],"name":"setOraclizeString","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newAmt","type":"uint256"},{"name":"_newCost","type":"uint256"},{"name":"_newPrice","type":"uint256"}],"name":"setGasForOraclize","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"resultsDelay","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"prizePool","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newAddr","type":"address"}],"name":"setEtheraffle","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getWeek","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"etheraffle","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newTake","type":"uint256"}],"name":"setTake","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_week","type":"uint256"},{"name":"_numMatches","type":"string"}],"name":"setPayouts","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"wdrawBfr","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_amt","type":"uint256"}],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_cNums","type":"uint256[]"},{"name":"_affID","type":"uint256"}],"name":"enterFreeRaffle","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"_entrant","type":"address"},{"name":"_week","type":"uint256"},{"name":"_entryNum","type":"uint256"}],"name":"getChosenNumbers","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"oracCost","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"addToPrizePool","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"rafEnd","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tktPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"matchesDelay","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"upgraded","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"raffle","outputs":[{"name":"unclaimed","type":"uint256"},{"name":"timeStamp","type":"uint256"},{"name":"wdrawOpen","type":"bool"},{"name":"numEntries","type":"uint256"},{"name":"freeEntries","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_week","type":"uint256"},{"name":"_entryNum","type":"uint256"}],"name":"withdrawWinnings","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_entrant","type":"address"},{"name":"_week","type":"uint256"}],"name":"getUserNumEntries","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"disburseAddr","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newAddr","type":"address"}],"name":"upgradeContract","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"qID","outputs":[{"name":"weekNo","type":"uint256"},{"name":"isRandom","type":"bool"},{"name":"isManual","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"gasPrc","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_freeLOT","type":"address"},{"name":"_dsbrs","type":"address"},{"name":"_msig","type":"address"},{"name":"_ethRelief","type":"address"}],"payable":true,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"identifier","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogFunctionsPaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"queryID","type":"bytes32"},{"indexed":false,"name":"dueAt","type":"uint256"},{"indexed":false,"name":"sendTime","type":"uint256"}],"name":"LogQuerySent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"fromRaffle","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogReclaim","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newContract","type":"address"},{"indexed":false,"name":"ethTransferred","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogUpgrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fromWhom","type":"address"},{"indexed":false,"name":"howMuch","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogPrizePoolAddition","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"queryID","type":"bytes32"},{"indexed":false,"name":"result","type":"string"},{"indexed":true,"name":"forRaffle","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogOraclizeCallback","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"forRaffle","type":"uint256"},{"indexed":false,"name":"oraclizeTotal","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":true,"name":"toAddress","type":"address"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogFundsDisbursed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"forRaffle","type":"uint256"},{"indexed":true,"name":"toWhom","type":"address"},{"indexed":false,"name":"forEntryNumber","type":"uint256"},{"indexed":false,"name":"matches","type":"uint256"},{"indexed":false,"name":"amountWon","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"forRaffle","type":"uint256"},{"indexed":false,"name":"numberOfEntries","type":"uint256"},{"indexed":false,"name":"wNumbers","type":"uint256[]"},{"indexed":false,"name":"currentPrizePool","type":"uint256"},{"indexed":false,"name":"randomSerialNo","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogWinningNumbers","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"forRaffle","type":"uint256"},{"indexed":true,"name":"entryNumber","type":"uint256"},{"indexed":true,"name":"theEntrant","type":"address"},{"indexed":false,"name":"chosenNumbers","type":"uint256[]"},{"indexed":false,"name":"personalEntryNumber","type":"uint256"},{"indexed":false,"name":"tktCost","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"},{"indexed":false,"name":"affiliateID","type":"uint256"}],"name":"LogTicketBought","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newMainPrizePool","type":"uint256"},{"indexed":true,"name":"forRaffle","type":"uint256"},{"indexed":false,"name":"unclaimedPrizePool","type":"uint256"},{"indexed":false,"name":"threeMatchWinAmt","type":"uint256"},{"indexed":false,"name":"fourMatchWinAmt","type":"uint256"},{"indexed":false,"name":"fiveMatchWinAmt","type":"uint256"},{"indexed":false,"name":"sixMatchwinAmt","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogPrizePoolsUpdated","type":"event"}])
var raffle = raffleABI.at(raffleAdd)
*/
