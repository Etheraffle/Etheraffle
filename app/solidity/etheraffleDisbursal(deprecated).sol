pragma solidity^0.4.15;

contract EtheraffleDisbursal {

    address etheraffle;

    event LogIncomingFunds(address fromWhom, uint amount, uint atTime);
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
    * @dev   selfDestruct - used here to delete this placeholder contract
    *        and forward any funds sent to it on to the final disbursal
    *        contract once it is fully developed. Only callable by the
    *        Etheraffle multisig.
     *
     * @param _addr   The destination address for any ether herein.
     */
    function selfDestruct(address _addr) {
        require(msg.sender == etheraffle);
        selfdestruct(_addr);
    }
    /**
     * @dev   Fallback function that accepts ether and announces its
     *        arrival via an event.
     */
    function () payable external {
        LogIncomingFunds(msg.sender, msg.value, now);
    }
}
/*
Main Chain
0x1d85150f23a6a7acc487176f2ee596ad60df7c74

[{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_etheraffle","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fromWhom","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogIncomingFunds","type":"event"}]


Rinkeby
etheraffle = '0xB7Ea14973700361dc1cb5dF0bC513051D480437d'

disbAdd = '0x74ec00c8f31644eaea2f7c964b3c544f4b76adb6'
disbABI = eth.contract([{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_etheraffle","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fromWhom","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogIncomingFunds","type":"event"}])
disb = disbABI.at(disbAdd)
*/
