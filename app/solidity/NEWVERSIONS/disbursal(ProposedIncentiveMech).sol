pragma solidity^0.4.15;

contract LOTInterface {
    bool public frozen;
    uint public totalSupply;
    function balanceOf(address who) constant public returns (uint) {}
    function setFrozen(bool _status) external returns(bool) {}
}

contract FreeLOTInterface {
    function mint(address _to, uint _amt) external {}
}

contract EthReliefInterface {
    function receiveEther() external payable {}
}

library SafeMath {
    function sub(uint256 a, uint256 b) internal constant returns (uint256) {
        assert(b <= a);
        return a - b;
    }
    function add(uint256 a, uint256 b) internal constant returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

contract etheraffleDisbursal {
    using SafeMath for uint;

    LOTInterface LOT;
    FreeLOTInterface FreeLOT;
    EthReliefInterface EthRelief;
    address public ethRelief;
    uint    public free    = 5;
    uint    public year    = 2018;
    uint    public weekDur = 604800;
    uint    public start   = 1514764800;// Jan 1st 2018 date

    /* Mapping years to quarters to ether. */
    mapping (uint => mapping (uint => uint)) public totals;
    /* Mapping years to quarters to ether redeemed */
    mapping (uint => mapping (uint => uint)) public redeemed;
    /* Mapping years to quarters to addresses to bool */
    mapping (uint => mapping (uint => mapping (address => bool)) public LOTHolder;

    event LogFreezing(address byWhom, uint inWeek, bool status, uint atTime);
    event LogEtherReceived(address fromWhom, uint howMuch, uint inYear, uint inQuarter);
    event LogPayout(address toWhom, uint amount, uint forYear, uint forQuarter, uint atTime);
    event LogDonation(uint howMuch, uint fromYear, uint fromQuarter, uint inWeek, uint atTime);

    function etheraffleDisbursal(address _LOT, address _ethRelief, address _freeLOT) {
        LOT = LOTInterface(_LOT);
        EthRelief = EthReliefInterface(_ethRelief);
        FreeLOT = FreeLOTInterface(_freeLOT);
    }

    function withdraw() external {
        //uint validWeekNo = (getQuarter() * 13) + 12;//last week of each quarter
        //WHAT IF IT'S THE LAST PERSON ZERO THE BAL? TRACK AMT?
        if(LOT.frozen() && isValid()) {//valid week & frozen
            payOut(msg.sender);
            return;
        } else if(!LOT.frozen() && isValid()) {//if valid week but not frozen
            LOT.setFrozen(true);//.gas(GASAMT)()
            LogFreezing(msg.sender, getWeek(), true, now);
            payOut(msg.sender);
            return;
        } else if(LOT.frozen() && !isValid()) {//if not valid but still frozen, unfreeze and donate any remainder to EthRelief, giving function caller x freeLOT coupons...
            LOT.setFrozen(false);//.gas(GASAMT)()
            LogFreezing(msg.sender, getWeek(), false, now);
            FreeLOT.mint(msg.sender, free);
            /* Get last two quarter's remaining balances & donate to EthRelief */
            uint yA = getQuarter() > 0 ? getYear() : getYear() - 1;
            uint qA = getQuarter() > 0 ? getQuarter() - 1 : 4;
            uint yB = qA > 0 ? yA : yA - 1;
            uint qB = qA > 0 ? qA - 1 : 4;
            uint amtA = redeemed[yA][qA];
            uint amtB = redeemed[yB][qB];
            if(amtA > 0) {
                redeemed[yA][qA] = 0;
                EthRelief.receiveEther.value(amtA);
                LogDonation(amtA, yA, qA, getWeek(), now);
                return;
            }
            if(amtB > 0) {
                redeemed[yB][qB] = 0;
                EthRelief.receiveEther.value(amtB);
                LogDonation(amtB, yB, qB, getWeek(), now);
                return;
            }
            LogDonation(0, yA, qA, getWeek(), now);
            return;
        }// else not frozen and not a valid week - do nothing.
    }

    function payOut() internal {
        uint y = getYear();
        uint q = getQuarter();
        require(!LOTHolder[y][q][msg.sender]);
        LOTHolder[y][q][msg.sender] = true;
        uint bal = LOT.balanceOf(msg.sender);
        uint tot = LOT.totalSupply();
        uint amt = (bal * totals[y][q]) / tot;
        redeemed[y][q] = redeemed[y][q].sub(amt);//throws anyway...
        msg.sender.transfer(amt);
        LogPayout(msg.sender, amt, y, q, now);
    }

    function getYear() public constant returns (uint) {
        return year + ((now - start) / (weekDur * 52));
    }

    function getQuarter() public constant returns (uint) {
      return ((now - start) / (weekDur * 13)) % 4;
    }

    function getWeek() public constant returns (uint) {
        uint yearNo = getYear() - year;
        uint weekNo = (now -  (start + (weekDur * 52 * yearNo)) / weekDur);
        return weekNo;
    }

    function isValid() public constant returns (bool) {
        uint validWeekNo = (getQuarter() * 13) + 12;//last week of each quarter
        if(validWeekNo == getWeek()) return true;
        else return false;
    }

    function receiveEther() external payable {
        require(msg.value > 0);
        if(!isValid()) {
          totals[getYear()][getQuarter()] += msg.value;
          redeemed[y][q] += msg.value;
          LogEtherReceived(msg.sender, msg.value, getYear(), getQuarter());
        } else {//add to next quarter
          uint q = getQuarter() == 3 ? 0 : getQuarter();
          uint y = q == 0 ? getYear() + 1 :  getYear();
          totals[y][q] += msg.value;
          redeemed[y][q] += msg.value;
          LogEtherReceived(msg.sender, msg.value, y, q);
        }
    }

    function () {
      receiveEther();
    }

    /*
    address public etheraffle

    function setFree(uint _newFree) external onyEtheraffle {
        free = _newFree;
    }

    modifier onlyEtheraffle() {
        require(msg.sender == etheraffle);
        _;
    }
    */

}
