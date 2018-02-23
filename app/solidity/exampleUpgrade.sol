pragma solidity^0.4.15;

contract Upgrade {

    address public owner;

    event LogEtherReceived(address fromWhom, uint amount, uint atTime);

    function Upgrade() {
          owner = msg.sender;
    }

    function addToPrizePool() payable external {
        LogEtherReceived(msg.sender, msg.value, now);
    }

    function selfDestruct() {
        selfdestruct(owner);
    }
}
/*
Main Chain
var upAdd = '0x2bfE225cD4e5DeC95dBD901c19a848DdD2c4b65E'
var upABI = eth.contract([{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"selfDestruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"addToPrizePool","outputs":[],"payable":true,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fromWhom","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"atTime","type":"uint256"}],"name":"LogEtherReceived","type":"event"}])
var up = upABI.at(upAdd)
*/
