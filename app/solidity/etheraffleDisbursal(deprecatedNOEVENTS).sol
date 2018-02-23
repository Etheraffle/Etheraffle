pragma solidity^0.4.15;

contract EtheraffleDisbursal {

    address etheraffle;

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
    }
}
/*
https://etherscan.io/tx/0x3c421ea1d3017e8fd7349ae8598bc6a62c486838291b43ed515ed4c12968d889
MAIN CHAIN
var disbAdd = '0xfb6dD07FE7D471f8aCa03a442f8175F64f1AE991'
var disbABI = eth.contract([{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_etheraffle","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"}])
var disb = disbABI.at(disbAdd)
*/
