pragma solidity^0.4.15;
import "github.com/Arachnid/solidity-stringutils/strings.sol";
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";
/*
Have like a dividend pool? Ticket token holders send their full balance of tkt tokens to here,
it calculates their share of eth and returns both transactions?

When prizepools allow, do a millionairre maker every week? Random number drawn pointing toward am entrant?
(100000 is biggest randomORg can do so that doesn't work - THINK)

Maybe have website show Saturday, Wednesday and Scracth (or something) and have those two "Coming soon...!"

Shorten names for everything.

Supply contract with some eth to run first oraclize queries in case of few entries...don't add to prizePool

transfer will throw exception on failure and revert all changes...

timestamps on raffle are set IN FUTURE, ie, the next Mon 00:00. Overflow on now - timeStamp = big positive number??
Sorted - anything calling this value is done as a range, ie > something && < something...

Easy way to alter raffle end time so I can test a daily version?
*/

contract Etheraffle is usingOraclize{//4,830,000gas...(with optimise enabled..)
    using strings for *;

    /* Tkt price in wei */
    //uint public tktPrice = 10000000000000000;

    //TESTING
    uint public tktPrice = 5000000000000000;

    uint public prizePool;
    uint constant birthday = 1500249600;//Etheraffle's birthday <3
    uint constant weekDur = 604800;
    /* Time in seconds from Monday 00:00am UTC that the raffle closes (Sat 7pm) */
    //uint raffleEndTime  = 500400;//TODO: Reinstate!

    //TESTING
    uint raffleEndTime = (2 * 24*60*60) + (23*60*60) + (1*60);//
    uint resultsDelay = 60;//
    uint matchesDelay = 90;//

    /* Delay between the raffle end time and the Oraclize call for the results draw */
    //uint resultsDelay = 3600;//TODO: Reinstate!
    uint withdrawBefore = weekDur * 10;
    uint gasForOraclize = 520000;
    uint gasPriceForOraclize = 10000000000;
    uint costOfOraclize = 350000000000000;
    uint forDisbursing = 10;




    uint[] percentOfPool = [520, 114, 47, 319];




    address public etheraffle;
    address public disbursingContract;
    //address public charityContract;
    /*  */
    //address public editContract;//the contract used to alter vars, controlled by investors...
    bytes32 public currentRaffleID;
    bytes32 previousRaffleID;
    /* The API call string for random.org for the results draw, first half */
    string randomStr1 = "[URL] ['json(https://api.random.org/json-rpc/1/invoke).result.random[\"data\", \"serialNumber\"]','\\n{\"jsonrpc\": \"2.0\",\"method\":\"generateSignedIntegers\",\"id\":\"";
    /* The API call string for the random.org for the results draw, second half */
    string randomStr2 = "\",\"params\":{\"n\":\"6\",\"min\":1,\"max\":49,\"replacement\":false,\"base\":10,\"apiKey\":${[decrypt] BLpFp6SZ/IklYeEAiVbY1HgMWI4CilsUGnzXLyBUeScu8T5RSDUIswqTeP9R5KHKbf/McV6Gf/nWpw5VGYf/7Vas2GzRv27AWO/yQZ3iAY4OpP03Ht60InAgtlaOCXjt3bEY4vbJjAb6Ta3AfyUdLJv+WCMjpPPy2A==}}']";
    /* The API call string for Etheraffle's API, called to count number of winners. First half */
    string apiStr1 = "[URL] ['json(http://128.199.49.146:3000/api/m).m','{\"r\":\"";
    /* The API call string for Etheraffle's API, called to count number of winners. Second half */
    string apiStr2 = "\",\"k\":${[decrypt] BBksqmEQSmK5cduuDRy7iCG93LuW+uLSiOokELDzhdDfMnimClmU1wDI1Jmzno6dPds15PeR+AGRkQy/cxYeb+RL1smVY8Y7IVYQMumGLKiXLeBh5JmMTBdzYxUmIh0QZZlGtlnh}}']";
    bool public functionsPaused;


    mapping (address => bytes32[])    public entrant;
    mapping (bytes32 => raffleStruct) public raffle;
    struct raffleStruct{
        mapping (address => uint[][]) entries;
        uint[] winningNumbers;
        uint[] winningAmounts;
        uint timeStamp;
        uint unclaimedPrizePool;
        uint numEntries;
        bool isWithdrawOpen;
    }



    mapping (bytes32 => queryIDStruct) public queryIDMap;
    struct queryIDStruct{
      bytes32 raffleID;
      bool isRandomCall;
      bool isManualCall;
    }



    modifier onlyEtheraffle(){
        require(msg.sender == etheraffle);
        _;
    }
    modifier onlyIfUnpaused(){
        require(functionsPaused == false);
        _;
    }
    //event LogTicketRefund(bytes32 forRaffle, address byWhom, uint entryNumber, uint atTime);
    event LogQuerySent(bytes32 qID, uint timeDelay, uint sendTime);
    event LogRolledOverPrizePool(bytes32 fromRaffle, uint amount, uint atTime);
    event LogFundsDisbursed(bytes32 forRaffle, uint amount, address toAddress, uint atTime);
    event LogOraclizeCallback(bytes32 queryID, string result, bytes32 forRaffle, uint atTime);
    event LogSuccessfulWithdraw(bytes32 indexed forRaffle, address indexed toWhom, uint forEntryNumber, uint matches, uint amountWon, uint atTime);
    event LogWinningNumbers(bytes32 indexed forRaffle, uint numberOfEntries, uint[] wNumbers, uint currentPrizePool, uint randomSerialNo, uint atTime);
    event LogTicketBought(bytes32 indexed forRaffle, uint indexed entryNumber, address indexed theEntrant, uint[] chosenNumbers, uint personalEntryNumber, uint atTime, uint affiliateID);
    event LogPrizePoolsUpdated(uint newMainPrizePool, bytes32 raffleID, uint unclaimedPrizePool, uint threeMatchWin, uint fourMatchWin, uint fiveMatchWin, uint sixMatchwin, uint atTime);
    /**
     * @dev Constructor
     */
    //SEND ETH WITH CONTRACT CREATION SO FIRST ORACLE CALL WORKS!
    //alter disbursal contract address!
    function Etheraffle() payable {
        etheraffle = msg.sender;
        disbursingContract = msg.sender;
        currentRaffleID = getRaffleIDHash();
        withdrawBefore = week * 10;
        //oraclize_setCustomGasPrice(10000000000);//10 gwei
        raffle[currentRaffleID].timeStamp = ((getWeek() * weekDur) + birthday);//will set first raffleID timestamp to Monday 00:00am of week of deployment...
        ///*Call back to come in one hour after raffleID ticks over (thereby closing raffle...)
        uint delay = (getWeek() * weekDur) + birthday + raffleEndTime + resultsDelay;
        bytes32 queryID = oraclize_query(1511391639, "nested", strConcat(randomStr1, getRaffleIDStr(), randomStr2), 520000);
        queryIDMap[queryID].raffleID = currentRaffleID;
        queryIDMap[queryID].isRandomCall = true;
        //*/
    }
    /**
     * @dev Function using Etheraffle's birthday to find out the week number
     *
     * @returns The number of weeks since Etheraffle's birthday as an integer
     */




    function getWeek() internal constant returns (uint) {
        uint week = (now - birthday) / weekDur;
        if (now - ((week * weekDur) + birthday) > raffleEndTime) {
            week++;
        }
        return week;
    }






    /**
     * @dev Function which returns the keccak hash of the week number, used
     *      as a raffle ID.
     *
     * @returns   bytes32 - the hash of the week number integer
     */
    function getRaffleIDHash() internal constant returns (bytes32){
        uint week = getWeek();
        bytes32 raffleIDHash = keccak256(week);
        if(currentRaffleID != raffleIDHash){//∴ new raffle...
            previousRaffleID = currentRaffleID;
            currentRaffleID = raffleIDHash;
            raffle[raffleIDHash].timeStamp = birthday + (week * weekDur);
        }
        return raffleIDHash;
    }
    /**
     * @dev Function which returns the week number as a string, in order to
     *      be used in Oraclize API calls
     *
     * @returns The current week number as a string
     */
    function getRaffleIDStr() internal constant returns (string) {
        uint week = getWeek();
        string memory weekStr = uint2str(week);
        //return uint2str(getWeek());//?
        return weekStr;
    }
    /**
     * @dev The Raffle Entry function. Requires 6 chosen numbers, in ascending
     *      numerical order, bound between 1 and 49. Function stores entrants
     *      selected numbers, stores the raffleID under the entrant's entry map,
     *      increments the prize pool and number of entries and finally logs the
     *      ticket purchase. Entry is automatically into whatever the currently
     *      running raffle is.
     *
     * @param _one    Entrant's first chosen number
     * @param _two    Entrant's second chosen number
     * @param _three  Entrant's third chosen number
     * @param _four   Entrant's fourth chosen number
     * @param _five   Entrant's fifth chosen number
     * @param _six    Entrant's sixth chosen number
     */
    //271,000 gas if new entrant :/ 186,000 if not...//TEST ENTERING DECIMALS!! OR WORDS!! OR ANYTHING!



    function enterRaffle
    (
        uint _one,
        uint _two,
        uint _three,
        uint _four,
        uint _five,
        uint _six,
        uint _affID
    )
        onlyIfUnpaused payable external





    {
        require
        (
            msg.value >= tktPrice &&
            raffle[currentRaffleID].timeStamp > 0 &&
            now - raffle[currentRaffleID].timeStamp < raffleEndTime &&
            0 < _one &&
            _one < _two &&
            _two < _three &&
            _three < _four &&
            _four < _five &&
            _five < _six &&
            _six <= 49
        );





        uint[] memory chosenNumbers = new uint[](6);
        chosenNumbers[0] = _one;
        chosenNumbers[1] = _two;
        chosenNumbers[2] = _three;
        chosenNumbers[3] = _four;
        chosenNumbers[4] = _five;
        chosenNumbers[5] = _six;
        if
        (
            entrant[msg.sender].length == 0 ||
            entrant[msg.sender][entrant[msg.sender].length - 1] != currentRaffleID
        )
        {
            entrant[msg.sender].push(currentRaffleID);
        }
        raffle[currentRaffleID].numEntries++;
        prizePool += msg.value;
        raffle[currentRaffleID].entries[msg.sender].push(chosenNumbers);
        LogTicketBought(params...);





    }





    /**
     * @dev Withdraw Winnings function. User calls this function in order to withdraw
     *      whatever winnings they are owed. Function can be paused via the modifier
     *      function "onlyIfUnpaused"
     *
     * @param _raffleID    RaffleID of the raffle the winning entry is from
     * @param _entryNum    The entrants entry number into this raffle
     */



    function withdrawWinnings(bytes32 _raffleID, uint _entryNum) onlyIfUnpaused external {
        require
        (
            now - raffle[_raffleID].timeStamp > raffle[_raffleID].timeStamp + weekDur &&
            now - raffle[_raffleID].timeStamp < withdrawBefore &&
            raffle[_raffleID].isWithdrawOpen == true &&
            raffle[_raffleID].entries[msg.sender][_entryNum - 1].length == 6
        );






        uint8 matches = getNumberOfMatches(_raffleID, msg.sender, _entryNum);
        require
        (
            matches >= 3 &&
            raffle[_raffleID].winningAmounts[matches - 3] > 0
        );




        raffle[_raffleID].entries[msg.sender][_entryNum - 1].push(0);
        raffle[_raffleID].unclaimedPrizePool -= raffle[_raffleID].winningAmounts[matches - 3];
        msg.sender.transfer(raffle[_raffleID].winningAmounts[matches - 3]);
        LogSuccessfulWithdraw(params...)





    }



/*
    function refundTicket(bytes32 _raffleID, uint _entryNum) external {
        require
        (
            functionsPaused == true &&//refunds only possible if contract paused...
            now - raffle[_raffleID].timeStamp > 1814400 &&//three weeks after raffle began...
            now - raffle[_raffleID].timeStamp < withdrawBefore &&//not after raffle withdraw window...
            raffle[_raffleID].entries[msg.sender][_entryNum - 1].length == 6 &&//user has valid ticket...
            raffle[_raffleID].unclaimedPrizePool >= tktPrice &&//the raffle has sufficent sequestered funds...
            raffle[_raffleID].isWithdrawOpen == false &&//withdraw not opened...
            raffle[_raffleID].winningAmounts[0] == 0 &&//winning amounts not set...
            raffle[_raffleID].winningAmounts[1] == 0 &&
            raffle[_raffleID].winningAmounts[2] == 0 &&
            raffle[_raffleID].winningAmounts[3] == 0
        );
        raffle[_raffleID].entries[msg.sender][_entryNum - 1].push(0);//can no longer withdraw winnings/get refund
        raffle[_raffleID].unclaimedPrizePool -= tktPrice;
        msg.sender.transfer(tktPrice);
        LogTicketRefund(_raffleID, msg.sender, _entryNum, now);
    }
*/
    function rolloverUnclaimedPrizePool() internal {
        bytes32 oldRaffleID = keccak256(getWeek() - 11);
        if(raffle[oldRaffleID].unclaimedPrizePool > 0){
            uint amountRolledOver = raffle[oldRaffleID].unclaimedPrizePool;
            prizePool += amountRolledOver;
            raffle[oldRaffleID].unclaimedPrizePool = 0;
            raffle[oldRaffleID].isWithdrawOpen = false;
            LogRolledOverPrizePool(oldRaffleID, amountRolledOver, now);
            return;
        }
        LogRolledOverPrizePool(oldRaffleID, 0, now);
        return;
    }

    function disburseFunds(bytes32 _raffleID) internal {
        uint oraclizeCost = 2 * ((gasForOraclize * gasPriceForOraclize) + costOfOraclize);//2 queries per draw...
        uint profit;
        if(raffle[_raffleID].numEntries > 0){
            profit = (raffle[_raffleID].numEntries * tktPrice * forDisbursing) / 100;
            require((profit + oraclizeCost) <= prizePool);
            prizePool -= (profit + oraclizeCost);
            disbursingContract.transfer(profit);
            LogFundsDisbursed(_raffleID, profit, disbursingContract, now);
            return;
        }
        LogFundsDisbursed(_raffleID, 0, disbursingContract, now);
        return;
    }


    function __callback(bytes32 _myID, string _result) {
        require (msg.sender == oraclize_cbAddress());
        LogOraclizeCallback(_myID, _result, queryIDMap[_myID].raffleID, now);
        if(queryIDMap[_myID].isRandomCall == true){//this half more gas expensive: 500000ish



            rolloverUnclaimedPrizePool();
            disburseFunds(queryIDMap[_myID].raffleID);
            setWinningNumbers(queryIDMap[_myID].raffleID, _result);
            if(queryIDMap[_myID].isManualCall == true){ return; }
            getRaffleIDHash();
            string memory rafIDStr = uint2str(getWeek() - 1);
            bytes32 queryID = oraclize_query(
              matchesDelay, "nested", strConcat(apiStr1, rafIDStr, apiStr2), gasForOraclize
              );
            queryIDMap[queryID].raffleID = queryIDMap[_myID].raffleID;
            LogQuerySent(queryID, matchesDelay, now);
            return;




        } else {//is api call coming back that gets number of winners in each tier...



            setPayOuts(queryIDMap[_myID].raffleID, _result);
            if(queryIDMap[_myID].isManualCall == true){ return; }
            uint delay = (getWeek() * weekDur) + birthday + raffleEndTime + resultsDelay;
            queryID = oraclize_query(
              delay, "nested", strConcat(randomStr1, getRaffleIDStr(), randomStr2), gasForOraclize
              );
            queryIDMap[queryID].raffleID = currentRaffleID;
            queryIDMap[queryID].isRandomCall = true;
            LogQuerySent(queryID, delay, now);
            return;




        }
    }

    function stringToArray(string _result) internal returns (string[]) {
        var winningStr = _result.toSlice();
        var delim = ",".toSlice();
        var parts = new string[](winningStr.count(delim) + 1);
        for(uint i = 0; i < parts.length; i++) {
            parts[i] = winningStr.split(delim).toString();
        }
        return parts;
    }

    function setWinningNumbers(bytes32 _raffleID, string _result) internal {
        string[] memory arr = stringToArray(_result);
        for(uint i = 0; i < arr.length; i++){
            raffle[_raffleID].winningNumbers.push(parseInt(arr[i]));
        }
        uint serialNo = parseInt(arr[6]);
        LogWinningNumbers(_raffleID, raffle[_raffleID].numEntries, raffle[_raffleID].winningNumbers, prizePool, serialNo, now);
    }

    function setPayOuts(bytes32 _raffleID, string _result) internal {//197,927 gas...
        string[] memory numWinnersStr = stringToArray(_result);//4 nums in array...
        //WILL SILENTLY ERROR - HOW TO DEAL WITH?
        require(numWinnersStr.length >= 4);//else following throws exception...

        uint[] memory numWinnersInt = new uint[](4);
        for (uint i = 0; i < 4; i++){
            numWinnersInt[i] = parseInt(numWinnersStr[i]);
        }
        uint[] memory payOuts = new uint[](4);
        //refactored for single division
        /*
        payOuts[3] = (prizePool * percentOfPool[0]) / (numWinnersInt[3] * 1000);
        payOuts[2] = (prizePool * percentOfPool[1]) / (numWinnersInt[2] * 1000);
        payOuts[1] = (prizePool * percentOfPool[2]) / (numWinnersInt[1] * 1000);
        payOuts[0] = (prizePool * percentOfPool[3]) / (numWinnersInt[0] * 1000);
        */
        /*
        //LogPrizePoolsUpdated(raffleID, prizePool, raffle[raffleID].unclaimedPrizePool, false, payOuts[3], payOuts[2], payOuts[1], payOuts[0], now);

        //SHIT, WHAT IF THERE ARE NO THREE MATCH OR MORE MATCH WINNERS? IT IS A POSSIBILITY? WAIT, DOES IT MATTER? IF NO MATCHES, NO NEED TO OPEN WITHDRAW ANYWAY. HOW TO DISTINGUISH BETWEEN NO MATCHES AND A FAILED API CALL? DO WE EVEN NEED TO? DO WE EVEN NEED THIS REQUIREMENT?? BETTER TO SET WITHDRAW TO OPEN REGARDLESS??
        require
        (
            raffle[raffleID].numEntries > 0 &&
            //MAYBE USE ZERO MATCHES NUMBER AS A CHECK? SEND IT AS RESULT OF API CALL?
            numWinnersInt[0] > 0 ||
            numWinnersInt[1] > 0 ||
            numWinnersInt[2] > 0 ||
            numWinnersInt[3] > 0
        );
        */


        uint total;
        for(i = 0; i < 4; i++){
            if(numWinnersInt[i] != 0){
                payOuts[i] = (prizePool * percentOfPool[i]) / (numWinnersInt[i] * 1000);
                total += payOuts[i] * numWinnersInt[i];
            }
        }
        raffle[_raffleID].unclaimedPrizePool = total;
        /*
        raffle[raffleID].unclaimedPrizePool =
        (
            (payOuts[3] * numWinnersInt[3]) +
            (payOuts[2] * numWinnersInt[2]) +
            (payOuts[1] * numWinnersInt[1]) +
            (payOuts[0] * numWinnersInt[0])
        );
        */
        require(raffle[_raffleID].unclaimedPrizePool <= prizePool);
        prizePool -= raffle[_raffleID].unclaimedPrizePool;//sequestering ether won into raffle struct & ∴ "rolling-over" remainder...
        for(i = 0; i < payOuts.length; i++){
            raffle[_raffleID].winningAmounts.push(payOuts[i]);
        }
        raffle[_raffleID].isWithdrawOpen = true;
        LogPrizePoolsUpdated(prizePool, _raffleID, raffle[_raffleID].unclaimedPrizePool, payOuts[0], payOuts[1], payOuts[2], payOuts[3], now);
    }

    function getNumberOfMatches(bytes32 _raffleID, address _entrant, uint _entryNum) constant returns (uint8){
        uint8 matches;
        for(uint i = 0; i < 6; i++){
            for(uint j = 0; j < 6; j++){
                if(raffle[_raffleID].entries[_entrant][_entryNum - 1][i] == raffle[_raffleID].winningNumbers[j]){
                    matches++;
                    break;
                }
            }
        }
        return matches;
    }
    /**
     * @dev Manually make an Oraclize API call, incase of automation failure.
     *      Only callable by the Etheraffle multisig wallet.
     *
     * @param _delay        Integer. Either a time in seconds before desired callback
     *                      time for the API call, or a future UTC format time for
     *                      the desired time for the API callback.
     * @param _weekNum      String of the week number this query is for.
     * @param _isRandomCall Bool, whether or not the api call being made is for
     *                      the random.org results draw, or for the Etheraffle
     *                      API results call.
     * @param _isManualCall Bool, the Oraclize call back is a recursive function in
     *                      which each call fires off another call in perpetuity.
     *                      This bool allows that recursiveness for this call to be
     *                      turned on or off depending on callers requirements.
     *
     */
    function manuallyMakeOraclizeCall
    (
        uint _delay,
        uint _weekNum,
        bool _isRandomCall,
        bool _isManualCall
    )
    onlyEtheraffle external
    {
        string memory weekNumStr = uint2str(_weekNum);
        if(_isRandomCall == true){
            bytes32 queryID = oraclize_query(_delay, "nested", strConcat(randomStr1, weekNumStr, randomStr2), gasForOraclize);
            queryIDMap[queryID].raffleID = keccak256(_weekNum);
            queryIDMap[queryID].isRandomCall = true;
            queryIDMap[queryID].isManualCall = _isManualCall;
        } else {
            queryID = oraclize_query(_delay, "nested", strConcat(apiStr1, weekNumStr, apiStr2), gasForOraclize);
            queryIDMap[queryID].raffleID = keccak256(_weekNum);
            queryIDMap[queryID].isManualCall = _isManualCall;
        }

    }
    /**
     * @dev Set the gas relevant price parameters for the Oraclize calls, in case
     *      of future needs for higher gas prices for adequate transaction times,
     *      or incase of Oraclize price hikes. Only callable be the Etheraffle
     *      multisig wallet.
     *
     * @param _newGas     Integer, new allowed gas amount for Oraclize.
     * @param _newPrice   Integer, new gas price for Oraclize.
     * @param _newCost    Integer, new cose of Oraclize service.
     *
     */
    function setGasForOraclize
    (
        uint _newGas,
        uint _newPrice,
        uint _newCost
    )
    onlyEtheraffle external
    {
        gasForOraclize = _newGas;
        gasPriceForOraclize = _newPrice;
        costOfOraclize = _newCost;
    }
    /**
     * @dev Set the Oraclize strings, in case of url changes. Only callable by
     *      the Etheraffle multisig wallet.
     *
     * @param _newRandomHalfOne       String with properly escaped characters for
     *                                the first half of the random.org call string.
     * @param _newRandomHalfTwo       String with properly escaped characters for
     *                                the second half of the random.org call string.
     * @param _newEtheraffleHalfOne   String with properly escaped characters for
     *                                the first half of the EtheraffleAPI call string.
     * @param _newEtheraffleHalfTwo   String with properly escaped characters for
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
        apiStr1 = _newEtheraffleHalfOne;
        apiStr2 = _newEtheraffleHalfTwo;
    }
    /**
     * @dev Set the ticket price of the raffle. Only callable by the Etheraffle
     *      multisig wallet.
     *
     * @param _newPrice   Integer, the desired new ticket price.
     *
     */
    function setTktPrice(uint _newPrice) onlyEtheraffle external {
        tktPrice = _newPrice;
    }
    //unneccessary?...
    /**
     * @dev Set the current raffleID by calling the function. Also initialises
     *      that raffle by settings its time stamp. Only callable by the
     *      Etheraffle multisig wallet.
     *
     */
    function setRaffleID() onlyEtheraffle external {
        getRaffleIDHash();
    }
    /**
     * @dev Set the payouts manuall, in case of a failed Oraclize call. Only
     *      callable by the Etheraffle multisig wallet.
     *
     * @param _raffleID     RaffleID of raffle to set the payouts for.
     * @param _numMatches   Number of matches. An comma separated string of 4
     *                      integers long, consisting of the number of 3 match
     *                      winners, 4 match winners, 5 & 6 match winners in
     *                      that order.
     */
    function setPayouts(bytes32 _raffleID, string _numMatches) onlyEtheraffle external {
        setPayOuts(_raffleID, _numMatches);
    }
    /**
     * @dev Set the dividend contract address, in case of future updrades. Only
     *      callable by the Etheraffle multisig wallet.
     *
     * @param _newAddress    Desired new address of dividend contract.
     */
    function setDisbursingContractAddress(address _newAddress) onlyEtheraffle external {
        disbursingContract = _newAddress;
    }
    /**
     * @dev Set the raffle end time, in number of seconds passed the start time
     *      of 00:00am Monday. Only callable by the Etheraffle multisig wallet.
     *
     * @param _newTime    Integer, the time desired in seconds.
     */
    function setRaffleEndTime(uint _newTime) onlyEtheraffle external {
        raffleEndTime = _newTime;
    }
    /**
     * @dev Set the withdrawBefore time - the time a winner has to withdraw their
     *      winnings before the unclaimed prizepool is rolled over to the global
     *      prizepool. Only callable by the Etheraffle multsig wallet.
     *
     * @param _newTime    Integer, the time desired in seconds.
     */
    function setWithdrawBeforeTime(uint _newTime) onlyEtheraffle external {
        withdrawBefore = _newTime;
    }
    /**
     * @dev Set the paused status of the raffles. Only callable by the Etheraffle
     *      multisig wallet.
     *
     * @param _status    True or false: the desired status of the raffles.
     */
    function setPaused(bool _status) onlyEtheraffle external {
        functionsPaused = _status;
    }
    /**
     * @dev Set the house take. Only callable by the Etheraffle multisig wallet.
     *
     * @param _newDisbursing    The desired disbursal amount as a percentage.
     */
    function setForDisbursing(uint _newDisbursing) onlyEtheraffle external {
        forDisbursing = _newDisbursing;
    }
    /**
     * @dev Set the percentage-of-prizepool array. Only callable by the Etheraffle
     *      multisig wallet.
     *
     * @param _newPoP    An array of four integers totalling 1000
     */
    function setPercentOfPool(uint[] _newPoP) onlyEtheraffle external {
        percentOfPool = _newPoP;
    }
    /**
     * @dev Get the total number of different raffles a user has entered. Returns
     *      an integer
     *
     * @param _entrant    The entrant in question.
     */
    function getAmountRafflesEntered(address _entrant) constant external returns (uint) {
        return entrant[_entrant].length;
    }
    /**
     * @dev Get the raffle ID of a specific raffle a user has entered.
     *
     * @param _entrant    The entrant in question.
     * @param _which      Which raffle is in question
     */
    function getRaffleID(address _entrant, uint _which) constant external returns (bytes32) {
        return entrant[_entrant][_which - 1];
    }
    /**
     * @dev Get a entrant's number of entries into a specific raffle. Returns an integer.
     *
     * @param _raffleID   The raffleID of the queried raffle.
     * @param _entrant    The entrant in question.
     */
    function getUserNumEntries(address _entrant, bytes32 _raffleID) constant external returns (uint) {
        return raffle[_raffleID].entries[_entrant].length;
    }
    /**
     * @dev Get number of entries into a specific raffle. Returns an integer.
     *
     * @param _raffleID   The raffleID of the queried raffle.
     */
    function getRaffleNumEntries(bytes32 _raffleID) constant external returns (uint) {
      return raffle[_raffleID].numEntries;
    }
    /**
     * @dev Get chosen numbers of an entrant, for a specific raffle. Returns an array.
     *
     * @param _entrant    The entrant in question's address.
     * @param _raffleID   The raffleID of the queried raffle.
     * @param _entryNum   The entrant's entry number in this raffle.
     */
    function getChosenNumbers(address _entrant, bytes32 _raffleID, uint _entryNum) constant external returns (uint[]){
        return raffle[_raffleID].entries[_entrant][_entryNum-1];
    }
    /**
     * @dev Get winning details of a raffle, ie, it's winning numbers and the
     *      prize amounts. Returns two arrays.
     *
     * @param _raffleID   The raffleID of the queried raffle.
     */
    function getWinningDetails(bytes32 _raffleID) constant external returns (uint[], uint[]) {
        return (raffle[_raffleID].winningNumbers, raffle[_raffleID].winningAmounts);
    }
    /**
     * @dev Self destruct contract. Only etheraffle's multisig wallet can call this
     *      function. It renders the contract useless and returns all ether to
     *      the etheraffle multisig wallet.
     */
    function selfDestruct() onlyEtheraffle external {
      //require it's been 60 days since upgradeContract was called!?
        selfdestruct(etheraffle);
    }

    function updgradeContract() only Etheraffle external {
      //check for Contract
      //move only prizepool so that previous winners can still withdraw from sequestered prizepools
      //set a date somewhere so that after 60 days the remaining balance of the contract can be moved.
    }

    function () payable external {
        //fallback
    }
///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////Temporary Function For Dev////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
/*
    //functions for dev
    function addToPrizePool() payable external {
        prizePool += msg.value;
    }

    function setWinningNumbers(bytes32 raffleID, uint8[] winningNums) public {
        for(uint i = 0; i < 6; i++){
            raffle[raffleID].winningNumbers.push(winningNums[i]);
        }
        //raffle[raffleID].isWithdrawOpen = true;
    }
    */
}
