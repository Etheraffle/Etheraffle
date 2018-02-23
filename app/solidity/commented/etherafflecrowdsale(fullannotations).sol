/*
Deploy string: 1509278100, "0x929fc0a7a548c7abf0d6ebf08f7fd3890cc57970","0xB7Ea14973700361dc1cb5dF0bC513051D480437d","0xB7Ea14973700361dc1cb5dF0bC513051D480437d"


redeemBonusLot function sig: "0x73635a99"

var icoAdd = "0xa7abcd38847c02c07b08e8b523374a3e14b35bb4"
var icoABI = eth.contract([{"constant":true,"inputs":[],"name":"tierOneEnd","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tierOneTotal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"etheraffleDapp","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tierOne","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxWeiPerTier","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finalTransfers","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tierOneLot","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"crowdSaleStart","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"crowdSaleEnd","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"etheraffleLOT","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tierTwoTotal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"withdrawBefore","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"redeemBonusLot","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tierThreeLot","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tierThreeTotal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"selfDestruct","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tierTwo","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tierThree","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tierTwoEnd","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bonusLotRedeemed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tierTwoLot","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getNow","outputs":[{"name":"timeNow","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"lotTotalOne","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bonusLot","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lotTotalThree","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"etheraffleMultiSig","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"returnEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"lotTotalTwo","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"returnTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_start","type":"uint256"},{"name":"_LOT","type":"address"},{"name":"_multiSig","type":"address"},{"name":"_dapp","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"byWhom","type":"address"},{"indexed":false,"name":"inTier","type":"uint256"},{"indexed":false,"name":"ethAmount","type":"uint256"},{"indexed":false,"name":"lotAmount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogLotPurchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"toWhom","type":"address"},{"indexed":false,"name":"lotAmount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogLotTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"toWhom","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogEtherTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"tokenContract","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"LogTokenDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"toWhom","type":"address"},{"indexed":false,"name":"lotAmount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogBonusLotTransfer","type":"event"}])


*/
/**
* TODO: sort out token contract and minting of correct amount
* TODO: have method to withdraw ether at the end of each tier...
* TODO: Refund somehow? In case of what?
* TODO: Is the withdraw after a tier is over a good idea?
*/
pragma solidity^0.4.15;

contract ERC223Interface {
    /* Abstract interface contract for acquiring function signatures */
    function balanceOf(address who) constant public returns (uint) {}
    function transfer(address to, uint value) public {}
}

