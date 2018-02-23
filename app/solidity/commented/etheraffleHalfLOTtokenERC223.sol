pragma solidity ^0.4.11;

contract ERC223 {
    function tokenFallback(address _from, uint _value, bytes _data) public {}
}

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
}

contract EtheraffleHALFLOT is ERC223 {
    using SafeMath for uint;

    string  public name;
    string  public symbol;
    address public minter;
    uint8   public decimals;
    address public destroyer;
    address public etheraffle;
    uint    public totalSupply;

    mapping(address => uint) public balances;

    event LogMinting(address indexed toWhom, uint amountMinted, uint atTime);
    event LogMinterChange(address prevMinter, address newMinter, uint atTime);
    event LogDestruction(address indexed toWhom, uint amountDestroyed, uint atTime);
    event LogDestroyerChange(address prevMinter, address newDestroyer, uint atTime);
    event LogControllerChange(address prevController, address newController, uint atTime);
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
     * @dev   Modifier function to prepend to methods rendering them only callable
     *        by the Etheraffle MultiSig wallet or a selected secondary minter.
     */
    modifier onlyMinter() {
        require(msg.sender == etheraffle || msg.sender == minter);
        _;
    }
    /**
     * @dev   Modifier function to prepend to methods rendering them only callable
     *        by the Etheraffle MultiSig wallet or a selected secondary destroyer.
     */
    modifier onlyDestroyer() {
        require(msg.sender == etheraffle || msg.sender == destroyer);
        _;
    }
    /**
     * @dev   Constructor: Sets the meta data & controller for the token.
     *
     * @param _etheraffle   address - The Etheraffle multisig wallet.
     */
    function EtheraffleHALFLOT(address _etheraffle) {
        name       = "Etheraffle HALFLOT";
        symbol     = "HALFLOT";
        minter     = _etheraffle;
        destroyer  = _etheraffle;
        etheraffle = _etheraffle;
    }
    /**
     * ERC223 Standard functions:
     *
     * @dev Transfer the specified amount of HALFLOT to the specified address.
     *      Invokes the `tokenFallback` function if the recipient is a contract.
     *      The token transfer fails if the recipient is a contract
     *      but does not implement the this function.
     *
     * @param _to     Receiver address.
     * @param _value  Amount of HALFLOT to be transferred.
     * @param _data   Transaction metadata.
     */
    function transfer(address _from, address _to, uint _value, bytes _data) external onlyEtheraffle {
        uint codeLength;
        assembly {
            codeLength := extcodesize(_to)
        }
        balances[_from] = balances[_from].sub(_value);
        balances[_to]   = balances[_to].add(_value);
        if(codeLength > 0) {
            ERC223 receiver = ERC223(_to);
            receiver.tokenFallback(_from, _value, _data);
        }
        LogTransfer(_from, _to, _value, _data);
    }
    /**
     * @dev     Transfer the specified amount of HALFLOT to the specified address.
     *          Standard function transfer similar to ERC20 transfer with no
     *          _data param. Added due to backwards compatibility reasons.
     *
     * @param _to     Receiver address.
     * @param _value  Amount of HALFLOT to be transferred.
     */
    function transfer(address _from, address _to, uint _value) external onlyEtheraffle {
        uint codeLength;
        bytes memory empty;
        assembly {
            codeLength := extcodesize(_to)
        }
        balances[_from] = balances[_from].sub(_value);
        balances[_to]   = balances[_to].add(_value);
        if(codeLength > 0) {
            ERC223 receiver = ERC223(_to);
            receiver.tokenFallback(_from, _value, empty);
        }
        LogTransfer(_from, _to, _value, empty);
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
     * @dev     Allow changing of contract ownership ready for future upgrades/
     *          changes in management structure.
     *
     * @param _new  New owner/controller address.
     */
    function setController(address _new) external onlyEtheraffle {
        LogControllerChange(etheraffle, _new, now);
        etheraffle = _new;
    }
    /**
     * @dev     Allow changing of minter to allow future contracts to
     *          take over the role.
     *
     * @param _new  New minter address.
     */
    function setMinter(address _new) external onlyEtheraffle {
        LogMinterChange(minter, _new, now);
        minter = _new;
    }
    /**
     * @dev     Allow changing of destroyer to allow future contracts to
     *          take over the role.
     *
     * @param _new  New destroyer address.
     */
    function setDestroyer(address _new) external onlyEtheraffle {
        LogDestroyerChange(destroyer, _new, now);
        destroyer = _new;
    }
    /**
     * @dev    This function mints tokens by adding tokens to the total
     *         supply and assigning them to the given address.
     * @param _to      The address recipient of the minted tokens.
     * @param _amt     The amount of tokens to mint & assign.
     */
    function mint(address _to, uint _amt) external onlyMinter {
        totalSupply   = totalSupply.add(_amt);
        balances[_to] = balances[_to].add(_amt);
        LogMinting(_to, _amt, now);
    }
    /**
     * @dev    This function destroys tokens by subtracting them from the total
     *         supply and removing them from the given address. Only callable by
     *         the etheraffle address or a designated destroyer.
     *
     * @param _from    The address from whom the token is destroyed.
     * @param _amt     The amount of tokens to destroy.
     */
    function destroy(address _from, uint _amt) external onlyDestroyer {
        totalSupply     = totalSupply.sub(_amt);
        balances[_from] = balances[_from].sub(_amt);
        LogDestruction(_from, _amt, now);
    }
    /**
     * @dev   Housekeeping- called in the event this contract is no
     *        longer needed Deletes the code from the blockchain.
     *        Only callable by the Etheraffle address.
     */
    function selfDestruct() external onlyEtheraffle {
        selfdestruct(etheraffle);
    }
    /**
     * @dev   Fallback in case of accidental ether transfer
     */
    function () external payable {
        revert();
    }
}
/*
RINKEBY:
etheraffle = '0xB7Ea14973700361dc1cb5dF0bC513051D480437d'

var halfAdd = '0x4b925069ab56fde24d5d7e60c5535633df605d0f'
var halfABI = eth.contract([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minter","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"destroyer","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amt","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"address"}],"name":"setDestroyer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"etheraffle","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"address"}],"name":"setController","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_amt","type":"uint256"}],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"tokenFallback","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"address"}],"name":"setMinter","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_etheraffle","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"toWhom","type":"address"},{"indexed":false,"name":"amountMinted","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogMinting","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"prevMinter","type":"address"},{"indexed":false,"name":"newMinter","type":"address"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogMinterChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"toWhom","type":"address"},{"indexed":false,"name":"amountDestroyed","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogDestruction","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"prevMinter","type":"address"},{"indexed":false,"name":"newDestroyer","type":"address"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogDestroyerChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"prevController","type":"address"},{"indexed":false,"name":"newController","type":"address"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogControllerChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":true,"name":"data","type":"bytes"}],"name":"LogTransfer","type":"event"}])
var half = halfABI.at(halfAdd)
*/
