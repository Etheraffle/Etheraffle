pragma solidity^0.4.15;

contract ERC223ReceivingContract {

    event LogTokenDeposit(address from, uint value, bytes data);

    /**
     * @dev This function is what allows this contract to receive ERC223
     *      compliant tokens. Any tokens sent to this address will fire off
     *      an event announcing their arrival. Unlike ERC20 tokens, ERC223
     *      tokens cannot be sent to contracts where this function is absent,
     *      thereby preventing loss of tokens by mistakenly sending them to
     *      contracts not designed to accept them.
     *
     * @param _from     From whom the transfer originated
     * @param _value    How many tokens were sent
     * @param _data     Transaction metadata
     */
    function tokenFallback(address _from, uint _value, bytes _data) public {
        if (_value > 0){
            LogTokenDeposit(_from, _value, _data);
        }
    }
}
