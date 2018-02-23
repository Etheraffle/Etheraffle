/*
gist via 3esmit on thread
https://github.com/ethereum/EIPs/issues/225

similar to my twitter idea...
*/
contract GitHubOracle is  usingOraclize {
    //constant for oraclize commits callbacks
    uint8 constant CLAIM_USER = 0;
    //temporary storage enumerating oraclize calls
    mapping (bytes32 => uint8) claimType;
    //temporary storage for oraclize user register queries
    mapping (bytes32 => UserClaim) userClaim;
    //permanent storage of sha3(login) of github users
    mapping (bytes32 => address) users;
    //events
    event UserSet(string githubLogin, address account);
    //stores temporary data for oraclize user register request
    struct UserClaim {
        address sender;
        bytes32 githubid;
        string login;
    }

    //register or change a github user ethereum address
    function register(string _github_user, string _gistid)
     payable {
        bytes32 ocid = oraclize_query("URL", strConcat("https://gist.githubusercontent.com/",_github_user,"/",_gistid,"/raw/"));
        claimType[ocid] = CLAIM_USER;
        userClaim[ocid] = UserClaim({sender: msg.sender, githubid: sha3(_github_user), login: _github_user});
    }
  //oraclize response callback
    function __callback(bytes32 _ocid, string _result) {
        if (msg.sender != oraclize_cbAddress()) throw;
        uint8 callback_type = claimType[_ocid];
        if(callback_type==CLAIM_USER){
            if(strCompare(_result,"404: Not Found") != 0){
                address githubowner = parseAddr(_result);
                if(userClaim[_ocid].sender == githubowner){
                    _register(userClaim[_ocid].githubid,userClaim[_ocid].login,githubowner);
                }
            }
            delete userClaim[_ocid]; //should always be deleted
        }
        delete claimType[_ocid]; //should always be deleted
    }
    function _register(bytes32 githubid, string login, address githubowner)
     internal {
        users[githubid] = githubowner;
        UserSet(login, githubowner);
    }
}
