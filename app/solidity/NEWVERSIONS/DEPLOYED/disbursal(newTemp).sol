pragma solidity^0.4.15;

contract ReceiverInterface {
    function receiveEther() external payable {}
}
/**
 * @author G.Kapka <greg@etheraffle.com>
 * @title Etheraffle Disbursal (placeholder)
 */
contract EtheraffleDisbursal is ReceiverInterface {

    bool    upgraded;
    address etheraffle;
    /**
     * @dev  Modifier to prepend to functions rendering them
     *       only callable by the Etheraffle multisig address.
     */
    modifier onlyEtheraffle() {
        require(msg.sender == etheraffle);
        _;
    }
    event LogEtherReceived(address fromWhere, uint howMuch, uint atTime);
    event LogUpgrade(address toWhere, uint amountTransferred, uint atTime);
    /**
     * @dev   Constructor - sets the etheraffle var to the Etheraffle
     *        managerial multisig account.
     *
     * @param _etheraffle   The Etheraffle multisig account
     */
    function EtheraffleDisbursal(address _etheraffle) {
        etheraffle = _etheraffle;
    }
    /**
     * @dev   Upgrade function transferring all this contract's ether
     *        via the standard receive ether function in the proposed
     *        new disbursal contract.
     *
     * @param _addr    The new disbursal contract address.
     */
    function upgrade(address _addr) onlyEtheraffle external {
        upgraded = true;
        LogUpgrade(_addr, this.balance, now);
        ReceiverInterface(_addr).receiveEther.value(this.balance)();
    }
    /**
     * @dev   Standard receive ether function, forward-compatible
     *        with proposed future disbursal contract.
     */
    function receiveEther() payable external {
        LogEtherReceived(msg.sender, msg.value, now);
    }
    /**
     * @dev   Set the Etheraffle multisig contract address, in case of future
     *        upgrades. Only callable by the current Etheraffle address.
     *
     * @param _newAddr   New address of Etheraffle multisig contract.
     */
    function setEtheraffle(address _newAddr) onlyEtheraffle external {
        etheraffle = _newAddr;
    }
    /**
     * @dev   selfDestruct - used here to delete this placeholder contract
     *        and forward any funds sent to it on to the final disbursal
     *        contract once it is fully developed. Only callable by the
     *        Etheraffle multisig.
     *
     * @param _addr   The destination address for any ether herein.
     */
    function selfDestruct(address _addr) onlyEtheraffle {
        require(upgraded);
        selfdestruct(_addr);
    }
    /**
     * @dev   Fallback function that accepts ether and announces its
     *        arrival via an event.
     */
    function () payable external {
    }
}
/*
Main Chain

0x3bfb12ed112aB833F275Dbf622b7CacC4CBF092b

[{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"upgrade","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newAddr","type":"address"}],"name":"setEtheraffle","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"receiveEther","outputs":[],"payable":true,"type":"function"},{"inputs":[{"name":"_etheraffle","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fromWhere","type":"address"},{"indexed":false,"name":"howMuch","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogEtherReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"toWhere","type":"address"},{"indexed":false,"name":"amountTransferred","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogUpgrade","type":"event"}]



Rinkeby
var disbAdd = '0xf58ea2ed7d5748e0a251c1752e6cf644e3aea122'
var disbABI = eth.contract([{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"upgrade","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"receiveEther","outputs":[],"payable":true,"type":"function"},{"inputs":[{"name":"_etheraffle","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fromWhere","type":"address"},{"indexed":false,"name":"howMuch","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogEtherReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"toWhere","type":"address"},{"indexed":false,"name":"amountTransferred","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogUpgrade","type":"event"}])
var disb = disbABI.at(disbAdd)
*/
