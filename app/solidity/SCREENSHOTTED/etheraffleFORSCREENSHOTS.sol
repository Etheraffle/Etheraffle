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




function buyTicket(uint[]  _cNums, address _entrant, uint _value, uint _affID)
  internal
{
    require
    (
        _cNums.length == 6 &&
        raffle[week].timeStamp > 0 &&
        now < raffle[week].timeStamp + rafEnd &&
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
    LogTicketBought(/* Params... */);
}







  contract FreeLOTInterface {
      function balanceOf(address who) constant public returns (uint) {}
      function destroy(address _from, uint _amt) external {}
  }

  contract etheraffleUpgrade {
      function addToPrizePool() payable external {}
  }

  contract Etheraffle is etheraffleUpgrade, FreeLOTInterface, usingOraclize {
      using strings for *;



      bool    public paused;
      address public ethRelief;
      address public etheraffle;
      address public disburseAddr;
      uint    public take         = 150;
      uint    public gasAmt       = 500000;
      uint    public rafEnd       = 500400;
      uint    public wdrawBfr     = 6048000;
      uint    public gasPrc       = 20000000000;
      uint    public tktPrice     = 2000000000000000;
      uint    public oracCost     = 1500000000000000;
      uint[]  public pctOfPool    = [520, 114, 47, 319];





      uint    public resultsDelay = 3600;
      uint    public matchesDelay = 3600;
      uint  constant weekDur      = 604800;
      uint  constant birthday     = 1500249600;//Etheraffle's birthday <3

      FreeLOTInterface freeLOT;

      string randomStr1 = "[URL] ['json(https://api.random.org/json-rpc/1/invoke).result.random[\"data\", \"serialNumber\"]','\\n{\"jsonrpc\": \"2.0\",\"method\":\"generateSignedIntegers\",\"id\":\"";
      string randomStr2 = "\",\"params\":{\"n\":\"6\",\"min\":1,\"max\":49,\"replacement\":false,\"base\":10,\"apiKey\":${[decrypt] BLGjqi8YDscitYWOO3dmIBX+FQeh5TeiXcQKNtLLRfcgM3jnIuLPw31h7EYrLVWxcBdYnRCy5OAx3FfDxbndfMcbxN1bdFRXlXDvJ2CxY/SWEwvnRhye528SNsODszMkW6mEqAmGviI96WGOQN3+NISiUKNgJvKM4A==}}']";
      string apiStr1 = "[URL] ['json(https://etheraffle.com/api/e).m','{\"r\":\"";
      string apiStr2 = "\",\"k\":${[decrypt] BCKbXUXljSMpw9aSf/i+rOi9KMIonp75Fy4QiJEu28BSOHU4n62Fu55E94B1M7TSHc0j3P3Km/M6mtCjMa3qmkMjT34C+jB8r3XzbPWkXPg64aRbhcxKoB9Y+T9CNCCrxhgPUPRT}}']";




      bool    public paused;
      address public ethRelief;
      address public etheraffle;
      address public disburseAddr;
      uint    public take      = 150;
      uint    public gasAmt    = 500000;
      uint    public rafEnd    = 507600;
      uint    public wdrawBfr  = 6048000;
      uint    public gasPrc    = 20000000000;
      uint    public tktPrice  = 2000000000000000;
      uint    public oracCost  = 1500000000000000;
      uint[]  public pctOfPool = [520, 114, 47, 319];





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
      function Etheraffle(address _freeLOT, address _dsbrs, address _msig, address _ethRelief) payable {
          week         = getWeek();
          etheraffle   = _msig;
          disburseAddr = _dsbrs;
          ethRelief    = _ethRelief;
          freeLOT      = FreeLOTInterface(_freeLOT);
          uint delay   = (week * weekDur) + birthday + rafEnd + resultsDelay;
          raffle[week].timeStamp = (week * weekDur) + birthday - (weekDur / 7);
          bytes32 query = oraclize_query(delay, "nested", strConcat(randomStr1, uint2str(getWeek()), randomStr2), gasAmt);
          qID[query].weekNo = week;
          qID[query].isRandom = true;
          LogQuerySent(query, delay, now);
      }






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
              week = newWeek;]






              raffle[weekNo].timeStamp = birthday + (weekNo * weekDur)







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



      function buyTicket(uint[]  _cNums, address _entrant, uint _value, uint _affID) internal {
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
          LogTicketBought(week, raffle[week].numEntries, _entrant, _cNums,
          raffle[week].entries[_entrant].length, _value, now, _affID);
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
              now - raffle[_week].timeStamp > weekDur - (weekDur / 7) &&
              now - raffle[_week].timeStamp < wdrawBfr &&
              raffle[_week].wdrawOpen == true &&
              raffle[_week].entries[msg.sender][_entryNum - 1].length == 6
          );
          // ...






          //...
          uint matches = getMatches(_week, msg.sender, _entryNum);
          require
          (
              matches >= 3 &&
              raffle[_week].winAmts[matches - 3] > 0 &&
              raffle[_week].winAmts[matches - 3] <= this.balance
          );
          raffle[_week].entries[msg.sender][_entryNum - 1].push(0);
          raffle[_week].unclaimed -= raffle[_week].winAmts[matches - 3];
          msg.sender.transfer(raffle[_week].winAmts[matches - 3]);
          LogWithdraw(/* Params... */);
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
          uint oracTot = 2 * ((gasAmt * gasPrc) + oracCost);
          prizePool -= oracTot;
          uint profit;
          if(raffle[_week].numEntries > 0) {
              profit = ((raffle[_week].numEntries - raffle[_week].freeEntries) * tktPrice * take) / 1000;
              prizePool -= profit;
              uint half = profit / 2;
              disburseAddr.transfer(half);
              ethRelief.transfer(profit - half);
              LogFundsDisbursed(/* Params... */);
              LogFundsDisbursed(/* Params... */);
              return;
          }
          LogFundsDisbursed(/* Params... */);
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
       *        winning numbers recieved from random.org into the raffle
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
        LogOraclizeCallback(/* Params... */);
        reclaimUnclaimed();
        disburseFunds(qID[_myID].weekNo);
        setWinningNumbers(qID[_myID].weekNo, _result);
        //Prepare & send next Oraclize query...
    }



      function __callback(bytes32 _myID, string _result) onlyIfNotPaused {
          require(msg.sender == oraclize_cbAddress());
          LogOraclizeCallback(/*  Params... */);
          newRaffle();
          setPayOuts(qID[_myID].weekNo, _result);
          //Prepare & send next Oraclize query...
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



       function setPayOuts(uint _week, string _result) internal {
           /* Code converting results  string to uint array... */
          uint[] memory payOuts = new uint[](4);
           uint total;
           for(i = 0; i < 4; i++) {
               if(numWinnersInt[i] != 0) {
                   payOuts[i] = (prizePool * pctOfPool[i]) / (numWinnersInt[i] * 1000);
                   total += payOuts[i] * numWinnersInt[i];
               }
           }
           raffle[_week].unclaimed = total;
           prizePool -= raffle[_week].unclaimed;
           for(i = 0; i < payOuts.length; i++) {
               raffle[_week].winAmts.push(payOuts[i]);
           }
           raffle[_week].wdrawOpen = true;
           LogPrizePoolsUpdated(/* Params... */);
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
       * @dev   Set the EthRelief contract address, in case of future updrades.
       *        Only allable by the Etheraffle address.
       *
       * @param _newAddr   New address of the EthRelief contract.
       */
      function setEthRelief(address _newAddr) onlyEtheraffle external {
          ethRelief = _newAddr;
      }
      /**
       * @dev   Set the dividend contract address, in case of future updrades.
       *        Only callable by the Etheraffle address.
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
          week        = 0;
          gasAmt      = 0;
          apiStr1     = "";
          prizePool   = 0;
          randomStr1  = "";
          upgraded    = now;
          upgradeAddr = _newAddr;
          uint amt    = prizePool;
          require(this.balance >= amt);
          etheraffleUpgrade newCont = etheraffleUpgrade(_newAddr);
          newCont.addToPrizePool.value(amt)();
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

pragma solidity^0.4.15;

contract ReceiverInterface {
    function receiveEther() external payable {}
}

contract EtheraffleDisbursal is ReceiverInterface {

    bool    upgraded;
    address etheraffle;
    /**
     * @dev  Modifier to prepend to functions rendering them
     *       only callable by the Etheraffle multisig address.
     */
    modifier onlyEtheraffle() {
        require(msg.sender == etheraffle);
        _;
    }
    event LogUpgrade(address toWhere, uint amountTransferred, uint atTime);
    /**
     * @dev   Constructor - sets the etheraffle var to the Etheraffle
     *        managerial multisig account.
     *
     * @param _etheraffle   The Etheraffle multisig account
     */
    function EtheraffleDisbursal(address _etheraffle) {
        etheraffle = _etheraffle;
    }
    /**
     * @dev   Upgrade function transferring all this contract's ether
     *        via the standard receive ether function in the proposed
     *        new disbursal contract.
     *
     * @param _addr    The new disbursal contract address.
     */



    function upgrade(address _addr) onlyEtheraffle external {
        upgraded = true;
        LogUpgrade(_addr, this.balance, now);
        ReceiverInterface(_addr).receiveEther.value(this.balance)();
    }




    /**
     * @dev   Standard receive ether function, forward-compatible
     *        with proposed future disbursal contract.
     */


    event LogEtherReceived(address fromWhere, uint howMuch, uint atTime);

    function receiveEther() payable external {
        LogEtherReceived(msg.sender, msg.value, now);
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
     * @dev   selfDestruct - used here to delete this placeholder contract
     *        and forward any funds sent to it on to the final disbursal
     *        contract once it is fully developed. Only callable by the
     *        Etheraffle multisig.
     *
     * @param _addr   The destination address for any ether herein.
     */
    function selfDestruct(address _addr) onlyEtheraffle {
        require(upgraded);
        selfdestruct(_addr);
    }
    /**
     * @dev   Fallback function that accepts ether and announces its
     *        arrival via an event.
     */
    function () payable external {
    }
}
/*
Main Chain

0x3bfb12ed112aB833F275Dbf622b7CacC4CBF092b

[{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"upgrade","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newAddr","type":"address"}],"name":"setEtheraffle","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"receiveEther","outputs":[],"payable":true,"type":"function"},{"inputs":[{"name":"_etheraffle","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fromWhere","type":"address"},{"indexed":false,"name":"howMuch","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogEtherReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"toWhere","type":"address"},{"indexed":false,"name":"amountTransferred","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogUpgrade","type":"event"}]



Rinkeby
var disbAdd = '0xf58ea2ed7d5748e0a251c1752e6cf644e3aea122'
var disbABI = eth.contract([{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"upgrade","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"receiveEther","outputs":[],"payable":true,"type":"function"},{"inputs":[{"name":"_etheraffle","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fromWhere","type":"address"},{"indexed":false,"name":"howMuch","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogEtherReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"toWhere","type":"address"},{"indexed":false,"name":"amountTransferred","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogUpgrade","type":"event"}])
var disb = disbABI.at(disbAdd)
*/



function castVote() external {
    if(LOT.frozen() && isValid()) {
        logVote(/* Params... */);
        sendReward(msg.sender);
        return;
    } else if(!LOT.frozen() && isValid()) {
        LOT.setFrozen(true);
        LogFreezing(/* Params... */w);
        logVote(/* Params... */);
        sendReward(msg.sender);
        return;
    }
    //...



    //...
    else if(LOT.frozen() && !isValid()) {
        LOT.setFrozen(false);
        LogFreezing/* Params... */);
        FreeLOT.mint(msg.sender, free);
        uint y = getQuarter() > 0 ? getYear() : getYear() - 1;
        uint q = getQuarter() > 0 ? getQuarter() - 1 : 4;
        uint amt = redeemed[y][q];
        if(amt > 0) {
            redeemed[y][q] = 0;
            EthRelief.receiveEther.value(amt);
            LogDonation(/* Params... */;
            return;
        }
        LogDonation(/* Params... */);
        return;
    }
}
