//tested and working Dec 17th 2017
pragma solidity^0.4.15;

contract ERC223Receiver {

    address public owner;

    uint public txCount;
    mapping(uint => tx) public txs;
    struct tx {
        address sender;
        uint    value;
        bytes   data;
        bytes4  sig;
    }

    event LogReceipt(uint txNumber, address from, uint amount, bytes data, bytes4 functionSig);

    function ERC223Receiver() {
          txCount = 1;
          owner   = msg.sender;
    }
    /**
     * @dev     TX struct is analogue of msg variable of Ether transaction
     *          tx.sender is the person who initiated this transaction (∴ msg.sender)
     *          tx.value the number of tokens that were sent (∴ msg.value)
     *          tx.data is the data of the token transaction (∴ msg.data)
     *          tx.sig is 4 byte signature of function data if the transaction
     *          is a function execution
     *
     * @param _from   The sender of the tx
     * @param _value  The value of the tx (in the token, not ether!)
     * @param _data   The calldata of the tx
     */
    function tokenFallback(address _from, uint _value, bytes _data) {
        txs[txCount].sender = _from;
        txs[txCount].value  = _value;
        txs[txCount].data   = _data;
        if(_data.length > 0) {
            uint32 u = uint32(_data[3]) + (uint32(_data[2]) << 8) + (uint32(_data[1]) << 16) + (uint32(_data[0]) << 24);
            txs[txCount].sig = bytes4(u);
            LogReceipt(txCount, txs[txCount].sender, txs[txCount].value, txs[txCount].data, txs[txCount].sig);
            txCount++;
        } else {
            bytes memory empty;
            LogReceipt(txCount, txs[txCount].sender, txs[txCount].value, empty, empty);
            txCount++;
        }

    }
    function selfDestruct() {
        selfdestruct(owner);
    }
}
/*
RINKEBY:
owner: '0xb7ea14973700361dc1cb5df0bc513051d480437d'
var cAdd = "" - self destructed
var cABI = eth.contract([{"constant":true,"inputs":[],"name":"txCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"tokenFallback","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"txs","outputs":[{"name":"sender","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"},{"name":"sig","type":"bytes4"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"txNumber","type":"uint256"},{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"},{"indexed":false,"name":"functionSig","type":"bytes4"}],"name":"LogReceipt","type":"event"}])
var rec = cABI.at(cAdd)

var poop = rec.allEvents({fromBlock: 0, toBlock: 'latest'}).get()
*/
