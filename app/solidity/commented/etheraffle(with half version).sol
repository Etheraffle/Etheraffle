pragma solidity^0.4.15;

import "github.com/Arachnid/solidity-stringutils/strings.sol";
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";
/*
Publish token contracts (half & free) & the disbursal and eth relief place hodler contracts BEFORE publishing this.


When prizepools allow, do a millionairre maker every week? Random number drawn pointing toward am entrant?
(100000 is biggest randomORg can do so that doesn't work - THINK)

For dev: set the oraclize call back to desired end time of test raffle, alter the raffle end time to the same time, then alter the two callback delays to a minute instead of an hour. Can change the recusrvie cycle forthe full week by hardcoding it in the call back function as the delay.

Also all event logs disappears. The only way to get them after suicide is to use etherum explorer, e.g. etherscan

can write a conract or people to withdraw their "free tickets" from it via afunction that checks them against their tier whatever thingy!

//TODO: SEND ETH WITH CONTRACT CREATION SO FIRST ORACLE CALL WORKS! - Also, change gas price AFTER contract is deployed
OR, DON'T SET THE ORACLE CALL OFF YET? Do it manually so that we can control the price of the first one better?

RINKEBY deply string :
"0x4b925069ab56fde24d5d7e60c5535633df605d0f","0xe0998820d4b82394b51d17bca7e5255d30a5e0b1", "0x74ec00c8f31644eaea2f7c964b3c544f4b76adb6", "0xB7Ea14973700361dc1cb5dF0bC513051D480437d", "0xcc5ff1557b667ee468ec8a01f88d2bcfef361c21"

*/
/* Abstract interface contracts for acquiring function signatures */

contract ERC223Interface {
    function balanceOf(address who) constant public returns (uint) {}
    function destroy(address _from, uint _amt) external {}
}

contract disbursalContract {
    function acceptFunds(uint _amt) payable external {}
}

contract etheraffleUpgrade {
    function addToPrizePool() payable external {}
}

