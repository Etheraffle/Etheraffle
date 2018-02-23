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

    /* Variable to track the prizepool */
    uint public prizePool;
    /* Etheraffle's Birthday! <3 (UTC Time format) */
    uint constant birthday = 1500249600;//Etheraffle's birthday <3
    /* One week in seconds */
    uint constant weekDur = 604800;
    /* Time in seconds from Monday 00:00am UTC that the raffle closes (Sat 7pm) */
    //uint raffleEndTime  = 500400;

    //TESTING
    uint raffleEndTime = (2 * 24*60*60) + (23*60*60) + (1*60);//
    uint resultsDelay = 60;//
    uint matchesDelay = 90;//

    /* Delay between the raffle end time and the Oraclize call for the results draw */
    //uint resultsDelay = 3600;
    /* Time allowed for winner withdrawals in seconds*/
    uint withdrawBefore = weekDur * 10;
    /* Maximum gas the Oraclize function is allowed */
    uint gasForOraclize = 520000;
    /* Gas price in wei for Oraclize calls */
    uint gasPriceForOraclize = 10000000000;
    /* Cost in wei of the Oraclize service */
    uint costOfOraclize = 350000000000000;
    /* The house take as a percentage */
    uint houseTake = 10;
    /* Percentage of prize pool used if there are more winners than expected due to variance. */
    /* Parts per thousand format, and left to right, for 3 matches, 4 matches, etc... */
    uint[] percentOfPool = [520, 114, 47, 319];//[319, 47, 114, 520];
    /* The address of the etheraffle multisig, used as controller for this contract */
    address etheraffle;
    /* The address of the dividend contract to which proceeds are forwarded for tkt token holders to withdraw */
    address public dividendContract;
    /*  */
    //address public editContract;//the contract used to alter vars, controlled by investors...
    /* The ID of the currently running raffle */
    bytes32 public currentRaffleID;
    /* The ID of the previously run raffle */
    bytes32 previousRaffleID;
    //string randomStr1 = "[URL] ['json(https://api.random.org/json-rpc/1/invoke).result.random[\"serialNumber\", \"data\"]','\\n{\"jsonrpc\": \"2.0\",\"method\":\"generateSignedIntegers\",\"id\":\"";
    /* The API call string for random.org for the results draw, first half */
    string randomStr1 = "[URL] ['json(https://api.random.org/json-rpc/1/invoke).result.random[\"data\", \"serialNumber\"]','\\n{\"jsonrpc\": \"2.0\",\"method\":\"generateSignedIntegers\",\"id\":\"";
    /* The API call string for the random.org for the results draw, second half */
    string randomStr2 = "\",\"params\":{\"n\":\"6\",\"min\":1,\"max\":49,\"replacement\":false,\"base\":10,\"apiKey\":${[decrypt] BLpFp6SZ/IklYeEAiVbY1HgMWI4CilsUGnzXLyBUeScu8T5RSDUIswqTeP9R5KHKbf/McV6Gf/nWpw5VGYf/7Vas2GzRv27AWO/yQZ3iAY4OpP03Ht60InAgtlaOCXjt3bEY4vbJjAb6Ta3AfyUdLJv+WCMjpPPy2A==}}']";
    /* The API call string for Etheraffle's API, called to count number of winners. First half */
    string apiStr1 = "[URL] ['json(http://128.199.49.146:3000/api/m).m','{\"r\":\"";
    /* The API call string for Etheraffle's API, called to count number of winners. Second half */
    string apiStr2 = "\",\"k\":${[decrypt] BBksqmEQSmK5cduuDRy7iCG93LuW+uLSiOokELDzhdDfMnimClmU1wDI1Jmzno6dPds15PeR+AGRkQy/cxYeb+RL1smVY8Y7IVYQMumGLKiXLeBh5JmMTBdzYxUmIh0QZZlGtlnh}}']";
    /* Toggle for pausing raffle functions in case of upgrades, malfunctions, etc... */
    bool public functionsPaused;
    /* Map of entrant address to the ID's of the raffles they have entered */
    mapping (address => bytes32[]) public entrant;
    /* Map of raffle ID to a struct containing info about that raffle */
    mapping (bytes32 => raffleStruct) public raffle;
    struct raffleStruct{
        /* Map of entrant's addresses to an array of arrayss of their chosen numbers */
        mapping (address => uint[][]) entries;
        /* Array containing winning numbers oncec they are drawn */
        uint[] winningNumbers;
        /* Array containing the payouts in wei for 6 match, 5 match, 4 & 3 match winners, once results are drawn */
        uint[] winningAmounts;
        /* Monday timestamp in UTC format of this raffle */
        uint timeStamp;
        /* A variable to sequester this raffles total winnings from the global prizepool, once results are drawn */
        uint unclaimedPrizePool;
        /* Variable tracking the number of entries into this raffle */
        uint numEntries;
        /* A boolean toggle used to create the withdrawal window winners have to withdraw within */
        bool isWithdrawOpen;
    }
    /* Mapping Oraclize Query IDs to the RaffleID's the query is made on behalf of */
    mapping (bytes32 => queryIDStruct) public queryIDMap;
    struct queryIDStruct{
      /* Raffle ID */
      bytes32 raffleID;
      /* Oraclize calls Random.org and Etheraffle's API in turn, this tracks which is which */
      bool isRandomCall;
      /* If we need to manually make an Oraclize call, this stops it starting a whole new recursive chain */
      bool isManualCall;
    }
    /* Modifier allowing only the etheraffleMultiSig wallet to run a function */
    modifier onlyEtheraffle(){
        require(msg.sender == etheraffle);
        _;
    }
    /* Modifier allowing a function to run only if the paused toggle is at false */
    modifier onlyIfUnpaused(){
        require(functionsPaused == false);
        _;
    }
    /* Event loggers */
    event LogTicketBought(bytes32 indexed forRaffle, uint indexed entryNumber, address indexed theEntrant, uint[] chosenNumbers, uint personalEntryNumber, uint atTime);
    event LogTicketRefund(bytes32 forRaffle, address byWhom, uint entryNumber, uint atTime);
    event LogOraclizeCallback(bytes32 queryID, string result, bytes32 forRaffle, uint atTime);
    event LogProfitSent(bytes32 forRaffle, uint amount, address toAddress, uint atTime);
    event LogRolledOverPrizePool(bytes32 fromRaffle, uint amount, uint atTime);
    event LogWinningNumbers(bytes32 indexed forRaffle, uint numberOfEntries, uint[] wNumbers, uint currentPrizePool, uint randomSerialNo, uint atTime);
    event LogSuccessfulWithdraw(bytes32 forRaffle, address toWhom, uint forEntryNumber, uint matches, uint amountWon, uint atTime);
    event LogPrizePoolsUpdated(uint newMainPrizePool, bytes32 raffleID, uint unclaimedPrizePool, uint threeMatchWin, uint fourMatchWin, uint fiveMatchWin, uint sixMatchwin, uint atTime);
    event LogQuerySent(bytes32 qID, uint timeDelay, uint sendTime);
    /**
     * @dev Constructor
     */
    //SEND ETH WITH CONTRACT CREATION SO FIRST ORACLE CALL WORKS!
    function Etheraffle() payable {
        etheraffle = msg.sender;
        dividendContract = msg.sender;
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
     */
    function getWeek() internal constant returns (uint) {
        /* Solidity division truncates, giving us an integer for week number */
        uint week = (now - birthday) / weekDur;
        /* If it's past the raffle end time, the week number is incremented */
        if (now - ((week * weekDur) + birthday) > raffleEndTime) {
            week++;
        }
        return week;
    }
    /**
     * @dev Function which returns the keccak hash of the week number, used
     *      as a raffle ID.
     */
    function getRaffleIDHash() internal constant returns (bytes32){
        /* Call getWeek function to get week number */
        uint week = getWeek();
        /* Hash the week number */
        bytes32 raffleIDHash = keccak256(week);
        /* If resulting hash is different to current raffleID, the variable is updated */
        /* and a new raffle struct is initialised with the new timestamp */
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
     */
    function getRaffleIDStr() internal constant returns (string) {
        uint week = getWeek();
        /* Using Oraclize's own uint-to-string function to save on code */
        string memory weekStr = uint2str(week);
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
    function enterRaffle(
        uint _one,
        uint _two,
        uint _three,
        uint _four,
        uint _five,
        uint _six
    ) onlyIfUnpaused payable external {
        require
        (
            /* Only those paying the ticket price may enter */
            msg.value >= tktPrice &&
            //RE THE FOLLOWING TWO - DO WE NEED? ISN'T THE CURRENT RAFid GOVERNING ALL ENTRIES ANYWAY?
            /* Make sure this raffle's withdraw is closed and ∴ open for entry */
            raffle[currentRaffleID].isWithdrawOpen == false &&
            /* Make sure the timestampe is > 0 and ∴ the raffle is set up */
            raffle[currentRaffleID].timeStamp > 0 &&
            /* Stop entries after raffle end time */
            now - raffle[currentRaffleID].timeStamp < raffleEndTime &&
            /* The following ensures no duplicate numbers, and bounds them to between 0 and 49 */
            0 < _one &&
            _one < _two &&
            _two < _three &&
            _three < _four &&
            _four < _five &&
            _five < _six &&
            _six <= 49
        );
        /* Following creates an array of the entrants chosen numbers */
        uint[] memory chosenNumbers = new uint[](6);
        chosenNumbers[0] = _one;
        chosenNumbers[1] = _two;
        chosenNumbers[2] = _three;
        chosenNumbers[3] = _four;
        chosenNumbers[4] = _five;
        chosenNumbers[5] = _six;
        /*
        if(entrant[msg.sender].length == 0){//new entrant...
            entrant[msg.sender].push(currentRaffleID);
        } else if(entrant[msg.sender][entrant[msg.sender].length - 1] != currentRaffleID){//new entrant to this raffle...
            entrant[msg.sender].push(currentRaffleID);
        }
        */
        /* If the entrant has entered either NO raffles, or hasn't already entered  */
        /* this raffle, then add this raffle's ID to the entrants array of enries   */
        if
        (
            entrant[msg.sender].length == 0 ||
            entrant[msg.sender][entrant[msg.sender].length - 1] != currentRaffleID
        )
        {
            entrant[msg.sender].push(currentRaffleID);
        }
        /* Increment this raffle's number of entries */
        raffle[currentRaffleID].numEntries++;
        /* Increment the prize pool by this entry's ticket purchase price */
        prizePool += msg.value;
        /* Store the entrants selected numbers in this raffle's array of entries. */
        raffle[currentRaffleID].entries[msg.sender].push(chosenNumbers);
        /* Log the ticket purchase */
        LogTicketBought(currentRaffleID, raffle[currentRaffleID].numEntries, msg.sender, chosenNumbers, raffle[currentRaffleID].entries[msg.sender].length, now);

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
            /* Can't withdraw until the Monday, 00:00am following the draw */
            now - raffle[_raffleID].timeStamp > raffle[_raffleID].timeStamp &&// + weekDur && REINSTATE THIS!!!
            /* Can't withdraw beyond the withdrawBefore time */
            now - raffle[_raffleID].timeStamp < withdrawBefore &&
            /* Make sure withdraw is open */
            raffle[_raffleID].isWithdrawOpen == true &&
            /* Make sure the entry's chosen number array is exactly 6 long */
            raffle[_raffleID].entries[msg.sender][_entryNum - 1].length == 6
        );
        /* Get the number of matches between this entry an this raffle's winning numbers */
        uint8 matches = getNumberOfMatches(_raffleID, msg.sender, _entryNum);
        require
        (
            /* Require the number of matches to be 3 or more (fewer matches do not result in a prize) */
            matches >= 3 &&
            /* Check the winning amount is > 0, ∴ there is actually a prize to be won */
            raffle[_raffleID].winningAmounts[matches - 3] > 0
        );
        /* Push a zero into the entrant's chosen number array, barring them from claiming this prize again */
        raffle[_raffleID].entries[msg.sender][_entryNum - 1].push(0);
        /* Subtract this prize from this raffles sequestered prize fund */
        raffle[_raffleID].unclaimedPrizePool -= raffle[_raffleID].winningAmounts[matches - 3];
        /* Transfer the prize won to the winner */
        msg.sender.transfer(raffle[_raffleID].winningAmounts[matches - 3]);
        /* Log the succesfull withdrawal */
        LogSuccessfulWithdraw(_raffleID, msg.sender, _entryNum, matches, raffle[_raffleID].winningAmounts[matches - 3], now);
    }
/*
    function refundTicket(bytes32 raffleID, uint entryNum) external {
        require
        (
            functionsPaused == true &&//refunds only possible if contract paused...
            now - raffle[raffleID].timeStamp > 1814400 &&//three weeks after raffle began...
            now - raffle[raffleID].timeStamp < withdrawBefore &&//not after raffle withdraw window...
            raffle[raffleID].entries[msg.sender][entryNum - 1].length == 6 &&//user has valid ticket...
            raffle[raffleID].unclaimedPrizePool >= tktPrice &&//the raffle has sufficent sequestered funds...
            raffle[raffleID].isWithdrawOpen == false &&//withdraw not opened...
            raffle[raffleID].winningAmounts[0] == 0 &&//winning amounts not set...
            raffle[raffleID].winningAmounts[1] == 0 &&
            raffle[raffleID].winningAmounts[2] == 0 &&
            raffle[raffleID].winningAmounts[3] == 0
        );
        raffle[raffleID].entries[msg.sender][entryNum - 1].push(0);//can no longer withdraw winnings/get refund
        raffle[raffleID].unclaimedPrizePool -= tktPrice;
        msg.sender.transfer(tktPrice);
        LogTicketRefund(raffleID, msg.sender, entryNum, now);
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

    function takeProfit(bytes32 raffleID) internal {
        uint oraclizeCost = 2 * ((gasForOraclize * gasPriceForOraclize) + costOfOraclize);//2 queries per draw...
        uint profit;
        if(raffle[raffleID].numEntries > 0){
            profit = (raffle[raffleID].numEntries * tktPrice * houseTake) / 100;
            require((profit + oraclizeCost) <= prizePool);
            prizePool -= (profit + oraclizeCost);
            dividendContract.transfer(profit);
            LogProfitSent(raffleID, profit, dividendContract, now);
            return;
        }
        //ELSE WHAT?
        LogProfitSent(raffleID, 0, dividendContract, now);
        return;
    }


    function __callback(bytes32 myid, string result) {
        //result will have serial in it too, so the first result of array will be that?
        require (msg.sender == oraclize_cbAddress());
        //uint timeStamp = (getWeek() * weekDur) + birthday;//by the time this callback is called, getweek will be + 1
        LogOraclizeCallback(myid, result, queryIDMap[myid].raffleID, now);
        if(queryIDMap[myid].isRandomCall == true){//this half more gas expensive: 500000ish
            rolloverUnclaimedPrizePool();
            takeProfit(queryIDMap[myid].raffleID);
            setWinningNumbers(queryIDMap[myid].raffleID, result);
            if(queryIDMap[myid].isManualCall == true){
                return;
            }
            getRaffleIDHash();//bytes32 raffleID = getRaffleIDHash();//update raffleID ∴ setting its stamp to following mon...
            string memory rafIDStr = uint2str(getWeek() - 1);//week already rolled over so need this...
            bytes32 queryID = oraclize_query(matchesDelay, "nested", strConcat(apiStr1, rafIDStr, apiStr2), gasForOraclize);
            queryIDMap[queryID].raffleID = queryIDMap[myid].raffleID;
            LogQuerySent(queryID, matchesDelay, now);
            return;
        } else {//is api call coming back that gets number of winners in each tier...
            setPayOuts(queryIDMap[myid].raffleID, result);//result = string of array of 4 numbers: 3match winners, 4, 5, and 6...
            if(queryIDMap[myid].isManualCall == true){
                return;
            }
            uint delay = (getWeek() * weekDur) + birthday + raffleEndTime + resultsDelay;//by now the week should be next...
            queryID = oraclize_query(delay, "nested", strConcat(randomStr1, getRaffleIDStr(), randomStr2), gasForOraclize);
            queryIDMap[queryID].raffleID = currentRaffleID;//should be next weeks ID by now..
            queryIDMap[queryID].isRandomCall = true;//for next week's draw...
            LogQuerySent(queryID, delay, now);
            return;
        }
        //store another bool for isManualCall then arrest above two functions before the new query is sent?
        //actually need it to be bool, like restartChain or something incase the recursive callback fails
        //this way we can restart if needed, or make oraclize calls without interrupting it if needed too...

    }

    function stringToArray(string result) internal returns (string[]) {
        var winningStr = result.toSlice();
        var delim = ",".toSlice();
        var parts = new string[](winningStr.count(delim) + 1);
        for(uint i = 0; i < parts.length; i++) {
            parts[i] = winningStr.split(delim).toString();
        }
        return parts;
    }

    function setWinningNumbers(bytes32 raffleID, string result) internal {
        string[] memory arr = stringToArray(result);
        //more numbers can be pushed in but it doesn't matter since the matches only checks 1st six!
        for(uint i = 0; i < arr.length; i++) {
            raffle[raffleID].winningNumbers.push(parseInt(arr[i]));
        }

        /*
        raffle[raffleID].winningNumbers[0] = parseInt(arr[0]);
        raffle[raffleID].winningNumbers[1] = parseInt(arr[1]);
        raffle[raffleID].winningNumbers[2] = parseInt(arr[2]);
        raffle[raffleID].winningNumbers[3] = parseInt(arr[3]);
        raffle[raffleID].winningNumbers[4] = parseInt(arr[4]);
        raffle[raffleID].winningNumbers[5] = parseInt(arr[5]);
        */
        uint serialNo = parseInt(arr[6]);
        LogWinningNumbers(raffleID, raffle[raffleID].numEntries, raffle[raffleID].winningNumbers, prizePool, serialNo, now);
    }

    function setPayOuts(bytes32 raffleID, string result) internal {//197,927 gas...
        string[] memory numWinnersStr = stringToArray(result);//4 nums in array...
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
        for(uint j = 0; j < 4; j++){
            if(numWinnersInt[j] != 0){
                payOuts[j] = (prizePool * percentOfPool[j]) / (numWinnersInt[j] * 1000);
                total += payOuts[j] * numWinnersInt[j];
            }
        }
        raffle[raffleID].unclaimedPrizePool = total;
        /*
        raffle[raffleID].unclaimedPrizePool =
        (
            (payOuts[3] * numWinnersInt[3]) +
            (payOuts[2] * numWinnersInt[2]) +
            (payOuts[1] * numWinnersInt[1]) +
            (payOuts[0] * numWinnersInt[0])
        );
        */
        require(raffle[raffleID].unclaimedPrizePool <= prizePool);
        prizePool -= raffle[raffleID].unclaimedPrizePool;//sequestering monies won into raffle struct & ∴ "rolling-over" remainder...
        for(i = 0; i < payOuts.length; i++){
            raffle[raffleID].winningAmounts.push(payOuts[i]);
        }
        raffle[raffleID].isWithdrawOpen = true;
        LogPrizePoolsUpdated(prizePool, raffleID, raffle[raffleID].unclaimedPrizePool, payOuts[0], payOuts[1], payOuts[2], payOuts[3], now);
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
    function setDividendContractAddress(address _newAddress) onlyEtheraffle external {
        dividendContract = _newAddress;
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
     * @param _newTake    The desired house take expressed as a percentage.
     */
    function setHouseTake(uint _newTake) onlyEtheraffle external {
        houseTake = _newTake;
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
        selfdestruct(etheraffle);
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
