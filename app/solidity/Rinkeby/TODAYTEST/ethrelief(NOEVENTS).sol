pragma solidity^0.4.15;

contract EthRelief {

    address etheraffle;

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
    }
}
/*
var relAdd = '0x917fd46a742482ff0be4d22ba90fe30e7e061f16'
var relABI = eth.contract([{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_etheraffle","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"}])
var rel = relABI.at(relAdd)
*/