contract Etheraffle is etheraffleUpgrade, ERC223Interface, usingOraclize {
    using strings for *;

    bool    public paused;
    bytes32 public curRafID;
    uint    public prizePool;
    address public ethRelief;
    address public etheraffle;
    address public upgradeAddr;
    address public disburseAddr;
    uint    public tktPrice = 5000000000000000;
    uint constant  weekDur  = 604800;
    uint constant  birthday = 1500249600;//Etheraffle's birthday <3
    uint take               = 150;//ppt
    uint rafEnd             = (2 * 24*60*60) + (14*60*60) + (1*60);//500400;
    uint gasAmt             = 550000;
    uint gasPrc             = 10000000000;//10 gwei
    uint oracCost           = 1500000000000000;//$1 @ $700
    uint wdrawBfr           = weekDur * 10;
    uint upgraded           = 0;
    uint[] pctOfPool        = [520, 114, 47, 319];//ppt...
    uint resultsDelay       = 60;//3600;//one hour in s
    uint matchesDelay       = 90;//3600;//ibid

    ERC223Interface halfLOT;
    ERC223Interface freeLOT;

    string randomStr1 = "[URL] ['json(https://api.random.org/json-rpc/1/invoke).result.random[\"data\", \"serialNumber\"]','\\n{\"jsonrpc\": \"2.0\",\"method\":\"generateSignedIntegers\",\"id\":\"";
    /* The API call string for the random.org for the results draw, second half */
    string randomStr2 = "\",\"params\":{\"n\":\"6\",\"min\":1,\"max\":49,\"replacement\":false,\"base\":10,\"apiKey\":${[decrypt] BLpFp6SZ/IklYeEAiVbY1HgMWI4CilsUGnzXLyBUeScu8T5RSDUIswqTeP9R5KHKbf/McV6Gf/nWpw5VGYf/7Vas2GzRv27AWO/yQZ3iAY4OpP03Ht60InAgtlaOCXjt3bEY4vbJjAb6Ta3AfyUdLJv+WCMjpPPy2A==}}']";
    string apiStr1 = "[URL] ['json(https://etheraffle.com/api/m).m','{\"r\":\"";
    string apiStr2 = "\",\"k\":${[decrypt] BBksqmEQSmK5cduuDRy7iCG93LuW+uLSiOokELDzhdDfMnimClmU1wDI1Jmzno6dPds15PeR+AGRkQy/cxYeb+RL1smVY8Y7IVYQMumGLKiXLeBh5JmMTBdzYxUmIh0QZZlGtlnh}}']";

    mapping (bytes32 => rafStruct) public raffle;
    struct rafStruct{
        mapping (address => uint[][]) entries;
        uint[] winNums;
        uint[] winAmts;
        uint timeStamp;
        uint unclaimed;
        bool wdrawOpen;
        uint numEntries;
        uint halfEntries;
        uint freeEntries;
    }

    mapping (bytes32 => qIDStruct) public qID;
    struct qIDStruct {
        bytes32 rafID;
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
        require(paused == false);
        _;
    }
    //event LogTicketRefund(bytes32 indexedforRaffle, address byWhom, uint entryNumber, uint atTime);
    event LogFunctionsPaused(uint identifier, uint atTime);
    event LogReclaim(bytes32 indexed fromRaffle, uint amount, uint atTime);
    event LogQuerySent(bytes32 queryID, uint dueAt, uint sendTime);
    event LogUpgrade(address newContract, uint ethTransferred, uint atTime);
    event LogFundsDisbursed(bytes32 indexed forRaffle, uint amount, address indexed toAddress, uint atTime);
    event LogOraclizeCallback(bytes32 queryID, string result, bytes32 indexed forRaffle, uint atTime);
    event LogWithdraw(bytes32 indexed forRaffle, address indexed toWhom, uint forEntryNumber, uint matches, uint amountWon, uint atTime);
    event LogWinningNumbers(bytes32 indexed forRaffle, uint numberOfEntries, uint[] wNumbers, uint currentPrizePool, uint randomSerialNo, uint atTime);
    event LogTicketBought(bytes32 indexed forRaffle, uint indexed entryNumber, address indexed theEntrant, uint[] chosenNumbers, uint personalEntryNumber, uint tktCost, uint atTime, uint affiliateID);
    event LogPrizePoolsUpdated(uint newMainPrizePool, bytes32 indexed forRaffle, uint unclaimedPrizePool, uint threeMatchWinAmt, uint fourMatchWinAmt, uint fiveMatchWinAmt, uint sixMatchwinAmt, uint atTime);
    /**
     * @dev   Constructor - sets the Etheraffle contract address &
     *        the disbursal contract address for investors, calls
     *        the getRafIDHash() function with sets the current
     *        raffle ID global var plus sets up the first raffle's
     *        struct with correct time stamp. Sets the withdraw
     *        before time to a ten week period, and prepares the
     *        initial oraclize call which will begin the recursive
     *        function.
     *
     * @param _halfLOT    The address of the Etheraffle HalfLOT special token.
     * @param _freeLOT    The address of the Etheraffle FreeLOT special token.
     * @param _dsbrs      The address of the Etheraffle disbursal contract.
     * @param _msig       The address of the Etheraffle managerial multisig wallet.
     * @param _ethRelief  The address of the EthRelief charity contract.
     */
    function Etheraffle(address _halfLOT, address _freeLOT, address _dsbrs, address _msig, address _ethRelief) payable {
        wdrawBfr     = week * 10;
        etheraffle   = _msig;
        disburseAddr = _dsbrs;
        ethRelief    = _ethRelief;
        curRafID     = getRafIDHash();
        halfLOT      = ERC223Interface(_halfLOT);
        freeLOT      = ERC223Interface(_freeLOT);
        //oraclize_setCustomGasPrice(10000000000);//10gwei
        raffle[curRafID].timeStamp = ((getWeek() * weekDur) + birthday);//Mon 00:00 week of deployment UTC
        uint delay = (getWeek() * weekDur) + birthday + rafEnd + resultsDelay;
        bytes32 query = oraclize_query(/* delay, */1513778400, "nested", strConcat(randomStr1, getRafIdStr(), randomStr2), gasAmt);
        qID[query].rafID = curRafID;
        qID[query].isRandom = true;
    }
    /**
     * @dev   Function using Etheraffle's birthday to find out the week number
     */
    function getWeek() public constant returns (uint) {
        uint week = (now - birthday) / weekDur;
        if (now - ((week * weekDur) + birthday) > rafEnd) {
            week++;
        }
        return week;
    }
    /**
     * @dev   Function which returns the keccak hash of the week
     *        number, used as a raffle ID. If resulting hash doesn't
     *        match the current raffle ID hash, it replaces it and
     *        instantiates the next raffle struct w/ correct timestamp.
     */
    function getRafIDHash() internal constant returns (bytes32) {
        uint    week  = getWeek();
        bytes32 rafID = keccak256(week);
        if(curRafID != rafID) {//∴ new raffle...
            curRafID = rafID;
            raffle[rafID].timeStamp = birthday + (week * weekDur);
        }
        return rafID;
    }
    /**
     * @dev Function which returns the week number as a string, in order to
     *      be used in Oraclize API calls
     *
     */
    function getRafIdStr() internal constant returns (string) {
        /*
        uint week = getWeek();
        string memory weekStr = uint2str(week);
        return weekStr;
        */
        return uint2str(getWeek());//?does this work?
    }

    //186,000 if not...//TEST ENTERING DECIMALS!! OR WORDS!! OR ANYTHING!
    /**
     * @dev  Function to enter the raffle. Requires the caller to send ether
     *       of amount greater than or equal to the ticket price.
     *
     * @param _cNums    Ordered array of entrant's six selected numbers.
     * @param _affID    Affiliate ID of the source of this entry.
     */
    function enterFullRaffle(uint[] _cNums, uint _affID) payable external onlyIfNotPaused {
        require(msg.value >= tktPrice);
        buyTicket(_cNums, msg.sender, msg.value, _affID);
    }
    /**
     * @dev  Function to enter the raffle for half price. Requires the
     *       caller to send ether of amount greater than or equal to
     *       half of the ticket price. Requires the caller's balance of
     *       the Etheraffle halfLOT token to be greater than zero. Funtion
     *       increments the halfPrice variable in the raffle struct then
     *       purchases the ticket.
     *
     * @param _cNums    Ordered array of entrant's six selected numbers.
     * @param _affID    Affiliate ID of the source of this entry.
     */
    function enterHalfRaffle(uint[] _cNums, uint _affID) payable external onlyIfNotPaused {
        require(
          msg.value >= tktPrice / 2 &&
          halfLOT.balanceOf(msg.sender) > 0);
        raffle[rafID].halfEntries++;
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
        raffle[rafID].freeEntries++;
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
            raffle[curRafID].timeStamp > 0 &&
            now - raffle[curRafID].timeStamp < rafEnd &&
            0         < _cNums[0] &&
            _cNums[0] < _cNums[1] &&
            _cNums[1] < _cNums[2] &&
            _cNums[2] < _cNums[3] &&
            _cNums[3] < _cNums[4] &&
            _cNums[4] < _cNums[5] &&
            _cNums[5] <= 49
        );
        raffle[curRafID].numEntries++;
        prizePool += _value;
        raffle[curRafID].entries[_entrant].push(_cNums);
        LogTicketBought(curRafID, raffle[curRafID].numEntries, _entrant, _cNums, raffle[curRafID].entries[_entrant].length, _value, now, _affID);
    }
    /**
     * @dev Withdraw Winnings function. User calls this function in order to withdraw
     *      whatever winnings they are owed. Function can be paused via the modifier
     *      function "onlyIfNotPaused"
     *
     * @param _rafID       RafID of the raffle the winning entry is from
     * @param _entryNum    The entrants entry number into this raffle
     */
    function withdrawWinnings(bytes32 _rafID, uint _entryNum) onlyIfNotPaused external {
        require
        (
            now - raffle[_rafID].timeStamp > raffle[_rafID].timeStamp &&// + weekDur &&//lose weekdur for testing
            now - raffle[_rafID].timeStamp < wdrawBfr &&
            raffle[_rafID].wdrawOpen == true &&
            raffle[_rafID].entries[msg.sender][_entryNum - 1].length == 6
        );
        uint matches = getMatches(_rafID, msg.sender, _entryNum);
        require
        (
            matches >= 3 &&
            raffle[_rafID].winAmts[matches - 3] > 0 &&
            raffle[_rafID].winAmts[matches - 3] <= raffle[_rafID].unclaimed
        );
        raffle[_rafID].entries[msg.sender][_entryNum - 1].push(0);
        raffle[_rafID].unclaimed -= raffle[_rafID].winAmts[matches - 3];
        msg.sender.transfer(raffle[_rafID].winAmts[matches - 3]);
        LogWithdraw(_rafID, msg.sender, _entryNum, matches, raffle[_rafID].winAmts[matches - 3], now);
    }
    /**
     * @dev   Refund function. Only callable if all conditions are met.
     *        Requires the contract functions to be paused and not due
     *        to a contract upgrade, refunds can only begin two weeks
     *        beyond the draw date of a raffle, refunds cannot be made
     *        once the withdraw before window closes, and the ticket to
     *        be refunded cannot already have been used to claim a win.
     *        Finally, the winning amounts all need to be zero, proving
     *        that the draw has indeed not occurred. Function checks the
     *        tktprice is covered in the raffle's sequstered funds, then
     *        pushes a zero onto the ticket in question's array rendering
     *        it unwithdraw/refundable in future, makes the ether transfer,
     *        then logs the event.
     *
     * @param _rafID    bytes32 - Raffle ID in question.
     * @param _entryNum uint - The entrant's entry number to be refunded.
     */
    /*
    function refundTicket(bytes32 _rafID, uint _entryNum) external {
        require
        (
            upgraded == 0 &&
            paused   == true &&
            now - raffle[_rafID].timeStamp > 1814400 &&//three weeks in s
            now - raffle[_rafID].timeStamp < wdrawBfr &&
            raffle[_rafID].entries[msg.sender][_entryNum - 1].length == 6 &&
            raffle[_rafID].unclaimed  >= tktPrice &&
            raffle[_rafID].wdrawOpen  == false &&
            raffle[_rafID].winAmts[0] == 0 &&
            raffle[_rafID].winAmts[1] == 0 &&
            raffle[_rafID].winAmts[2] == 0 &&
            raffle[_rafID].winAmts[3] == 0
        );
        raffle[_rafID].entries[msg.sender][_entryNum - 1].push(0);
        raffle[_rafID].unclaimed -= tktPrice;
        msg.sender.transfer(tktPrice);
        LogTicketRefund(_rafID, msg.sender, _entryNum, now);
    }
    */
    /**
     * @dev    Called by the weekly oraclize callback. Checks raffle 10
     *         weeks older than current raffle for any unclaimed prize
     *         pool. If any found, returns it to the main prizePool and
     *         zeros the amount.
     */
    function reclaimUnclaimed() internal {
        bytes32 oldID = keccak256(getWeek() - 11);
        if(raffle[oldID].unclaimed > 0) {
            prizePool += raffle[oldID].unclaimed;
            raffle[oldID].unclaimed = 0;
            LogReclaim(oldID, raffle[oldID].unclaimed, now);
            return;
        }
        LogReclaim(oldID, 0, now);
        return;
    }
    /**
     * @dev  Function totals up oraclize cost for the raffle, subtracts
     *       it from the prizepool (if less than, if greater than if
     *       pauses the contract and fires an event). Calculates profit
     *       based on raffle's tickets sales and the take percentage,
     *       then forwards that amount of ether to the disbursal contract.
     *
     * @param _rafID   bytes32 - The raffleID in question.
     */
    function disburseFunds(bytes32 _rafID) internal {
        uint oracTot = 2 * ((gasAmt * gasPrc) + oracCost);//2 queries per draw...
        if(oracTot > prizePool) {
          paused = true;
          gasAmt = 0;
          LogFunctionsPaused(1, now);
          return;
        }
        prizePool -= oracTot;
        uint profit;
        if(raffle[_rafID].numEntries > 0) {
            //profit = (raffle[_rafID].numEntries * tktPrice * take) / 100;
            profit =
              ((((raffle[rafID].numEntries - raffle[rafID].freeEntries - raffle[rafID].halfEntries) * tktPrice) + (raffle[rafID].halfEntries * (tktPrice / 2)))
              * take ) / 1000;
            prizePool -= profit;
            uint half = profit / 2;
            disburseAddr.transfer(half);
            ethRelief.transfer(profit - half);
            LogFundsDisbursed(_rafID, profit - half, ethRelief, now);
            LogFundsDisbursed(_rafID, half, disburseAddr, now);
            return;
        }
        LogFundsDisbursed(_rafID, profit, '0x', now);
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
    function __callback(bytes32 _myID, string _result) {
        require(msg.sender == oraclize_cbAddress());
        LogOraclizeCallback(_myID, _result, qID[_myID].rafID, now);
        if(qID[_myID].isRandom == true){//is random.org callback (this half more gas expensive: 500000ish)
            reclaimUnclaimed();
            disburseFunds(qID[_myID].rafID);
            setWinningNumbers(qID[_myID].rafID, _result);
            if(qID[_myID].isManual == true) { return; }
            //string memory rafIDStr = uint2str(getWeek());//week already rolled over so need this...
            bytes32 query = oraclize_query(matchesDelay, "nested", strConcat(apiStr1, getRafIdStr(), apiStr2), gasAmt);
            qID[query].rafID = qID[_myID].rafID;
            LogQuerySent(query, matchesDelay + now, now);
        } else {//is api callback
            getRafIDHash();//update raffleID ∴ setting its stamp to following mon...
            setPayOuts(qID[_myID].rafID, _result);
            if(qID[_myID].isManual == true) { return; }
            uint delay = (getWeek() * weekDur) + birthday + rafEnd + resultsDelay;//by now the week should be next...
            query = oraclize_query(delay, "nested", strConcat(randomStr1, getRafIdStr(), randomStr2), gasAmt);
            qID[query].rafID = curRafID;//should be next weeks ID by now..
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
     * @param _rafID    The raffleID in question.
     * @param _result   The results string from oraclize callback.
     */
    function setWinningNumbers(bytes32 _rafID, string _result) internal {
        string[] memory arr = stringToArray(_result);
        for(uint i = 0; i < arr.length; i++){
            raffle[_rafID].winNums.push(parseInt(arr[i]));
        }
        uint serialNo = parseInt(arr[6]);
        LogWinningNumbers(_rafID, raffle[_rafID].numEntries, raffle[_rafID].winNums, prizePool, serialNo, now);
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
     * @param _rafID    bytes32 - The raffleID in question.
     * @param _result   string - The results string from oraclize callback.
     */
    function setPayOuts(bytes32 _rafID, string _result) internal {//197,927 gas...
        string[] memory numWinnersStr = stringToArray(_result);
        if(numWinnersStr.length < 4) {
          paused = true;
          gasAmt = 0;
          LogFunctionsPaused(2, now);
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
        raffle[_rafID].unclaimed = total;
        if(raffle[_rafID].unclaimed > prizePool) {
          paused = true;
          gasAmt = 0;
          LogFunctionsPaused(3, now);
          return;
        }
        prizePool -= raffle[_rafID].unclaimed;
        for(i = 0; i < payOuts.length; i++) {
            raffle[_rafID].winAmts.push(payOuts[i]);
        }
        raffle[_rafID].wdrawOpen = true;
        LogPrizePoolsUpdated(prizePool, _rafID, raffle[_rafID].unclaimed, payOuts[0], payOuts[1], payOuts[2], payOuts[3], now);
    }
    /**
     * @dev   Function compares array of entrant's 6 chosen numbers to
      *       the raffle in question's winning numbers, counting how
      *       many matches there are.
      *
      * @param _rafID       bytes32 - Raffle ID in question
      * @param _entrant     address - Entrant's ethereum address
      * @param _entryNum    uint - number of entrant's entry in question.
     */
    function getMatches(bytes32 _rafID, address _entrant, uint _entryNum) constant internal returns (uint) {
        uint matches;
        for(uint i = 0; i < 6; i++) {
            for(uint j = 0; j < 6; j++) {
                if(raffle[_rafID].entries[_entrant][_entryNum - 1][i] == raffle[_rafID].winNums[j]) {
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
     * @param _delay      uint- Either a time in seconds before desired callback
     *                    time for the API call, or a future UTC format time for
     *                    the desired time for the API callback.
     * @param _weekNum    string - The week number this query is for.
     * @param _isRandom   bool - Whether or not the api call being made is for
     *                    the random.org results draw, or for the Etheraffle
     *                    API results call.
     * @param _isManual   bool - The Oraclize call back is a recursive function in
     *                    which each call fires off another call in perpetuity.
     *                    This bool allows that recursiveness for this call to be
     *                    turned on or off depending on caller's requirements.
     */
    function manuallyMakeOraclizeCall
    (
        uint _delay,
        uint _weekNum,
        bool _isRandom,
        bool _isManual
    )
        onlyEtheraffle external
    {
        string memory weekNumStr = uint2str(_weekNum);
        if(_isRandom == true){
            bytes32 query = oraclize_query(_delay, "nested", strConcat(randomStr1, weekNumStr, randomStr2), gasAmt);
            qID[query].rafID = keccak256(_weekNum);
            qID[query].isRandom = true;
            qID[query].isManual = _isManual;
        } else {
            query = oraclize_query(_delay, "nested", strConcat(apiStr1, weekNumStr, apiStr2), gasAmt);
            qID[query].rafID = keccak256(_weekNum);
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
     * @dev     Set the payouts manuall, in case of a failed Oraclize call.
     *          Only callable by the Etheraffle address.
     *
     * @param _rafID        bytes32 - RaffleID of raffle to set the payouts for.
     * @param _numMatches   string - Number of matches. Comma-separated STRING of 4
     *                      integers long, consisting of the number of 3 match
     *                      winners, 4 match winners, 5 & 6 match winners in
     *                      that order.
     */
    function setPayouts(bytes32 _rafID, string _numMatches) onlyEtheraffle external {
        setPayOuts(_rafID, _numMatches);
    }
    /**
     * @dev   Set the HalfLOT token contract address, in case of future updrades.
     *        Only allable by the Etheraffle address.
     *
     * @param _newAddr   New address of HalfLOT contract.
     */
    function setHalfLOT(address _newAddr) onlyEtheraffle external {
        halfLOT = ERC223Interface(_newAddr);
    }
    /**
     * @dev   Set the FreeLOT token contract address, in case of future updrades.
     *        Only allable by the Etheraffle address.
     *
     * @param _newAddr   New address of FreeLOT contract.
     */
    function setFreeLOT(address _newAddr) onlyEtheraffle external {
        freeLOT = ERC223Interface(_newAddr);
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
     * @param _rafID      The rafID of the queried raffle.
     * @param _entrant    The entrant in question.
     */
    function getUserNumEntries(address _entrant, bytes32 _rafID) constant external returns (uint) {
        return raffle[_rafID].entries[_entrant].length;
    }
    /**
     * @dev     Get chosen numbers of an entrant, for a specific raffle.
     *          Returns an array.
     *
     * @param _entrant    The entrant in question's address.
     * @param _rafID      The raffle ID of the queried raffle.
     * @param _entryNum   The entrant's entry number in this raffle.
     */
    function getChosenNumbers(address _entrant, bytes32 _rafID, uint _entryNum) constant external returns (uint[]) {
        return raffle[_rafID].entries[_entrant][_entryNum-1];
    }
    /**
     * @dev     Get winning details of a raffle, ie, it's winning numbers
     *          and the prize amounts. Returns two arrays.
     *
     * @param _rafID   The raffle ID of the raffle in question.
     */
    function getWinningDetails(bytes32 _rafID) constant external returns (uint[], uint[]) {
        return (raffle[_rafID].winNums, raffle[_rafID].winAmts);
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
        gasAmt      = 0;//will arrest the oraclize recursive function
        curRafID    = keccak256(0);//no struct for this raffle ∴ no timestamp ∴ no entry possible
        uint amt    = prizePool;
        upgraded    = now;
        prizePool   = 0;
        upgradeAddr = _newAddr;
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
        selfdestruct(ethRelief);//(disburseAddr);?
    }
    /**
     * @dev     Function allowing manual addition to the global prizepool.
     *          Requires the caller to send ether.
     */
    function addToPrizePool() payable external {
        require(msg.value > 0);
        prizePool += msg.value;
    }
    /**
     * @dev   Fallback function, reverting accidental ether transfers.
     */
    function () payable external {
        revert();
    }
    ///////////////////////////////////////////////////////////////////////////////////
    //////////For Dev stuff////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    //TODO: DELETE!
    function destroyEtheraffle() onlyEtheraffle {
      selfdestruct(etheraffle);
    }
}
