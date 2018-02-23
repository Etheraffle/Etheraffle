pragma solidity^0.4.15;
/*

Have a flexible entry function that is price flexible and allows certain addresses in a list entry and set prices BELOW the current ticket price allowing for markup!

Voting on who is allowed in and at what prices can be goverend by the LOT DAO.

Issues with the calc of the profit in the structs though.


*/



      function affiliateEntry(uint[] cNums, address _entrant) external {
          require(
              isAffiliate[msg.sender] &&
              msg.value >= affiliateRate[msg.sender]
            );
          buyTicket(_cNums, _entrant, msg.value, _affID);
      }
