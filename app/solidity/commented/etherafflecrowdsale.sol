/*
Deploy string: 1509278100, "0x929fc0a7a548c7abf0d6ebf08f7fd3890cc57970","0xB7Ea14973700361dc1cb5dF0bC513051D480437d","0xB7Ea14973700361dc1cb5dF0bC513051D480437d"


redeemBonusTkts function sig: "0x73635a99"

var icoAdd = "0xa7abcd38847c02c07b08e8b523374a3e14b35bb4"
var icoABI = eth.contract([{"constant":true,"inputs":[],"name":"tierOneEnd","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tierOneTotal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"etheraffleDapp","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tierOne","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxWeiPerTier","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finalTransfers","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tierOneTkts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"crowdSaleStart","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"crowdSaleEnd","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"etheraffleTkt","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tierTwoTotal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"withdrawBefore","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"redeemBonusTkts","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tierThreeTkts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tierThreeTotal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"selfDestruct","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tierTwo","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tierThree","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tierTwoEnd","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bonusTktsRedeemed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tierTwoTkts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getNow","outputs":[{"name":"timeNow","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tktTotalOne","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bonusTkts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tktTotalThree","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"etheraffleMultiSig","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"returnEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tktTotalTwo","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"returnTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_start","type":"uint256"},{"name":"_tkt","type":"address"},{"name":"_multiSig","type":"address"},{"name":"_dapp","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"byWhom","type":"address"},{"indexed":false,"name":"inTier","type":"uint256"},{"indexed":false,"name":"ethAmount","type":"uint256"},{"indexed":false,"name":"tktAmount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogTktPurchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"toWhom","type":"address"},{"indexed":false,"name":"tktAmount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogTktTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"toWhom","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogEtherTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"tokenContract","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"LogTokenDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"toWhom","type":"address"},{"indexed":false,"name":"tktAmount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogBonusTktTransfer","type":"event"}])


*/
/**
* TODO: sort out token contract and minting of correct amount
* TODO: test deploy of raffle contract with time to end shortly after tests...
* TODO: maybe create all tkt tokens and have them sent to the crowdsale contract for easy transfers?
* TODO: import... basically imports the interface. Can use a generic erco20 one for this in order to transfer tkt tokens. The multisig will need the specific tkt token contract one in order to clal the freeze function if necessary.
* TODO: import "./ERC20.sol"; myToken = ERC20(tokenAddress); myToken.balanceOf(hodler); myToken.transfer(_to, _amount); etc
* TODO: don't think i need to track total tickets sold afterall??
* TODO: tier zero, need a function in the ICO that's something like isTierZero(address _address) public returns(bool isTierZero){ //check here }
*/
pragma solidity^0.4.15;

contract ERC223Interface {
    /* Abstract interface contract for acquiring function signatures */
    function balanceOf(address who) constant public returns (uint) {}
    function transfer(address to, uint value) public {}
}

