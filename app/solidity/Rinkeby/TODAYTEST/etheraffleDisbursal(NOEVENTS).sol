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
var disbAdd = '0x77ba9a1343b549879394d201514211fa5a8a1b08'
var disbABI = eth.contract([{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_etheraffle","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"}])
var disb = disbABI.at(disbAdd)
*/
