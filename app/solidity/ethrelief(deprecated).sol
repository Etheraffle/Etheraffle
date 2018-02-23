pragma solidity^0.4.15;

contract EthRelief {

    address etheraffle;

    event LogDonation(address fromWhom, uint amount, uint atTime);
    /**
     * @dev   Constructor - sets the etheraffle var to the Etheraffle
     *        managerial multisig account.
     *
     * @param _etheraffle   The Etheraffle multisig account.
     */
    function EthRelief(address _etheraffle) {
        etheraffle = _etheraffle;
    }
    /**
     * @dev   selfDestruct - used here to delete this placeholder contract
     *        and forward any funds sent to it on to the final EthRelief
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
     * @dev   Fallback function that accepts ether and announces it's
     *        arrival via an event.
     */
    function () payable external {
        LogDonation(msg.sender, msg.value, now);
    }
}
/*
Main Chain
0x4b925069ab56fde24d5d7e60c5535633df605d0f

[{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_etheraffle","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fromWhom","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogDonation","type":"event"}]

*/
/*
Rinkeby
etheraffle = '0xB7Ea14973700361dc1cb5dF0bC513051D480437d'

reliefAdd = '0xcc5ff1557b667ee468ec8a01f88d2bcfef361c21'
reliefABI = eth.contract([{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_etheraffle","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fromWhom","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogDonation","type":"event"}])
relief = reliefABI.at(disAdd)
*/
