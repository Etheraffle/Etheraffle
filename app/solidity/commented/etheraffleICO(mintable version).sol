/*
EtheraffleMultisig: "0x97f535e98cf250cdd7ff0cb9b29e4548b609a0bd"
Start time: 1514764800//1st Jan 2018 00:00am
Deploy string: 1514764800, "0x41773c3c466438E8E9549BE6238BdF5b8F7262CC","0x97f535e98cf250cdd7ff0cb9b29e4548b609a0bd"

redeemBonusLot function sig: "0x73635a99"

*/
/**
* TODO: give minting powers to the ICO on the FreeLOT contract.
* TODO: Publish this first then the LOT token, giving it this address...
*
* NB: Don't need safe math because div by zero impossible here
* plus the theoretical max numerator = (15000*(1*10**18))*(15000*(1*10**18))*1000000 and that is MUCH smaller
* than 2**256! Yay!
*
* RINKEBY: uint _start, address _LOT, address _freeLOT, address _msig
* Deploy string:
TIMEHERE,'0xd655f80a2e60329647f15c4b53efd30cf9c63d4b','0x11c646018576a1c0102a4e1c55b3f97250b35c5b','0xb7ea14973700361dc1cb5df0bc513051d480437d'
*/
pragma solidity^0.4.15;

