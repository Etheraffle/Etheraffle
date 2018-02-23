/* Rinkeby!!!
var tokenAdd = "0x929fc0a7a548c7abf0d6ebf08f7fd3890cc57970"
Made 900 tokens, 6 decimal places - don't forget the contract uses the most granular version!
var tokenABI =
*/

pragma solidity ^0.4.11;

library SafeMath {
  function mul(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }
  function sub(uint256 a, uint256 b) internal constant returns (uint256) {
    assert(b <= a);
    return a - b;
  }
  function add(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

contract ERC223ReceivingContract {
    /**
     * @dev Standard ERC223 function interface that will handle incoming token
     *      transfers.
     * @param _from  Token sender address.
     * @param _value Amount of tokens.
     * @param _data  Transaction metadata.
     */
    function tokenFallback(address _from, uint _value, bytes _data);
}

contract ERC223Interface {
    function balanceOf(address _owner) constant public returns (uint balance);
    function transfer(address _to, uint _value);
    function transfer(address _to, uint _value, bytes _data);
    function toggleFreeze() external returns (bool status);
    function changeEtheraffleMultisig(address _new) external returns (bool success);
}

contract EtheraffleLOT is ERC223Interface {
    using SafeMath for uint;
    /* Name for display purposes */
    string public name;
    /* Ticker Symbol */
    string public symbol;
    /* Decimals the token is fractionable to */
    uint8 public decimals = 6;
    /* Total supply of LOT */
    uint256 public totalSupply;
    /* Toggle for freezing the transfer of LOT */
    bool public LOTFrozen;
    /* Controller of this LOT contract - currently etheraffle's multisig wallet */
    address public etheraffleMultiSig;

    /* Mapping of LOT holder address to their respective balances */
    mapping(address => uint) public balances;
    /* Event logger for LOT transfers */
    event LogTransfer(address indexed from, address indexed to, uint value, bytes indexed data);
    /* Event logger that fires when the frozen toggle is changed */
    event LogFrozen(bool status, uint atTime);
    /**
     * @dev   Set the meta data for the token and give the intial supply to the
     *        crowdfund contract.
     *
     * @param _initialSupply        Number of tokens minted on creation, unchangeable,
     *                              and not including their decimal precision.
     * @param _etheraffleCrowdFund  Address to whom the intial supply of tokens is
     *                              given on token minting.
     * @param _etheraffleMultiSig   Address of the etheraffle multisig wallet, the only
     *                              address via which the frozen/unfrozen state of the
     *                              token transfers can be toggled.
     */
    function EtheraffleLOT(uint _initialSupply, address _etheraffleCrowdFund, address _etheraffleMultiSig) {
        /* Set total supply of LOT tokens with correct decimal amount */
        totalSupply = _initialSupply * 10 ** uint256(decimals);
        /* Give the crowdfund contract all initial tokens */
        balances[_etheraffleCrowdFund] = totalSupply;
        /* Set the etheraffle mutlisig variable to correct address */
        etheraffleMultiSig = _etheraffleMultiSig;
        /* Set name of contract for display purposes */
        name = "Etheraffle LOT";
        /* Ticker symbol for token */
        symbol = "LOT";
    }
////////////////////////////////////////////////////////////////////////////////
/////////Etheraffle Specific Functions//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

    /**
     * @dev Toggle the frozen status of the LOT token. During dividend periods, the
     *      token transfers will be halted by this bool, in order for addresses of LOT
     *      holders to claim their due dividend without being able to move their funds
     *      amongst different addresses in order to claim more than their share.
     */
    function toggleFreeze() external returns (bool status) {
        /* Only callable by contract controllers */
        require(msg.sender == etheraffleMultiSig);
        /* Toggles status from true to false */
        if(LOTFrozen == true){
            LOTFrozen =  false;
            LogFrozen(LOTFrozen, now);
            return LOTFrozen;
        /* Toggles status from false tot true */
        } else {
            LOTFrozen =  true;
            LogFrozen(LOTFrozen, now);
            return LOTFrozen;
        }
    }

    /**
     * @dev   Allow changing of contract ownership ready for future upgrades/
     *        changes in management structure.
     *
     * @param _new  New owner/controller address.
     */
    function changeEtheraffleMultisig(address _new) external returns (bool success) {
        /* Only callable by contract controllers */
        require(msg.sender == etheraffleMultiSig);
        etheraffleMultiSig = _new;
        return true;
    }
    /**
     * ERC223 Standard functions:
     *
     * @dev Transfer the specified amount of tokens to the specified address.
     *      Invokes the `tokenFallback` function if the recipient is a contract.
     *      The token transfer fails if the recipient is a contract
     *      but does not implement the `tokenFallback` function
     *      or the fallback function to receive funds.
     *
     * @param _to    Receiver address.
     * @param _value Amount of tokens that will be transferred.
     * @param _data  Transaction metadata.
     */
    function transfer(address _to, uint _value, bytes _data) public {
        /* Require the LOT transfer mechanism to not be frozen */
        require(LOTFrozen == false);
        /* Standard function transfer similar to ERC20 transfer with no _data . */
        /* Added due to backwards compatibility reasons . */
        uint codeLength;
        assembly {
            /* Retrieve the size of the code on target address, this needs assembly. */
            codeLength := extcodesize(_to)
        }
        /* Decrease transferer's token balance */
        balances[msg.sender] = balances[msg.sender].sub(_value);
        /* Increase transferee's token  balance */
        balances[_to] = balances[_to].add(_value);
        /* If codeLength > 0, address is a contract, not a wallet */
        if(codeLength > 0) {
            /* Generate correct function signature for ERC223 compliant token receival */
            ERC223ReceivingContract receiver = ERC223ReceivingContract(_to);
            /* Call the destination's token-receiver function */
            receiver.tokenFallback(msg.sender, _value, _data);
        }
        /* Fire the log transfer event */
        LogTransfer(msg.sender, _to, _value, _data);
    }
    /**
     * @dev Transfer the specified amount of tokens to the specified address.
     *      This function works the same with the previous one
     *      but doesn't contain `_data` param.
     *      Added due to backwards compatibility reasons.
     * @param _to    Receiver address.
     * @param _value Amount of tokens that will be transferred.
     */
    function transfer(address _to, uint _value) public {
        /* Require the LOT transfer mechanism to not be frozen */
        require(LOTFrozen == false);
        uint codeLength;
        bytes memory empty;
        assembly {
            /* Retrieve the size of the code on target address, this needs assembly. */
            codeLength := extcodesize(_to)
        }
        /* Decrease transferer's token balance */
        balances[msg.sender] = balances[msg.sender].sub(_value);
        /* Increase transferee's token  balance */
        balances[_to] = balances[_to].add(_value);
        /* If codeLength > 0, address is a contract, not a wallet */
        if(codeLength > 0) {
            /* Generate correct function signature for ERC223 compliant token receival */
            ERC223ReceivingContract receiver = ERC223ReceivingContract(_to);
            /* Call the destination's token receiver function */
            receiver.tokenFallback(msg.sender, _value, empty);
        }
        /* Fire the log transfer event */
        LogTransfer(msg.sender, _to, _value, empty);
    }
    /**
     * @dev Returns balance of the `_owner`.
     * @param _owner   The address whose balance will be returned.
     * @return balance Balance of the `_owner`.
     */
    function balanceOf(address _owner) constant public returns (uint balance) {
        return balances[_owner];
    }
    /**
     * @dev Fallback in case of accidental ether transfer
     */
    function () payable {
        revert();
    }
    ////////////////////////////////////////////////////////////////
    function selfDestruct() {
        selfdestruct(etheraffleMultiSig);
    }
}
