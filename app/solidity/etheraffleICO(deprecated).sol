/**
* TODO: Process for deploy:
* Before this contract, publish the LOT & freeLOT
* Publish this giving it the prev two addresses
* Transfer LOT balance to this ICO address
* Add this ICO address to the list of minters in the FreeLOT
*
* NB: Don't need safe math because div by zero impossible here
* plus the theoretical max numerator = (15000*(1*10**18))*(15000*(1*10**18))*1000000 and that is MUCH smaller
* than 2**256! Yay!
* NB redeemBonusLot function sig: "0x73635a99"
*
*
* String: address _LOT, address _freeLOT, address _msig
* OLD MAIN NET Deploy string:
"0x72b79424419139bf5f73848387D86ffA56054fb6","0x4c388dce25665ea602b92f15718ca278bba45a9a","0x97f535e98cf250CDd7Ff0cb9B29E4548b609A0bd"


*/
pragma solidity^0.4.15;

contract EtheraffleLOT {
    function mint(address _to, uint _amt) external {}
    function transfer(address to, uint value) public {}
    function balanceOf(address who) constant public returns (uint) {}
}
contract EtheraffleICO is EtheraffleLOT {

    /* Lot reward per ether in each tier */
    uint public constant tier0LOT = 110000 * 10 ** 6;
    uint public constant tier1LOT = 100000 * 10 ** 6;
    uint public constant tier2LOT =  90000 * 10 ** 6;
    uint public constant tier3LOT =  80000 * 10 ** 6;
    /* Bonus tickets multiplier */
    uint public constant bonusLOT     = 1500 * 10 ** 6;
    uint public constant bonusFreeLOT = 10;
    /* Maximum amount of ether investable per tier */
    uint public constant maxWeiTier0 = 700   * 10 ** 18;
    uint public constant maxWeiTier1 = 2500  * 10 ** 18;
    uint public constant maxWeiTier2 = 7000  * 10 ** 18;
    uint public constant maxWeiTier3 = 20000 * 10 ** 18;
    /* Minimum investment (0.025 Ether) */
    uint public constant minWei = 25 * 10 ** 15;
    /* Crowdsale open, close, withdraw & tier times (UTC Format)*/
    uint public ICOStart = 1520640000;
    uint public tier1End = 1521849600;
    uint public tier2End = 1523664000;
    uint public tier3End = 1526083200;
    uint public wdBefore = 1527292800;
    /* Variables to track amount of purchases in tier */
    uint public tier0Total;
    uint public tier1Total;
    uint public tier2Total;
    uint public tier3Total;
    /* Etheraffle's multisig wallet & LOT token addresses */
    address public etheraffle;
    /* ICO status toggle */
    bool public ICORunning = true;
    /* Map of purchaser's ethereum addresses to their purchase amounts for calculating bonuses*/
    mapping (address => uint) public tier0;
    mapping (address => uint) public tier1;
    mapping (address => uint) public tier2;
    mapping (address => uint) public tier3;
    /* Instantiate the variables to hold Etheraffle's LOT & halfLOT token contract instances */
    EtheraffleLOT LOT;
    EtheraffleLOT FreeLOT;
    /* Event loggers */
    event LogTokenDeposit(address indexed from, uint value, bytes data);
    event LogRefund(address indexed toWhom, uint amountOfEther, uint atTime);
    event LogEtherTransfer(address indexed toWhom, uint amount, uint atTime);
    event LogBonusLOTRedemption(address indexed toWhom, uint lotAmount, uint atTime);
    event LogLOTTransfer(address indexed toWhom, uint indexed inTier, uint ethAmt, uint LOTAmt, uint atTime);
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
    */
    function EtheraffleICO() public {//address _LOT, address _freeLOT, address _msig) public {
        etheraffle = 0x97f535e98cf250CDd7Ff0cb9B29E4548b609A0bd;
        LOT        = EtheraffleLOT(0x573ef20fc84fe9326e37ea82a9033c032c9ca9d1);
        FreeLOT    = EtheraffleLOT(0x4c388dce25665ea602b92f15718ca278bba45a9a);
        //ICOStart   = 1520640000;//10th March 2018 00:00
        //tier1End   = ICOStart + (14 * 86400);//1521849600
        //tier2End   = tier1End + (21 * 86400);//1523664000
        //tier3End   = tier2End + (28 * 86400);//1526083200
        //wdBefore   = tier3End + (14 * 86400);//1527292800
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
            now <= tier3End &&
            msg.value >= minWei
        );
        uint numLOT = 0;
        if (now <= ICOStart) {// ∴ tier zero...
            /* Eth investable in each tier is capped via this requirement */
            require(tier0Total + msg.value <= maxWeiTier0);
            /* Store purchasers purchased amount for later bonus redemption */
            tier0[msg.sender] += msg.value;
            /* Track total investment in tier one for later bonus calculation */
            tier0Total += msg.value;
            /* Number of LOT this tier's purchase results in */
            numLOT = (msg.value * tier0LOT) / (1 * 10 ** 18);
            /* Transfer the number of LOT bought to the purchaser */
            LOT.transfer(msg.sender, numLOT);
            /* Log the  transfer */
            LogLOTTransfer(msg.sender, 0, msg.value, numLOT, now);
            return;
        } else if (now <= tier1End) {// ∴ tier one...
            require(tier1Total + msg.value <= maxWeiTier1);
            tier1[msg.sender] += msg.value;
            tier1Total += msg.value;
            numLOT = (msg.value * tier1LOT) / (1 * 10 ** 18);
            LOT.transfer(msg.sender, numLOT);
            LogLOTTransfer(msg.sender, 1, msg.value, numLOT, now);
            return;
        } else if (now <= tier2End) {// ∴ tier two...
            require(tier2Total + msg.value <= maxWeiTier2);
            tier2[msg.sender] += msg.value;
            tier2Total += msg.value;
            numLOT = (msg.value * tier2LOT) / (1 * 10 ** 18);
            LOT.transfer(msg.sender, numLOT);
            LogLOTTransfer(msg.sender, 2, msg.value, numLOT, now);
            return;
        } else {// ∴ tier three...
            require(tier3Total + msg.value <= maxWeiTier3);
            tier3[msg.sender] += msg.value;
            tier3Total += msg.value;
            numLOT = (msg.value * tier3LOT) / (1 * 10 ** 18);
            LOT.transfer(msg.sender, numLOT);
            LogLOTTransfer(msg.sender, 3, msg.value, numLOT, now);
            return;
        }
    }
    /**
    * @dev      Redeem bonus LOT: This function cannot be called until
    *           the crowdsale is over, nor after the withdraw period.
    *           During this window, a LOT purchaser calls this function
    *           in order to receive their bonus LOT owed to them, as
    *           calculated by their share of the total amount of LOT
    *           sales in the tier(s) following their purchase. Once
    *           claimed, user's purchased amounts are set to 1 wei rather
    *           than zero, to allow the contract to maintain a list of
    *           purchasers in each. All investors, regardless of tier/amount,
    *           receive five free entries into the flagship Saturday
    *           Etheraffle via the FreeLOT token.
    */
    function redeemBonusLot() external onlyIfRunning { //81k gas
        /* Requires crowdsale to be over and the wdBefore time to not have passed yet */
        require
        (
            now > tier3End &&
            now < wdBefore
        );
        /* Requires user to have a LOT purchase in at least one of the tiers. */
        require
        (
            tier0[msg.sender] > 1 ||
            tier1[msg.sender] > 1 ||
            tier2[msg.sender] > 1 ||
            tier3[msg.sender] > 1
        );
        uint bonusNumLOT;
        /* If purchaser has ether in this tier, LOT tokens owed is calculated and added to LOT amount */
        if(tier0[msg.sender] > 1) {
            bonusNumLOT +=
            /* Calculate share of bonus LOT user is entitled to, based on tier one sales */
            ((tier1Total * bonusLOT * tier0[msg.sender]) / (tier0Total * (1 * 10 ** 18))) +
            /* Calculate share of bonus LOT user is entitled to, based on tier two sales */
            ((tier2Total * bonusLOT * tier0[msg.sender]) / (tier0Total * (1 * 10 ** 18))) +
            /* Calculate share of bonus LOT user is entitled to, based on tier three sales */
            ((tier3Total * bonusLOT * tier0[msg.sender]) / (tier0Total * (1 * 10 ** 18)));
            /* Set amount of ether in this tier to 1 to make further bonus redemptions impossible */
            tier0[msg.sender] = 1;
        }
        if(tier1[msg.sender] > 1) {
            bonusNumLOT +=
            ((tier2Total * bonusLOT * tier1[msg.sender]) / (tier1Total * (1 * 10 ** 18))) +
            ((tier3Total * bonusLOT * tier1[msg.sender]) / (tier1Total * (1 * 10 ** 18)));
            tier1[msg.sender] = 1;
        }
        if(tier2[msg.sender] > 1) {
            bonusNumLOT +=
            ((tier3Total * bonusLOT * tier2[msg.sender]) / (tier2Total * (1 * 10 ** 18)));
            tier2[msg.sender] = 1;
        }
        if(tier3[msg.sender] > 1) {
            tier3[msg.sender] = 1;
        }
        /* Final check that user cannot withdraw twice */
        require
        (
            tier0[msg.sender]  <= 1 &&
            tier1[msg.sender]  <= 1 &&
            tier2[msg.sender]  <= 1 &&
            tier3[msg.sender]  <= 1
        );
        /* Transfer bonus LOT to bonus redeemer */
        if(bonusNumLOT > 0) {
            LOT.transfer(msg.sender, bonusNumLOT);
        }
        /* Mint FreeLOT and give to bonus redeemer */
        FreeLOT.mint(msg.sender, bonusFreeLOT);
        /* Log the bonus LOT redemption */
        LogBonusLOTRedemption(msg.sender, bonusNumLOT, now);
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
        if(tier0[msg.sender] > 1) {
            /* Add balance of caller's address in this tier to the amount */
            amount += tier0[msg.sender];
            /* Zero callers balance in this tier */
            tier0[msg.sender] = 0;
        }
        if(tier1[msg.sender] > 1) {
            amount += tier1[msg.sender];
            tier1[msg.sender] = 0;
        }
        if(tier2[msg.sender] > 1) {
            amount += tier2[msg.sender];
            tier2[msg.sender] = 0;
        }
        if(tier3[msg.sender] > 1) {
            amount += tier3[msg.sender];
            tier3[msg.sender] = 0;
        }
        /* Final check that user cannot be refunded twice */
        require
        (
            tier0[msg.sender] == 0 &&
            tier1[msg.sender] == 0 &&
            tier2[msg.sender] == 0 &&
            tier3[msg.sender] == 0
        );
        /* Transfer the ether to the caller */
        msg.sender.transfer(amount);
        /* Log the refund */
        LogRefund(msg.sender, amount, now);
        return;
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
            require(now > ICOStart && tier0Total > 0);
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
    * @dev    Function callable only by Etheraffle's multi-sig wallet.
    *         It transfers any remaining unsold LOT tokens to the
    *         Etheraffle multisig wallet. Function only callable once
    *         the withdraw period and ∴ the ICO ends.
    */
    function transferLOT() onlyEtheraffle onlyIfRunning external {
        require(now > wdBefore);
        uint amt = LOT.balanceOf(this);
        LOT.transfer(etheraffle, amt);
        LogLOTTransfer(msg.sender, 5, 0, amt, now);
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
     * @dev This function is what allows this contract to receive ERC223
     *      compliant tokens. Any tokens sent to this address will fire off
     *      an event announcing their arrival. Unlike ERC20 tokens, ERC223
     *      tokens cannot be sent to contracts absent this function,
     *      thereby preventing loss of tokens by mistakenly sending them to
     *      contracts not designed to accept them.
     *
     * @param _from     From whom the transfer originated
     * @param _value    How many tokens were sent
     * @param _data     Transaction metadata
     */
    function tokenFallback(address _from, uint _value, bytes _data) public {
        if (_value > 0) {
            LogTokenDeposit(_from, _value, _data);
        }
    }
    /**
     * @dev   Housekeeping function in the event this contract is no
     *        longer needed. Will delete the code from the blockchain.
     */
    function selfDestruct() external onlyIfNotRunning onlyEtheraffle {
        selfdestruct(etheraffle);
    }
}
/* Function used for developing purposes */
  /**
   * @dev   Function returns the current tier the ICO is in.
   */
   /*
  function getTier() external constant returns (uint) {
      if(now <= ICOStart) {
          return 0;
      } else if(now <= tier1End) {
          return 1;
      } else if(now <= tier2End) {
          return 2;
      } else if(now <= tier3End) {
          return 3;
      } else if(now <= wdBefore) {// ∴ Withdrawal period open
          return 4;
      } else if(now > wdBefore) {// ∴ Ico over
          return 5;
      }
  }
  */
  ////////////////////////////////////////////////////////////////////
  ////////TESTING PURPOSES ONLY!!!////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
/*
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
*/


/*
Main Chain

0x48eE247887Bb9c2bb170FD95C4C4Fbe6dbc9E8f0

[{"constant":true,"inputs":[],"name":"maxWeiTier2","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tier3","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tier3LOT","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"maxWeiTier3","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amt","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tier0Total","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tier1","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tier3Total","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tier0LOT","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tier1LOT","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"refundEther","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"transferLOT","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"bonusLOT","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"redeemBonusLot","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tier2End","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"maxWeiTier0","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"wdBefore","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_tier","type":"uint256"}],"name":"transferEther","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_status","type":"bool"}],"name":"setCrowdSaleStatus","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tier2Total","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"bonusFreeLOT","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"etheraffle","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"maxWeiTier1","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tier2LOT","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tier2","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"tokenFallback","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ICORunning","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tier1End","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ICOStart","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tier3End","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tier1Total","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tier0","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"LogTokenDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"toWhom","type":"address"},{"indexed":false,"name":"amountOfEther","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogRefund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"toWhom","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogEtherTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"toWhom","type":"address"},{"indexed":false,"name":"lotAmount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogBonusLOTRedemption","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"toWhom","type":"address"},{"indexed":true,"name":"inTier","type":"uint256"},{"indexed":false,"name":"ethAmt","type":"uint256"},{"indexed":false,"name":"LOTAmt","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogLOTTransfer","type":"event"}]

The bytecode used in the MEW deploy:

0x6060604052635aa32000600055635ab59500600155635ad14480600255635af62e80600355635b08a3806004556009805460a060020a60ff02191674010000000000000000000000000000000000000000179055341561005b57fe5b5b60098054600160a060020a03199081167397f535e98cf250cdd7ff0cb9b29e4548b609a0bd17909155600e8054821673573ef20fc84fe9326e37ea82a9033c032c9ca9d1179055600f8054909116734c388dce25665ea602b92f15718ca278bba45a9a1790555b5b6119ff806100d36000396000f300606060405236156101be5763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041662498257811461063757806306f639fe146106595780631770616c146106875780633cef51c5146106a957806340c10f19146106cb578063428a8120146106ec57806343bae1ba1461070e57806348dfe1751461073c5780634b3955a51461075e5780634f96f44614610780578063560ed6a1146107a25780635967dee8146107b45780635af3e9d7146107c65780635fccf40a146107e857806362463079146107fa5780636869fb301461081c5780636d7041591461083e57806370a082311461086057806373ffd5b71461088e5780637910830a146108a35780637b36277e146108ba57806385b8c64a146108dc5780638ca17755146108fe5780639aae3d0e1461092a5780639cb8a26a1461094c578063a553c4d21461095e578063a9059cbb146106cb578063a96a66d2146109a1578063addd7020146109cf578063c0ee0b8a146109f1578063c3fbc63214610a56578063c8bffa9314610a7a578063d01ab31a14610a9c578063d6c5a41e14610abe578063eba5630214610ae0578063ffcb39c214610b02575b6106355b60095460009060a060020a900460ff1615156101de5760006000fd5b60035442111580156101f757506658d15e176280003410155b15156102035760006000fd5b50600080544211610312576825f273933db570000034600554011115151561022b5760006000fd5b600160a060020a0333166000908152600a602052604090208054349081019091556005805482019055670de0b6b3a76400009064199c82cc00025b600e546040805160e060020a63a9059cbb028152600160a060020a0333811660048301529490930460248401819052905190945092169163a9059cbb9160448082019260009290919082900301818387803b15156102c057fe5b6102c65a03f115156102ce57fe5b505060408051348152602081018490524281830152905160009250600160a060020a033316916000805160206119b4833981519152919081900360600190a361062e565b600154421161041f5768878678326eac9000003460065401111515156103385760006000fd5b600160a060020a0333166000908152600b602052604090208054349081019091556006805482019055670de0b6b3a76400009064174876e800025b600e546040805160e060020a63a9059cbb028152600160a060020a0333811660048301529490930460248401819052905190945092169163a9059cbb9160448082019260009290919082900301818387803b15156103cd57fe5b6102c65a03f115156103db57fe5b505060408051348152602081018490524281830152905160019250600160a060020a033316916000805160206119b4833981519152919081900360600190a361062e565b600254421161052d5769017b7883c069166000003460075401111515156104465760006000fd5b600160a060020a0333166000908152600c602052604090208054349081019091556007805482019055670de0b6b3a7640000906414f46b0400025b600e546040805160e060020a63a9059cbb028152600160a060020a0333811660048301529490930460248401819052905190945092169163a9059cbb9160448082019260009290919082900301818387803b15156104db57fe5b6102c65a03f115156104e957fe5b505060408051348152602081018490524281830152905160029250600160a060020a033316916000805160206119b4833981519152919081900360600190a361062e565b69043c33c193756480000034600854011115151561054b5760006000fd5b600160a060020a0333166000908152600d602052604090208054349081019091556008805482019055670de0b6b3a7640000906412a05f2000025b600e546040805160e060020a63a9059cbb028152600160a060020a0333811660048301529490930460248401819052905190945092169163a9059cbb9160448082019260009290919082900301818387803b15156105e057fe5b6102c65a03f115156105ee57fe5b505060408051348152602081018490524281830152905160039250600160a060020a033316916000805160206119b4833981519152919081900360600190a35b5b5b5b5b50565b005b341561063f57fe5b610647610b30565b60408051918252519081900360200190f35b341561066157fe5b610647600160a060020a0360043516610b3e565b60408051918252519081900360200190f35b341561068f57fe5b610647610b50565b60408051918252519081900360200190f35b34156106b157fe5b610647610b59565b60408051918252519081900360200190f35b34156106d357fe5b610635600160a060020a0360043516602435610b67565b005b34156106f457fe5b610647610b6c565b60408051918252519081900360200190f35b341561071657fe5b610647600160a060020a0360043516610b72565b60408051918252519081900360200190f35b341561074457fe5b610647610b84565b60408051918252519081900360200190f35b341561076657fe5b610647610b8a565b60408051918252519081900360200190f35b341561078857fe5b610647610b93565b60408051918252519081900360200190f35b34156107aa57fe5b610635610b9c565b005b34156107bc57fe5b610635610dbb565b005b34156107ce57fe5b610647610f31565b60408051918252519081900360200190f35b34156107f057fe5b610635610f39565b005b341561080257fe5b610647611466565b60408051918252519081900360200190f35b341561082457fe5b61064761146c565b60408051918252519081900360200190f35b341561084657fe5b610647611479565b60408051918252519081900360200190f35b341561086857fe5b610647600160a060020a036004351661147f565b60408051918252519081900360200190f35b341561089657fe5b610635600435611487565b005b34156108ab57fe5b61063560043515156117b0565b005b34156108c257fe5b6106476117f9565b60408051918252519081900360200190f35b34156108e457fe5b6106476117ff565b60408051918252519081900360200190f35b341561090657fe5b61090e611804565b60408051600160a060020a039092168252519081900360200190f35b341561093257fe5b610647611813565b60408051918252519081900360200190f35b341561095457fe5b610635611820565b005b341561096657fe5b610647611866565b60408051918252519081900360200190f35b34156106d357fe5b610635600160a060020a0360043516602435610b67565b005b34156109a957fe5b610647600160a060020a0360043516611874565b60408051918252519081900360200190f35b34156109d757fe5b610647611886565b60408051918252519081900360200190f35b34156109f957fe5b604080516020600460443581810135601f8101849004840285018401909552848452610635948235600160a060020a031694602480359560649492939190920191819084018382808284375094965061189195505050505050565b005b3415610a5e57fe5b610a66611959565b604080519115158252519081900360200190f35b3415610a8257fe5b610647611969565b60408051918252519081900360200190f35b3415610aa457fe5b61064761196f565b60408051918252519081900360200190f35b3415610ac657fe5b610647611975565b60408051918252519081900360200190f35b3415610ae857fe5b61064761197b565b60408051918252519081900360200190f35b3415610b0a57fe5b610647600160a060020a0360043516611981565b60408051918252519081900360200190f35b69017b7883c0691660000081565b600d6020526000908152604090205481565b6412a05f200081565b69043c33c193756480000081565b5b5050565b60055481565b600b6020526000908152604090205481565b60085481565b64199c82cc0081565b64174876e80081565b60095460009060a060020a900460ff1615610bb75760006000fd5b600160a060020a0333166000908152600a60205260409020546001901115610bf857600160a060020a0333166000908152600a602052604081208054919055015b600160a060020a0333166000908152600b60205260409020546001901115610c3957600160a060020a0333166000908152600b602052604081208054919055015b600160a060020a0333166000908152600c60205260409020546001901115610c7a57600160a060020a0333166000908152600c602052604081208054919055015b600160a060020a0333166000908152600d60205260409020546001901115610cbb57600160a060020a0333166000908152600d602052604081208054919055015b600160a060020a0333166000908152600a6020526040902054158015610cf75750600160a060020a0333166000908152600b6020526040902054155b8015610d195750600160a060020a0333166000908152600c6020526040902054155b8015610d3b5750600160a060020a0333166000908152600d6020526040902054155b1515610d475760006000fd5b604051600160a060020a0333169082156108fc029083906000818181858888f193505050501515610d7457fe5b604080518281524260208201528151600160a060020a033316927fd4b15ee0724fec3829ddfdba102b0b2056d212596a309b0e5667c22b1506553a928290030190a25b5b50565b60095460009033600160a060020a03908116911614610dda5760006000fd5b60095460a060020a900460ff161515610df35760006000fd5b6004544211610e025760006000fd5b600e54604080516000602091820181905282517f70a08231000000000000000000000000000000000000000000000000000000008152600160a060020a033081166004830152935193909416936370a08231936024808301949391928390030190829087803b1515610e7057fe5b6102c65a03f11515610e7e57fe5b5050604080518051600e5460095460e060020a63a9059cbb028452600160a060020a03908116600485015260248401839052935191955092909216925063a9059cbb91604480830192600092919082900301818387803b1515610edd57fe5b6102c65a03f11515610eeb57fe5b50506040805160008152602081018490524281830152905160059250600160a060020a033316916000805160206119b4833981519152919081900360600190a35b5b5b50565b6359682f0081565b60095460009060a060020a900460ff161515610f555760006000fd5b60035442118015610f67575060045442105b1515610f735760006000fd5b600160a060020a0333166000908152600a60205260409020546001901180610fb45750600160a060020a0333166000908152600b6020526040902054600190115b80610fd85750600160a060020a0333166000908152600c6020526040902054600190115b80610ffc5750600160a060020a0333166000908152600d6020526040902054600190115b15156110085760006000fd5b600160a060020a0333166000908152600a6020526040902054600190111561111557600554600160a060020a0333166000908152600a6020526040902054600854670de0b6b3a764000090920291026359682f000281151561106657fe5b04600554670de0b6b3a764000002600a600033600160a060020a0316600160a060020a03168152602001908152602001600020546359682f0060075402028115156110ad57fe5b04600554670de0b6b3a764000002600a600033600160a060020a0316600160a060020a03168152602001908152602001600020546359682f0060065402028115156110f457fe5b600160a060020a0333166000908152600a6020526040902060019055040101015b600160a060020a0333166000908152600b602052604090205460019011156111da57600654600160a060020a0333166000908152600b6020526040902054600854670de0b6b3a764000090920291026359682f000281151561117357fe5b04600654670de0b6b3a764000002600b600033600160a060020a0316600160a060020a03168152602001908152602001600020546359682f0060075402028115156111ba57fe5b600160a060020a0333166000908152600b60205260409020600190550401015b600160a060020a0333166000908152600c6020526040902054600190111561125757600754600160a060020a0333166000908152600c6020526040902054600854670de0b6b3a764000090920291026359682f000281151561123857fe5b600160a060020a0333166000908152600c602052604090206001905504015b600160a060020a0333166000908152600d6020526040902054600190111561129657600160a060020a0333166000908152600d60205260409020600190555b600160a060020a0333166000908152600a6020526040902054600190118015906112da5750600160a060020a0333166000908152600b602052604090205460019011155b80156113005750600160a060020a0333166000908152600c602052604090205460019011155b80156113265750600160a060020a0333166000908152600d602052604090205460019011155b15156113325760006000fd5b60008111156113a157600e546040805160e060020a63a9059cbb028152600160a060020a033381166004830152602482018590529151919092169163a9059cbb91604480830192600092919082900301818387803b151561138f57fe5b6102c65a03f1151561139d57fe5b5050505b600f54604080517f40c10f19000000000000000000000000000000000000000000000000000000008152600160a060020a033381166004830152600a6024830152915191909216916340c10f1991604480830192600092919082900301818387803b151561140b57fe5b6102c65a03f1151561141957fe5b5050604080518381524260208201528151600160a060020a03331693507fbdcd3071bd326fab641db8b197f38f1aad7202774174fff43ee386a618649a78929181900390910190a25b5b50565b60025481565b6825f273933db570000081565b60045481565b60005b919050565b60095460a060020a900460ff1615156114a05760006000fd5b60095433600160a060020a039081169116146114bc5760006000fd5b80151561154e57600054421180156114d657506000600554115b15156114e25760006000fd5b600954600554604051600160a060020a039092169181156108fc0291906000818181858888f19350505050151561151557fe5b600554604080519182524260208301528051600160a060020a0333169260008051602061199483398151915292908290030190a261062e565b80600114156115e2576001544211801561156a57506000600654115b15156115765760006000fd5b600954600654604051600160a060020a039092169181156108fc0291906000818181858888f1935050505015156115a957fe5b600654604080519182524260208301528051600160a060020a0333169260008051602061199483398151915292908290030190a261062e565b806002141561167657600254421180156115fe57506000600754115b151561160a5760006000fd5b600954600754604051600160a060020a039092169181156108fc0291906000818181858888f19350505050151561163d57fe5b600754604080519182524260208301528051600160a060020a0333169260008051602061199483398151915292908290030190a261062e565b806003141561170a576003544211801561169257506000600854115b151561169e5760006000fd5b600954600854604051600160a060020a039092169181156108fc0291906000818181858888f1935050505015156116d157fe5b600854604080519182524260208301528051600160a060020a0333169260008051602061199483398151915292908290030190a261062e565b806004141561062e576003544211801561172e5750600030600160a060020a031631115b151561173a5760006000fd5b600954604051600160a060020a039182169130163180156108fc02916000818181858888f19350505050151561176c57fe5b60408051600160a060020a0330811631825242602083015282513390911692600080516020611994833981519152928290030190a261062e565b5b5b5b5b5b5b5b50565b60095433600160a060020a039081169116146117cc5760006000fd5b6009805474ff0000000000000000000000000000000000000000191660a060020a831515021790555b5b50565b60075481565b600a81565b600954600160a060020a031681565b68878678326eac90000081565b60095460a060020a900460ff16156118385760006000fd5b60095433600160a060020a039081169116146118545760006000fd5b600954600160a060020a0316ff5b5b5b565b6414f46b040081565b5b5050565b600c6020526000908152604090205481565b6658d15e1762800081565b60008211156119535782600160a060020a03167fb8d738496fa71a9a7bfee7d00bba65b3a7eb49d786be0e219dac8b906efe491e83836040518083815260200180602001828103825283818151815260200191508051906020019080838360008314611918575b80518252602083111561191857601f1990920191602091820191016118f8565b505050905090810190601f1680156119445780820380516001836020036101000a031916815260200191505b50935050505060405180910390a25b5b505050565b60095460a060020a900460ff1681565b60015481565b60005481565b60035481565b60065481565b600a6020526000908152604090205481560047170eb81f91ff6ce9fb73218802c24124b2f7584c831ed70091d671e2c11c1401ae19d601c751fcbbf4c8980cd21fced69af58df51d50e396c71985121a25d3a165627a7a723058207dae120c1703a830505d95dc4d6ce441a5fb9a8bf028478b52b5dd5aed8046520029
*/