contract EtheraffleICO is ERC223Interface {

    //TESTING
    uint public constant tierOneLot = 3000000;
    uint public constant tierTwoLot = 2000000;
    uint public constant tierThreeLot = 1000000;

    /* Lot reward per ether in each tier */
    //uint public constant tierZeroLot = 10000;
    //uint public constant tierOneLot = 10000;
    //uint public constant tierTwoLot = 9000;
    //uint public constant tierThreeLot = 8000;
    /* Bonus tickets multiplier */
    uint public constant bonusLot = 1000000;
    /* Maximum amount of ether investable per tier (15,000 ether) */
    uint public constant maxWeiTierZero  = 1000 * 10 ** 18;
    uint public constant maxWeiTierOne   = 5000 * 10 ** 18;
    uint public constant maxWeiTierTwo   = 7500 * 10 ** 18;
    uint public constant maxWeiTierThree = 1000 * 10 ** 18;

    /* Crowdsale begin time in UTC format */
    uint public crowdSaleStart;
    /* Tier one end time in UTC format */
    uint public tierOneEnd;
    /* Tier two end time in UTC format */
    uint public tierTwoEnd;
    /* Crowdsale end time in UTC format */
    uint public crowdSaleEnd;
    /* Withdraw before time in UTC format, set for one week after crowdsale ends */
    uint public withdrawBefore;
    /* Variable to track amount of purchases in tier */
    uint public tierZeroTotal;
    uint public tierOneTotal;
    uint public tierTwoTotal;
    uint public tierThreeTotal;
    /* Variable to track number of tier LOT purchased in each tier */
    uint public lotTotalZero;
    uint public lotTotalOne;
    uint public lotTotalTwo;
    uint public lotTotalThree;
    /* Variable to track number of bonus LOT redeemed */
    uint public bonusLotRedeemed;
    /* Etheraffle's multisig wallet address */
    address public etheraffleMultiSig;
    /* Etheraffle's LOT token contract address */
    address public etheraffleLOT;
    /* ICO status toggle */
    bool ICORunning = true;
    /* Map of purchaser's ethererum address' to the amount of ether for calculating bonuses*/
    mapping (address => uint) public tierZero;
    mapping (address => uint) public tierOne;
    mapping (address => uint) public tierTwo;
    mapping (address => uint) public tierThree;
    /* Instantiate the variable to hold Etheraffle's LOT token-contract instance */
    ERC223Interface LOT;

    /* Event loggers */
    event LogLotPurchase(address byWhom, uint inTier, uint ethAmount, uint lotAmount, uint atTime);
    event LogLotTransfer(address toWhom, uint lotAmount, uint atTime);
    event LogEtherTransfer(address toWhom, uint amount, uint atTime);
    event LogTokenDeposit(address from, address tokenContract, uint value);
    event LogBonusLotTransfer(address toWhom, uint lotAmount, uint atTime);

    /**
     * @dev Modifier function to prepend to later functions in this contract in
     *      order to redner them only useable by the Etheraffle MultiSig wallet.
     */
    modifier onlyEtheraffle() {
        require(msg.sender == etheraffleMultiSig);
        _;
    }
    /**
     * @dev Modifier function to prepend to later functions rendering the method
     *      only callable if the crowdsale is running.
     */
    modifier onlyIfRunning() {
        require(ICORunning == true);
        _;
    }
    /**
     * @dev Modifier function to prepend to later functions rendering the method
     *      only callable if the crowdsale is NOT running.
     */
    modifier onlyIfNotRunning() {
        require(ICORunning == false);
        _;
    }
    /**
    * @dev  Constructor. Sets up the variables pertaining to the ICO start &
    *       end times, the tier start & end times, the Etheraffle MultiSig Wallet 7
    *       address & the Etheraffle Token contract.
    *
    * @param _start     Start time of crowdfund in UTC format
    * @param _LOT       Address of the Etheraffle token contract
    * @param _multiSig  Address of Etheraffle's managerial multisig wallet
    */
    function EtheraffleICO(uint _start, address _LOT, address _multiSig) public {
        uint day = 86400;
        crowdSaleStart = _start;
        tierOneEnd = _start + (10 * day );
        tierTwoEnd = tierOneEnd + (20 * day);
        crowdSaleEnd = tierTwoEnd + (30 * day);
        withdrawBefore = crowdSaleEnd + (14 * days);
        etheraffleLOT = _LOT;
        LOT = ERC223Interface(_LOT);
        etheraffleMultiSig = _multiSig;
    }

    /**
    * @dev  Purchase lot tokens.
    *       LOT are sent in accordance with how much ether is invested, and in what
    *       tier the investment was made in. The function also stores the amount of ether
    *       invested for later conversion to the amount of bonus LOT owed. Once the
    *       crowdsale is over and the final number of tokens sold is known, the purchaser's
    *       bonuses can be calculated. Using the fallback function allows LOT purchasers to
    *       simply send ether to this address in order to buy tokens, without them having
    *       to call a function. The requirements also also mean that once the crowdsale is
    *       over, any ether sent to this address by accident will be returned to the sender
    *       and not lost.
    */
    function () public payable onlyIfRunning {//Gas: 102074 if new investor (sets up the structs), 57074 if not new investor.
        /* Requires the crowdsale time window to be open and the function caller to send ether */
        require
        (
            //now > crowdSaleStart &&//tier zero currently open!
            now <= crowdSaleEnd &&
            msg.value > 0
        );
        uint numLOT = 0;

        if (now <= crowdSaleStart){// ∴ tier zero...
            /* Eth investable in each tier is capped via this requirement */
            require(tierZeroTotal + msg.value <= maxWeiPerTier);
            /* Store purchasers purchased amount plus add it to total in this tier */
            tierZero[msg.sender] += msg.value;
            /* Track total investment in tier one */
            tierZeroTotal += msg.value;
            /* Number of lot this tier's purchase results in */
            numLOT = (msg.value * tierZeroLot) / (1 * 10 ** 18);
            /* Increment total number of lot sold */
            lotTotalZero += numLOT;
            /* Transfer number of lot bought to the purchaser */
            LOT.transfer(msg.sender, numLOT);
            /* Log the lot purchase event */
            LogLotPurchase(msg.sender, 0, msg.value, numLOT, now);
            return;
        } else if (now <= tierOneEnd) {// ∴ tier one...
            /* Eth investable in each tier is capped via this requirement */
            require(tierOneTotal + msg.value <= maxWeiPerTier);
            /* Store purchasers purchased amount plus add it to total in this tier */
            tierOne[msg.sender] += msg.value;
            /* Track total investment in tier one */
            tierOneTotal += msg.value;
            /* Number of lot this tier's purchase results in */
            numLOT = (msg.value * tierOneLot) / (1 * 10 ** 18);
            /* Increment total number of lot sold */
            lotTotalOne += numLOT;
            /* Transfer number of lot bought to the purchaser */
            LOT.transfer(msg.sender, numLOT);
            /* Log the lot purchase event */
            LogLotPurchase(msg.sender, 1, msg.value, numLOT, now);
            return;
        } else if (now <= tierTwoEnd) {// ∴ tier two...
            /* Eth investable in each tier is capped via this requirement */
            require(tierTwoTotal + msg.value <= maxWeiPerTier);
            /* Store purchasers purchased amount plus add it to total in this tier */
            tierTwo[msg.sender] += msg.value;
            /* Track total investment in tier two */
            tierTwoTotal += msg.value;
            /* Number of lot this tier's purchase results in */
            numLOT = (msg.value * tierTwoLot) / (1 * 10 ** 18);
            /* Increment total number of lot sold */
            lotTotalTwo += numLOT;
            /* Transfer number of lot bought to the purchaser */
            LOT.transfer(msg.sender, numLOT);
            /* Log the lot purchase event */
            LogLotPurchase(msg.sender, 2, msg.value, numLOT, now);
            return;
        } else {// ∴ tier three...
            /* Eth investable in each tier is capped via this requirement */
            require(tierThreeTotal + msg.value <= maxWeiPerTier);
            /* Store purchasers purchased amount plus add it to total in this tier */
            tierThree[msg.sender] += msg.value;
            /* Track total investment in tier three */
            tierThreeTotal += msg.value;
            /* Number of lot this tier's purchase results in */
            numLOT = (msg.value * tierThreeLot) / (1 * 10 ** 18);
            /* Increment total number of lot sold */
            lotTotalThree += numLOT;
            /* Transfer number of lot bought to the purchaser */
            LOT.transfer(msg.sender, numLOT);
            /* Log the lot purchase event */
            LogLotPurchase(msg.sender, 3, msg.value, numLOT, now);
            return;
        }
    }
    /**
    * @dev  Redeem bonus lot: This function cannot be called until the crowdsale
    *       is over, nor one further week after the crowdsale ends. During this
    *       window, a lot purchaser calls this function in order to receive their
    *       bonus lot tokens owed to them, as calculated by the total amount of
    *       lot sales in the tiers following their purchase.
    */
    function redeemBonusLot() external onlyIfRunning { //81k gas
        /* Requires crowdsale to be over and the withdrawBefore time to not have passed yet */
        require
        (
            now > crowdSaleEnd &&
            now < withdrawBefore
        );
        /* Requires user to have a lot purchase in at least one of the bonus-eligible tiers. */
        require
        (
            tierZero[msg.sender] > 0 ||
            tierOne[msg.sender] > 0 ||
            tierTwo[msg.sender] > 0
        );
        /* Variable to store the users bonus lot amount as it is calculated */
        uint bonusLotAmount = 0;
        /* If purchaser has ether in this tier, lot tokens owed is calculated and added to lot amount */
        if(tierZero[msg.sender] > 0){
            bonusLotAmount +=
            /* Calculate share of bonus lot user is entitled to, based on tier two sales */
            //NB Solidity truncates EVERY division! So it's refactored to only truncate once...
            //preserves most accuracy...
            //don't need safe math because div by zero impossible here
            //plus the theoretical max numerator = (15000*(1*10**18))*(15000*(1*10**18))*1000000 and that is MUCH smaller
            //than 2**256! Yay!
            //((((tierTwoTotal / (1 * 10 ** 18)) * bonusLot) * tierOne[msg.sender]) / tierOneTotal) +
            /* Calculate share of bonus lot user is entitled to, based on tier one sales */
            ((tierOneTotal * bonusLot * tierZero[msg.sender]) / (tierZeroTotal * (1 * 10 ** 18))) +
            /* Calculate share of bonus lot user is entitled to, based on tier two sales */
            ((tierTwoTotal * bonusLot * tierOne[msg.sender]) / (tierOneTotal * (1 * 10 ** 18))) +
            /* Calculate share of bonus lot user is entitled to, based on tier three sales */
            ((tierThreeTotal * bonusLot * tierOne[msg.sender]) / (tierOneTotal * (1 * 10 ** 18)));
            /* Zero amount of ether in this tier to make further bonus redemptions impossible */
            tierOne[msg.sender] = 0;
        }
        if(tierOne[msg.sender] > 0){
            bonusLotAmount +=
            /* Calculate share of bonus lot user is entitled to, based on tier two sales */
            ((tierTwoTotal * bonusLot * tierOne[msg.sender]) / (tierOneTotal * (1 * 10 ** 18))) +
            /* Calculate share of bonus lot user is entitled to, based on tier three sales */
            ((tierThreeTotal * bonusLot * tierOne[msg.sender]) / (tierOneTotal * (1 * 10 ** 18)));
            /* Zero amount of ether in this tier to make further bonus redemptions impossible */
            tierOne[msg.sender] = 0;
        }
        /* If purchaser has ether in this tier, lot tokens owed is calculated and added to lot amount */
        if(tierTwo[msg.sender] > 0){
            bonusLotAmount +=
            /* Calculate share of bonus lot user is entitled to, based on tier three sales */
            //((((tierThreeTotal / (1 * 10 ** 18)) * bonusLot) * tierTwo[msg.sender]) / tierTwoTotal);
            ((tierThreeTotal * bonusLot * tierTwo[msg.sender]) / (tierTwoTotal * (1 * 10 ** 18)));
            /* Zero amount of ether in this tier to make further bonus redemptions impossible */
            tierTwo[msg.sender] = 0;
        }
        /* Final check that user cannot withdraw twice */
        require
        (
            tierOne[msg.sender] == 0 &&
            tierTwo[msg.sender] == 0
        );
        /* Transfer lot to bonus redeemer */
        LOT.transfer(msg.sender, bonusLotAmount);
        /* Log the lot transfer of these bonus lot to the redeemer */
        LogBonusLotTransfer(msg.sender, bonusLotAmount, now);
    }
    /**
    * @dev    Function callable only after crowdsale is over and only by
    *         Etheraffle's multi-sig wallet. Transfers remaining lot to
    *         Etheraffle's multi-sig wallet along with the proceeds of
    *         the crowdsale.
    */
    function finalTransfers() external onlyIfRunning onlyEtheraffle {
        /* Only callable once the crowdsale AND user withdrawal periods are over. */
        require(now > withdrawBefore);
        /* Get this contract's remaining balance of lot tokens */
        uint amount = LOT.balanceOf(this);
        /* Transfer those lot tokens to the multisig wallet */
        LOT.transfer(etheraffleMultiSig, amount);
        /* Transfer the proceeds of this crowdsale to the multisig wallet */
        etheraffleMultiSig.transfer(this.balance);
        /* Log the lot transfer */
        LogLotTransfer(msg.sender, amount, now);
        /* Log the ether transfer */
        LogEtherTransfer(msg.sender, this.balance, now);
    }
    /**
    * @dev    Function callable only by Etheraffle's multi-sig wallet. It
    *         transfers the tier's earnt ether to the etheraffle multisig wallet
    *         once the tier is over.
    */
    function transferEther(uint _tier) external onlyIfRunning onlyEtheraffle {
        if(_tier == 0){
            require(now > crowdSaleStart && tierZeroTotal > 0);
            etheraffleMultiSig.transfer(tierZeroTotal);
            LogEtherTransfer(msg.sender, tierZeroTotal, now);
            tierZeroTotal = 0;
            return;
        } else if(_tier == 1){
            require(now > tierOneEnd && tierOneTotal > 0);
            etheraffleMultiSig.transfer(tierOneTotal);
            LogEtherTransfer(msg.sender, tierOneTotal, now);
            tierOneTotal = 0;
            return;
        } else if(_tier == 2){
            require(now > tierTwoEnd && tierTwoTotal > 0);
            etheraffleMultiSig.transfer(tierTwoTotal);
            LogEtherTransfer(msg.sender, tierTwoTotal, now);
            tierTwoTotal = 0;
            return;
        } else if(_tier == 3){
            require(now > crowdSaleEnd && tierThreeTotal > 0);
            etheraffleMultiSig.transfer(tierThreeTotal);
            LogEtherTransfer(msg.sender, tierThreeTotal, now);
            tierThreeTotal = 0;
            return;
        } else {
          return;
        }
    }

    function refundEther() external onlyIfNotRunning {
        uint amount;
        if(tierZero[msg.sender] > 0) {
          amount += tierZero[msg.sender];
          tierZero[msg.sender] = 0;
        }
        if(tierOne[msg.sender] > 0) {
          amount += tierOne[msg.sender];
          tierOne[msg.sender] = 0;
        }
        if(tierTwo[msg.sender] > 0) {
          amount += tierTwo[msg.sender];
          tierTwo[msg.sender] = 0;
        }
        if(tierThree[msg.sender] > 0) {
          amount += tierThree[msg.sender];
          tierThree[msg.sender] = 0;
        }
        msg.sender.transfer(amount);
        LogRefund(msg.sender, amount, now);
        return;
    }
    event LogRefund(address toWhom, uint amountOfEther, uint atTime);



    function setCrowdSaleStatus(bool _status) external onlyEtheraffle {
        crowdSaleRunning = _status;
    }


    /**
     * @dev This function is what allows this contract to receive ERC223
     *      compliant tokens. Any tokens sent to this address will fire off
     *      an event announcing their arrival. Unlike ERC20 tokens, ERC223
     *      tokens cannot be sent to contracts where this function is absent,
     *      thereby preventing loss of tokens by mistakenly sending them to
     *      contracts not designed to accept them.
     *
     * @param _from     From whom the transfer originated
     * @param _value    How many tokens were sent
     * @param _data     Any additional data send with the transfer
     */
    function tokenFallback(address _from, uint256 _value, bytes _data) public {
        if (_value > 0){
            /* Fire the event logger to announce token arrival */
            LogTokenDeposit(_from, msg.sender, _value);
        }
    }

    ////////////////////////////////////////////////////////////////////
    ////////TESTING PURPOSES ONLY!!!////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    function getNow() public constant returns (uint timeNow) {
        return now;
    }

    function returnTokens() public {
        uint amount = LOT.balanceOf(this);
        LOT.transfer(etheraffleMultiSig, amount);
    }

    function returnEther() public {
        etheraffleMultiSig.transfer(this.balance);
    }

    /**
     * @dev Once the crowdfund is over this function will delete the code from
     *      the contract thus freeing up space on the blockchain. Any ether
     *      remaining in the contract is send to the Etheraffle multisig wallet.
     *      Only the Etheraffle multisig can call this function.
     */
    function selfDestruct() external onlyEtheraffle {
        /* Deletes the contract's code and sends any remaining ether to the multisig */
        selfdestruct(etheraffleMultiSig);
    }

  }
