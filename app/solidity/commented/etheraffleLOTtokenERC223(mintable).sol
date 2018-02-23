/*
Total minted: 324,375,000

Mutltisig address: "0x97f535e98cf250cdd7ff0cb9b29e4548b609a0bd"
deploy string: 324375000, "0x97f535e98cf250cdd7ff0cb9b29e4548b609a0bd"
deployed address: ""


TODO: Publish the ICO first since this contract needs the ICO address!

*/

pragma solidity ^0.4.11;

library SafeMath {
    function sub(uint256 a, uint256 b) internal constant returns (uint256) {
        assert(b <= a);
        return a - b;
    }
    function add(uint256 a, uint256 b) internal constant returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
    function mul(uint256 a, uint256 b) internal constant returns (uint256) {
        uint256 c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }
}

contract ERC223Compliant {
    function tokenFallback(address _from, uint _value, bytes _data);
}

contract EtheraffleLOT is ERC223Compliant {
    using SafeMath for uint;

    string  public name;
    string  public symbol;
    bool    public frozen;
    uint8   public decimals;
    bool    public isMintable;
    address public etheraffle;
    uint    public totalSupply;
    address public etheraffleICO;

    mapping(address => uint) public balances;

    event LogFrozenStatus(bool status, uint atTime);
    event LogTokenDeposit(address indexed from, uint value, bytes callData);
    event LogMinting(address indexed toWhom, uint amountMinted, uint atTime);
    event LogEtheraffleChange(address prevController, address newController, uint atTime);
    event LogTransfer(address indexed from, address indexed to, uint value, bytes indexed data);

    /**
     * @dev   Modifier function to prepend to methods rendering them only callable
     *        by the Etheraffle MultiSig wallet.
     */
    modifier onlyEtheraffle() {
        require(msg.sender == etheraffle);
        _;
    }
    /**
     * @dev   Modifier function to prepend to methods to render them only callable
     *        when the frozen toggle is false
     */
    modifier onlyIfNotFrozen() {
        require(frozen == false);
        _;
    }
    /**
     * @dev   Constructor: Sets the meta data for the token and gives the intial supply to the
     *        Etheraffle Multisig.
     *
     * @param _etheraffle           Address of the Etheraffle's multisig wallet, the only
     *                              address via which the frozen/unfrozen state of the
     *                              token transfers can be toggled.
     *
     * @param _etheraffleICO        Address of the Etheraffle ICO contract.
     */
    function EtheraffleLOT(address _etheraffle) {
        name          = "Etheraffle LOT";
        symbol        = "LOT";
        decimals      = 6;
        isMintable    = true;
        etheraffle    = _etheraffle;
    }
    /**
     * ERC223 Standard functions:
     *
     * @dev Transfer the specified amount of LOT to the specified address.
     *      Invokes the `tokenFallback` function if the recipient is a contract.
     *      The token transfer fails if the recipient is a contract
     *      but does not implement the `tokenFallback` function
     *      or the fallback function to receive funds.
     *
     * @param _to     Receiver address.
     * @param _value  Amount of LOT to be transferred.
     * @param _data   Transaction metadata.
     */
    function transfer(address _to, uint _value, bytes _data) onlyIfNotFrozen external {
        uint codeLength;
        assembly {
            codeLength := extcodesize(_to)
        }
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to]        = balances[_to].add(_value);
        if(codeLength > 0) {
            ERC223Compliant receiver = ERC223Compliant(_to);
            receiver.tokenFallback(msg.sender, _value, _data);
        }
        LogTransfer(msg.sender, _to, _value, _data);
    }
    /**
     * @dev   Transfer the specified amount of LOT to the specified address.
     *        Standard function transfer similar to ERC20 transfer with no
     *        _data param. Added due to backwards compatibility reasons.
     *
     * @param _to     Receiver address.
     * @param _value  Amount of LOT to be transferred.
     */
    function transfer(address _to, uint _value) onlyIfNotFrozen external {
        uint codeLength;
        bytes memory empty;
        assembly {
            codeLength := extcodesize(_to)
        }
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to]        = balances[_to].add(_value);
        if(codeLength > 0) {
            ERC223Compliant receiver = ERC223Compliant(_to);
            receiver.tokenFallback(msg.sender, _value, empty);
        }
        LogTransfer(msg.sender, _to, _value, empty);
    }
    /**
     * @dev     Returns balance of the `_owner`.
     * @param _owner    The address whose balance will be returned.
     * @return balance  Balance of the `_owner`.
     */
    function balanceOf(address _owner) constant external returns (uint balance) {
        return balances[_owner];
    }
    /**
     * @dev   Toggle the frozen status of the LOT token.
     */
    function toggleFrozen() onlyEtheraffle external {
        if(frozen) {
            frozen = false;
            LogFrozenStatus(frozen, now);
        } else {
            frozen = true;
            LogFrozenStatus(frozen, now);
        }
    }
    /**
     * @dev   Allow changing of contract ownership ready for future upgrades/
     *        changes in management structure.
     *
     * @param _new  New owner/controller address.
     */
    function setEtheraffle(address _new) external onlyEtheraffle {
        LogEtheraffleChange(etheraffle, _new, now);
        etheraffle = _new;
    }
    /**
     * @dev   Function sets the Etheraffle ICO address allowing it to mint LOT
     *        tokens for the duration of the token sale.
     *
     * @param _ico  Address of the Etheraffle ICO contract.
     */
    function setEtheraffleICO(address _ico) external onlyEtheraffle {
        etheraffleICO = _ico;
    }
    /**
     * @dev    This function mints tokens by adding tokens to the total supply
     *         and assigning them to the given address.
     *
     * @param _to      The address recipient of the minted tokens.
     * @param _amt     The amount of tokens to mint & assign.
     */
    function mint(address _to, uint _amt) external {
        require(msg.sender == etheraffleICO && isMintable);
        uint amt      = _amt * 10 ** uint256(decimals);
        totalSupply   = totalSupply.add(amt);
        balances[_to] = balances[_to].add(amt);
        LogMinting(_to, _amt, now);
    }
    /**
     * @dev    Final mint function. Once the ICO is over, this method is called.
     *         It calculates the number of tokens required to give Etheraffle
     *         its 20% share.The function then switches the isMintable bool to
     *         false rendering the token minting stage complete. Function only
     *         callable by the Etheraffle multisig wallet.
     */
    function finalMint() onlyEtheraffle external {
        require(isMintable);
        uint amt    = (totalSupply * 25) / 100;
        isMintable  = false;
        totalSupply = totalSupply.add(amt);
        balances[etheraffle] = balances[etheraffle].add(amt);
        LogMinting(etheraffle, amt, now);
    }
    /**
     * @dev   Fallback in case of accidental ether transfer
     */
    function () external payable {
        revert();
    }
    /**
     * @dev   Housekeeping- called in the event this contract is no
     *        longer needed, after a LOT upgrade for example. Deletes
     *        the code from the blockchain. Only callable by the
     *        Etheraffle address.
     */
    function selfDestruct() external onlyEtheraffle {
        require(frozen);
        selfdestruct(etheraffle);
    }
}