contract EtheraffleCrowdSale is ERC223Interface {

    /* Tkt reward per ether in tier one */
    //uint public constant tierOneTkts = 10000;

    //TESTING
    uint public constant tierOneTkts = 3000000;

    /* Tkt reward per ether in tier two */
    //uint public constant tierTwoTkts = 9000;

    //TESTING
    uint public constant tierTwoTkts = 2000000;

    /* Tkt reward per ether in tier three */
    //uint public constant tierThreeTkts = 8000;

    //TESTING
    uint public constant tierThreeTkts = 1000000;


    /* Bonus tickets multiplier */
    uint public constant bonusTkts = 1000000;
    /* Maximum amount of ether investable per tier (15,000 ether) */
    //uint public constant maxWeiPerTier = 15000 * 10 ** 18;

    uint public constant maxWeiPerTier = 2 * 10 ** 18;

    /* Tier one end time in UTC format */
    uint public tierOneEnd;
    /* Tier two end time in UTC format */
    uint public tierTwoEnd;
    /* Crowdsale begin time in UTC format */
    uint public crowdSaleStart;
    /* Crowdsale end time in UTC format */
    uint public crowdSaleEnd;
    /* Withdraw before time in UTC format, set for one week after crowdsale ends */
    uint public withdrawBefore;//time limited w/d after which tokens are no longer minted.
    /* Variable to track amount of purchases in tier one (in wei) */
    uint public tierOneTotal;
    /* Variable to track amount of purchases in tier two (in wei) */
    uint public tierTwoTotal;
    /* Variable to track amount of purchases in tier three (in wei) */
    uint public tierThreeTotal;
    /* Variable to track number of tier one tkt tokens sold */
    uint public tktTotalOne;
    /* Variable to track number of tier  tkt tokens sold */
    uint public tktTotalTwo;
    /* Variable to track number of tier three tkt tokens sold */
    uint public tktTotalThree;
    /* Variable to track number of bonus tkts redeemed */
    uint public bonusTktsRedeemed;
    /* Etheraffle's Dapp contract address */
    address public etheraffleDapp;//etheraffle Dapp
    /* Etheraffle's multisig wallet address */
    address public etheraffleMultiSig;
    /* Etheraffle's tk token contract address */
    address public etheraffleTkt;
    /* Map of purchasers ethererum address to the amount of wei they are spending */
    mapping (address => uint) public tierOne;
    /* Map of purchasers ethererum address to the amount of wei they are spending */
    mapping (address => uint) public tierTwo;
    /* Map of purchasers ethererum address to the amount of wei they are spending */
    mapping (address => uint) public tierThree;
    /* Instantiate the variable to hold Etheraffle's token-contract instance */
    ERC223Interface tktToken;

    /* Event logger for ticket purchases */
    event LogTktPurchase(address byWhom, uint inTier, uint ethAmount, uint tktAmount, uint atTime);
    /* Event logger for outgoing token transfers */
    event LogTktTransfer(address toWhom, uint tktAmount, uint atTime);
    /* Event logger for outgoing ether transfers */
    event LogEtherTransfer(address toWhom, uint amount, uint atTime);
    /* Event logger for token transfers */
    event LogTokenDeposit(address from, address tokenContract, uint value);
    /* Event logger for bonus tkt redemptions */
    event LogBonusTktTransfer(address toWhom, uint tktAmount, uint atTime);

    /**
     * @dev Modifier function to prepend to later functions in this contract in
     *      order to redner them only useable by the Etheraffle MultiSig wallet.
     */
    modifier onlyEtheraffle() {
        require(msg.sender == etheraffleMultiSig);
        _;
    }

    /**
    * @dev  Constructor function. Runs once on contract creation and sets up the
    *       various variables pertaining to the ICO start & end times, the tier
    *       start & end times, and the various relevant Etheraffle contract
    *       addresses: The Etheraffle DApp, the Etheraffle MultiSig Wallet & the
    *       Etheraffle Token contract.
    *
    * @param _start     Start time of crowdfund in UTC format
    * @param _tkt       Address of the Etheraffle token contract
    * @param _multiSig  Address of Etheraffle's managerial multisig wallet
    * @param _dapp      Address of the Etheraffle Dapp
    */
    function EtheraffleCrowdSale(uint _start, address _tkt, address _multiSig, address _dapp) public {
        etheraffleDapp = _dapp;
        etheraffleMultiSig = _multiSig;
        etheraffleTkt = _tkt;
        /* One week in seconds */
        //uint week = 604800;

        uint week = 300;//testing purposes, tiers last five minutes now!

        /* UTC Start time of crowdfund */
        crowdSaleStart = _start;
        /* End of tier one of crowdsale in UTC format */
        tierOneEnd = _start + week;//one week after start...
        /* End of tier two of crowdsale in UTC format */
        tierTwoEnd = _start + (2 * week);//two weeks after start...
        /* Crowd sale end time in UTC format */
        crowdSaleEnd = _start + (4 * week);

        withdrawBefore = _start + (5 * week);

        //tktToken = token(tokenAddress);//instantiate the token contract - can now use tktToken.transfer...
        //ERC223Interface tktToken = ERC223Interface(_tkt);
        //tktToken = ERC223(0x929fc0a7a548c7abf0d6ebf08f7fd3890cc57970);
        tktToken = ERC223Interface(_tkt);
    }

    /**
    * @dev  Purchase tkt tokens.
    *       Tkt tokens are sent in accordance with how much ether is invested, and in what
    *       tier the investment was made in. The function also stores the amount of ether
    *       invested for later conversion to the amount of bonus tkt tokens owed. Once the
    *       crowdsale is over and the final number of tokens sold is known, the purchaser's
    *       bonuses can be calculated. Using the fallback function allows tkt purchasers to
    *       simply send ether to this address in order to buy tokens, without them having
    *       to call a function. The requirements also also mean that once the crowdsale is
    *       over, any ether sent to this address by accident will be returned to the sender
    *       and not lost.
    */
    function () public payable {//Gas: 102074 if new investor (sets up the structs), 57074 if not new investor.
        /* Requires the crowdsale time window to be open and the function caller to send ether */
        require
        (
            now > crowdSaleStart &&
            now <= crowdSaleEnd &&
            msg.value > 0
        );
        uint numberOfTkts = 0;
        if (now <= tierOneEnd) {// ∴ tier one...
            /* Eth investable in each tier is capped via this requirement */
            require(tierOneTotal + msg.value <= maxWeiPerTier);
            /* Store purchasers purchased amount plus add it to total in this tier */
            tierOne[msg.sender] += msg.value;
            /* Track total investment in tier one */
            tierOneTotal += msg.value;
            /* Number of tkts this tier's purchase results in */
            numberOfTkts = (msg.value * tierOneTkts) / (1 * 10 ** 18);
            /* Increment total number of tkts sold */
            tktTotalOne += numberOfTkts;
            /* Transfer number of tkts bought to the purchaser */
            tktToken.transfer(msg.sender, numberOfTkts);
            /* Log the tkt purchase event */
            LogTktPurchase(msg.sender, 1, msg.value, numberOfTkts, now);
            return;
        } else if (now <= tierTwoEnd) {// ∴ tier two...
            /* Eth investable in each tier is capped via this requirement */
            require(tierTwoTotal + msg.value <= maxWeiPerTier);
            /* Store purchasers purchased amount plus add it to total in this tier */
            tierTwo[msg.sender] += msg.value;
            /* Track total investment in tier two */
            tierTwoTotal += msg.value;
            /* Number of tkts this tier's purchase results in */
            numberOfTkts = (msg.value * tierTwoTkts) / (1 * 10 ** 18);
            /* Increment total number of tkts sold */
            tktTotalTwo += numberOfTkts;
            /* Transfer number of tkts bought to the purchaser */
            tktToken.transfer(msg.sender, numberOfTkts);
            /* Log the tkt purchase event */
            LogTktPurchase(msg.sender, 2, msg.value, numberOfTkts, now);
            return;
        } else {// ∴ tier three...
            /* Eth investable in each tier is capped via this requirement */
            require(tierThreeTotal + msg.value <= maxWeiPerTier);
            /* Store purchasers purchased amount plus add it to total in this tier */
            //tierThree[msg.sender] += msg.value;
            /* Track total investment in tier three */
            tierThreeTotal += msg.value;
            /* Number of tkts this tier's purchase results in */
            numberOfTkts = (msg.value * tierThreeTkts) / (1 * 10 ** 18);
            /* Increment total number of tkts sold */
            tktTotalThree += numberOfTkts;
            /* Transfer number of tkts bought to the purchaser */
            tktToken.transfer(msg.sender, numberOfTkts);
            /* Log the tkt purchase event */
            LogTktPurchase(msg.sender, 3, msg.value, numberOfTkts, now);
            return;
        }
    }

    /**
    * @dev  Redeem bonus tkts: This function cannot be called until the crowdsale
    *       is over, nor one further week after the crowdsale ends. During this
    *       window, a tkt purchaser calls this function in order to receive their
    *       bonus tkt tokens owed to them, as calculated by the total amount of
    *       tkt sales in the tiers following their purchase.
    */
    function redeemBonusTkts() external { //81k gas
        /* Requires crowdsale to be over and the withdrawBefore time to not have passed yet */
        require
        (
            now > crowdSaleEnd &&
            now < withdrawBefore
        );
        /* Requires user to have a tkt purchase in at least one of the bonus-eligible tiers. */
        require
        (
            tierOne[msg.sender] > 0 ||
            tierTwo[msg.sender] > 0
        );
        /* Variable to store the users bonus tkt amount as it is calculated */
        uint bonusTktAmount = 0;
        /* If purchaser has ether in this tier, tkt tokens owed is calculated and added to tkt amount */
        if(tierOne[msg.sender] > 0){
            bonusTktAmount +=
            /* Calculate share of bonus tkt user is entitled to, based on tier two sales */
            //NB Solidity truncates EVERY division! So it's refactored to only truncate once...
            //preserves most accuracy...
            //don't need safe math because div by zero impossible here
            //plus the theoretical max numerator = (15000*(1*10**18))*(15000*(1*10**18))*1000000 and that is MUCH smaller
            //than 2**256! Yay!
            //((((tierTwoTotal / (1 * 10 ** 18)) * bonusTkts) * tierOne[msg.sender]) / tierOneTotal) +
            ((tierTwoTotal * bonusTkts * tierOne[msg.sender]) / (tierOneTotal * (1 * 10 ** 18))) +
            /* Calculate share of bonus tkt user is entitled to, based on tier three sales */
            ((tierThreeTotal * bonusTkts * tierOne[msg.sender]) / (tierOneTotal * (1 * 10 ** 18)));
            /* Zero amount of ether in this tier to make further bonus redemptions impossible */
            tierOne[msg.sender] = 0;
        }
        /* If purchaser has ether in this tier, tkt tokens owed is calculated and added to tkt amount */
        if(tierTwo[msg.sender] > 0){
            bonusTktAmount +=
            /* Calculate share of bonus tkt user is entitled to, based on tier three sales */
            //((((tierThreeTotal / (1 * 10 ** 18)) * bonusTkts) * tierTwo[msg.sender]) / tierTwoTotal);
            ((tierThreeTotal * bonusTkts * tierTwo[msg.sender]) / (tierTwoTotal * (1 * 10 ** 18)));
            /* Zero amount of ether in this tier to make further bonus redemptions impossible */
            tierTwo[msg.sender] = 0;
        }
        /* Final check that user cannot withdraw twice */
        require
        (
            tierOne[msg.sender] == 0 &&
            tierTwo[msg.sender] == 0
        );
        /* Transfer tkts to bonus redeemer */
        tktToken.transfer(msg.sender, bonusTktAmount);
        /* Log the tkt transfer of these bonus tkts to the redeemer */
        LogBonusTktTransfer(msg.sender, bonusTktAmount, now);
    }

    /**
    * @dev    Function callable only after crowdsale is over and only by
    *         Etheraffle's multi-sig wallet. Transfers remaining tkts to
    *         Etheraffle's multi-sig wallet along with the proceeds of
    *         the crowdsale. 40% of ether raised goes towards the dapp.
    */
    function finalTransfers() external onlyEtheraffle {
        /* Only callable once the crowdsale AND user withdrawal periods are over. */
        require(now > withdrawBefore);
        /* Get this contract's remaining balance of tkt tokens */
        uint amount = tktToken.balanceOf(this);
        /* Transfer those tkt tokens to the multisig wallet */
        tktToken.transfer(etheraffleMultiSig, amount);
        /* Transfer the proceeds of this crowdsale to the multisig wallet */
        etheraffleMultiSig.transfer(this.balance);
        /* Log the tkt transfer */
        LogTktTransfer(msg.sender, amount, now);
        /* Log the ether transfer */
        LogEtherTransfer(msg.sender, this.balance, now);
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

    function isTierZero(address _address) public returns (bool isTierZero){
      //TODO: logic here
    }

    ////////////////////////////////////////////////////////////////////
    ////////TESTING PURPOSES ONLY!!!////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    function getNow() public constant returns (uint timeNow) {
        return now;
    }

    function returnTokens() public {
        uint amount = tktToken.balanceOf(this);
        tktToken.transfer(etheraffleMultiSig, amount);
    }

    function returnEther() public {
        etheraffleMultiSig.transfer(this.balance);
    }

  }