contract EtheraffleLOT {
    function mint(address _to, uint _amt) external {}
    function transfer(address to, uint value) public {}
    function balanceOf(address who) constant public returns (uint) {}
}
contract EtheraffleICO is EtheraffleLOT {

    //TESTING
    //uint public constant tier0LOT = 1100000;
    //uint public constant tier1LOT = 3000000;
    //uint public constant tier2LOT = 2000000;
    //uint public constant tier3LOT = 1000000;

    /* Lot reward per ether in each tier */
    uint public constant tier0LOT = 120000;
    uint public constant tier1LOT = 100000;
    uint public constant tier2LOT = 90000;
    uint public constant tier3LOT = 80000;
    /* Bonus tickets multiplier */
    uint public constant bonusLOT     = 100000;
    uint public constant bonusFreeLOT = 5;
    /* Rate to gift Free LOT tokens (1 per 0.1 ether) */
    uint public constant freeLOTRate = 1 * 10 ** 17;
    /* Maximum amount of ether investable per tier (15,000 ether) */
    uint public constant maxWeiTier0 = 500   * 10 ** 18;
    uint public constant maxWeiTier1 = 2000  * 10 ** 18;
    uint public constant maxWeiTier2 = 6000  * 10 ** 18;
    uint public constant maxWeiTier3 = 18000 * 10 ** 18;
    /* Minimum investment (0.05 Ether) */
    uint public constant minWei = 5 * 10 ** 16;

    /* Crowdsale open, close, withdraw & tier times (UTC Format)*/
    uint public crowdSaleStart;
    uint public tier1End;
    uint public tier2End;
    uint public tier3End;
    uint public withdrawBefore;
    /* Variables to track amount of purchases in tier */
    uint public tier0Total;
    uint public tier1Total;
    uint public tier2Total;
    uint public tier3Total;
    /* Etheraffle's multisig wallet & LOT token addresses */
    address public etheraffle;
    /* Variable to track number of bonus LOT redeemed */
    uint public bonusLOTRedeemed;
    /* ICO status toggle */
    bool public ICORunning = true;
    /* Map of purchaser's ethereum addresses to their purchase amounts for calculating bonuses*/
    mapping (address => uint) public tier0;
    mapping (address => uint) public tier1;
    mapping (address => uint) public tier2;
    mapping (address => uint) public tier3;
    /* Store of whom invested in which tier for future contracts to query */
    address[] public tier0Investors;
    address[] public tier1Investors;
    address[] public tier2Investors;
    address[] public tier3Investors;
    /* Instantiate the variables to hold Etheraffle's LOT & halfLOT token contract instances */
    EtheraffleLOT LOT;
    EtheraffleLOT FreeLOT;
    /* Event loggers */
    event LogRefund(address toWhom, uint amountOfEther, uint atTime);
    event LogEtherTransfer(address toWhom, uint amount, uint atTime);
    event LogLotTransfer(address toWhom, uint lotAmount, uint atTime);
    event LogTokenDeposit(address from, address tokenContract, uint value);
    event LogBonusLOTRedemption(address toWhom, uint lotAmount, uint atTime);
    event LogLOTMinting(address byWhom, uint inTier, uint ethAmount, uint lotAmount, uint atTime);
    /**
     * @dev Modifier function to prepend to later functions in this contract in
     *      order to redner them only useable by the Etheraffle address.
     */
    modifier onlyEtheraffle() {
        require(msg.sender == etheraffle);
        _;
    }
    /**
     * @dev Modifier function to prepend to later functions rendering the method
     *      only callable if the crowdsale is running.
     */
    modifier onlyIfRunning() {
        require(ICORunning);
        _;
    }
    /**
     * @dev Modifier function to prepend to later functions rendering the method
     *      only callable if the crowdsale is NOT running.
     */
    modifier onlyIfNotRunning() {
        require(!ICORunning);
        _;
    }
    /**
    * @dev  Constructor. Sets up the variables pertaining to the ICO start &
    *       end times, the tier start & end times, the Etheraffle MultiSig Wallet
    *       address & the Etheraffle LOT & FreeLOT token contracts.
    *
    * @param _start     Start time of crowdfund in UTC format
    * @param _LOT       Address of the Etheraffle LOT token contract
    * @param _freeLOT   Address of the Etheraffle freeLOT token contract
    * @param _msig      Address of Etheraffle's managerial multisig wallet
    */
    function EtheraffleICO(uint _start, address _LOT, address _freeLOT, address _msig) public {
        etheraffle     = _msig;
        crowdSaleStart = _start;
        tier1End       = _start   + (10 * 86400);
        tier2End       = tier1End + (20 * 86400);
        tier3End       = tier2End + (30 * 86400);
        withdrawBefore = tier3End + (14 * 86400);
        FreeLOT        = EtheraffleLOT(_freeLOT);
        LOT            = EtheraffleLOT(_LOT);
    }

    /**
    * @dev  Purchase LOT tokens.
    *       LOT are sent in accordance with how much ether is invested, and in what
    *       tier the investment was made in. The function also stores the amount of ether
    *       invested for later conversion to the amount of bonus LOT owed. Once the
    *       crowdsale is over and the final number of tokens sold is known, the purchaser's
    *       bonuses can be calculated. Using the fallback function allows LOT purchasers to
    *       simply send ether to this address in order to purchase LOT, without having
    *       to call a function. The requirements also also mean that once the crowdsale is
    *       over, any ether sent to this address by accident will be returned to the sender
    *       and not lost.
    */
    function () public payable onlyIfRunning {//Gas: 102074 if new investor (sets up the structs), 57074 if not new investor.
        /* Requires the crowdsale time window to be open and the function caller to send ether */
        require
        (
            //now > crowdSaleStart &&//tier zero currently open!
            now <= tier3End &&
            msg.value >= minWei
        );
        uint numLOT = 0;
        if (now <= crowdSaleStart){// ∴ tier zero...
            /* Eth investable in each tier is capped via this requirement */
            require(tier0Total + msg.value <= maxWeiTier0);
            /* Store purchasers purchased amount for later bonus redemption */
            tier0[msg.sender] += msg.value;
            /* Track total investment in tier one for later bonus calculation */
            tier0Total += msg.value;
            /* Number of LOT this tier's purchase results in */
            numLOT = (msg.value * tier0LOT) / (1 * 10 ** 18);
            /* Mint the number of LOT bought and transfer to the purchaser */
            LOT.mint(msg.sender, numLOT);
            /* Log the  minting event */
            LogLOTMinting(msg.sender, 0, msg.value, numLOT, now);
            return;
        } else if (now <= tier1End) {// ∴ tier one...
            require(tier1Total + msg.value <= maxWeiTier1);
            tier1[msg.sender] += msg.value;
            tier1Total += msg.value;
            numLOT = (msg.value * tier1LOT) / (1 * 10 ** 18);
            LOT.mint(msg.sender, numLOT);
            LogLOTMinting(msg.sender, 1, msg.value, numLOT, now);
            return;
        } else if (now <= tier2End) {// ∴ tier two...
            require(tier2Total + msg.value <= maxWeiTier2);
            tier2[msg.sender] += msg.value;
            tier2Total += msg.value;
            numLOT = (msg.value * tier2LOT) / (1 * 10 ** 18);
            LOT.mint(msg.sender, numLOT);
            LogLOTMinting(msg.sender, 2, msg.value, numLOT, now);
            return;
        } else {// ∴ tier three...
            require(tier3Total + msg.value <= maxWeiTier3);
            tier3[msg.sender] += msg.value;
            tier3Total += msg.value;
            numLOT = (msg.value * tier3LOT) / (1 * 10 ** 18);
            LOT.mint(msg.sender, numLOT);
            LogLOTMinting(msg.sender, 3, msg.value, numLOT, now);
            return;
        }
    }
    /**
    * @dev  Redeem bonus LOT: This function cannot be called until the crowdsale
    *       is over, nor after two further weeks beyond the crowdsale end. During this
    *       window, a LOT purchaser calls this function in order to receive their
    *       bonus LOT owed to them, as calculated by the total amount of
    *       LOT sales in the tier(s) following their purchase.
    */
    function redeemBonusLot() external onlyIfRunning { //81k gas
        /* Requires crowdsale to be over and the withdrawBefore time to not have passed yet */
        require
        (
            now > tier3End &&
            now < withdrawBefore
        );
        /* Requires user to have a LOT purchase in at least one of the bonus-eligible tiers. */
        require
        (
            tier0[msg.sender] > 0 ||
            tier1[msg.sender] > 0 ||
            tier2[msg.sender] > 0
        );
        uint bonusNumLOT;
        /* If purchaser has ether in this tier, LOT tokens owed is calculated and added to LOT amount */
        if(tier0[msg.sender] > 0){
            bonusNumLOT +=
            /* Calculate share of bonus LOT user is entitled to, based on tier one sales */
            ((tier1Total * bonusLOT * tier0[msg.sender]) / (tier0Total * (1 * 10 ** 18))) +
            /* Calculate share of bonus LOT user is entitled to, based on tier two sales */
            ((tier2Total * bonusLOT * tier1[msg.sender]) / (tier1Total * (1 * 10 ** 18))) +
            /* Calculate share of bonus LOT user is entitled to, based on tier three sales */
            ((tier3Total * bonusLOT * tier1[msg.sender]) / (tier1Total * (1 * 10 ** 18)));
            /* Zero amount of ether in this tier to make further bonus redemptions impossible */
            tier0[msg.sender] = 0;
            /*Store ethereum address */
            tier0Investors.push(msg.sender);
        }
        if(tier1[msg.sender] > 0){
            bonusNumLOT +=
            ((tier2Total * bonusLOT * tier1[msg.sender]) / (tier1Total * (1 * 10 ** 18))) +
            ((tier3Total * bonusLOT * tier1[msg.sender]) / (tier1Total * (1 * 10 ** 18)));
            tier1[msg.sender] = 0;
            tier1Investors.push(msg.sender);
        }
        if(tier2[msg.sender] > 0){
            bonusNumLOT +=
            ((tier3Total * bonusLOT * tier2[msg.sender]) / (tier2Total * (1 * 10 ** 18)));
            tier2[msg.sender] = 0;
            tier2Investors.push(msg.sender);
        }
        /* Final check that user cannot withdraw twice */
        require
        (
            tier0[msg.sender] == 0 &&
            tier1[msg.sender]  == 0 &&
            tier2[msg.sender]  == 0
        );
        /* Mint LOT and give to bonus redeemer */
        LOT.mint(msg.sender, bonusNumLOT);
        /* Mint FreeLOT and give to bonus redeemer */
        FreeLOT.mint(msg.sender, bonusFreeLOT);
        /* Log the LOT transfer of these bonus LOT to the redeemer */
        LogBonusLOTRedemption(msg.sender, bonusNumLOT, now);
    }

    /**
    * @dev    Function callable only by Etheraffle's multi-sig wallet. It
    *         transfers the tier's earnt ether to the etheraffle multisig wallet
    *         once the tier is over.
    *
    * @param _tier    The tier from which the withdrawal is being made.
    */
    function transferEther(uint _tier) external onlyIfRunning onlyEtheraffle {
        if(_tier == 0) {
            /* Require tier zero to be over and a tier zero ether be greater than 0 */
            require(now > crowdSaleStart && tier0Total > 0);
            /* Transfer the tier zero total to the etheraffle multisig */
            etheraffle.transfer(tier0Total);
            /* Log the transfer event */
            LogEtherTransfer(msg.sender, tier0Total, now);
            return;
        } else if(_tier == 1) {
            require(now > tier1End && tier1Total > 0);
            etheraffle.transfer(tier1Total);
            LogEtherTransfer(msg.sender, tier1Total, now);
            return;
        } else if(_tier == 2) {
            require(now > tier2End && tier2Total > 0);
            etheraffle.transfer(tier2Total);
            LogEtherTransfer(msg.sender, tier2Total, now);
            return;
        } else if(_tier == 3) {
            require(now > tier3End && tier3Total > 0);
            etheraffle.transfer(tier3Total);
            LogEtherTransfer(msg.sender, tier3Total, now);
            return;
        } else if(_tier == 4) {
            require(now > tier3End && this.balance > 0);
            etheraffle.transfer(this.balance);
            LogEtherTransfer(msg.sender, this.balance, now);
            return;
        }
    }
    /**
    * @dev    Should crowdsale be cancelled for any reason once it has
    *         begun, any ether is refunded to the purchaser by calling
    *         this funcion. Function checks each tier in turn, totalling
    *         the amount whilst zeroing the balance, and finally makes
    *         the transfer.
    */
    function refundEther() external onlyIfNotRunning {
        uint amount;
        if(tier0[msg.sender] > 0) {
          /* Add balance of caller's address in this tier to the amount */
          amount += tier0[msg.sender];
          /* Zero callers balance in this tier */
          tier0[msg.sender] = 0;
        }
        if(tier1[msg.sender] > 0) {
          amount += tier1[msg.sender];
          tier1[msg.sender] = 0;
        }
        if(tier2[msg.sender] > 0) {
          amount += tier2[msg.sender];
          tier2[msg.sender] = 0;
        }
        if(tier3[msg.sender] > 0) {
          amount += tier3[msg.sender];
          tier3[msg.sender] = 0;
        }
        /* Transfer the ether to the caller */
        msg.sender.transfer(amount);
        /* Log the refund */
        LogRefund(msg.sender, amount, now);
        return;
    }
    /**
    * @dev    Toggle crowdsale status. Only callable by the Etheraffle
    *         mutlisig account. If set to false, the refund function
    *         becomes live allow purchasers to withdraw their ether
    *
    */
    function setCrowdSaleStatus(bool _status) external onlyEtheraffle {
        ICORunning = _status;
    }
    /**
     * @dev This function is what allows this contract to receive EtheraffleLOT
     *      compliant tokens. Any tokens sent to this address will fire off
     *      an event announcing their arrival. Unlike ERC20 tokens, EtheraffleLOT
     *      tokens cannot be sent to contracts where this function is absent,
     *      thereby preventing loss of tokens by mistakenly sending them to
     *      contracts not designed to accept them.
     *
     * @param _from     From whom the transfer originated
     * @param _value    How many tokens were sent
     * @param _data     Any additional data send with the transfer
     */
     /*
    function tokenFallback(address _from, uint256 _value, bytes _data) public {
        if (_value > 0){
            LogTokenDeposit(_from, msg.sender, _value);
        }
    }
    */
    ////////////////////////////////////////////////////////////////////
    ////////TESTING PURPOSES ONLY!!!////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    function getNow() public constant returns (uint timeNow) {
        return now;
    }

    function returnTokens() public {
        uint amount = LOT.balanceOf(this);
        LOT.transfer(etheraffle, amount);
    }

    function returnEther() public {
        etheraffle.transfer(this.balance);
    }

    /**
     * @dev   Housekeeping function in the event this contract is no
     *        longer needed. Will delete the code from the blockchain.
     */
    function selfDestruct() external onlyEtheraffle {
        selfdestruct(etheraffle);
    }

  }
