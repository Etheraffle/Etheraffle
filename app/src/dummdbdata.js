db.ethAdd.insert({"ethAdd" : "0xb7ea14973700361dc1cb5df0bc513051d480437d",
"raffleIDs" : [
  "8",
  "9",
  "10"
],
"entries" : {
  "8" : [[1,2,3,4,5,6,1,1],[7,8,9,10,11,12,2,2]],
  "9" : [[1,21,30,40,41,49,1,1],[5,10,22,27,39,42,2,2],[4,5,15,23,31,34,3,3]],
  "10" : [[1,2,3,4,5,6,1,1],[7,8,9,10,11,12,2,2, '0xdsfg0xf57f81a513b6341a71e7e8369185dab3506be24f00be0ba7d75cfd88853f010d',1518443130],[13,14,15,16,17,18,3,3],[19,20,21,22,23,24,4,4]]
}})


db.entries.insert({
"raffleID" : "8",
"entriesArr" : [[1,2,3,4,5,6,1,1],[7,8,9,10,11,12,2,2]],
"entries" : 2
})

db.entries.insert({
"raffleID" : "9",
"entriesArr" : [[1,21,30,40,41,49,1,1],[5,10,22,27,39,42,2,2],[4,5,15,23,31,34,3,3]],
"entries" : 3,
"resultsArr" : {
  "winningNumbers" : [5,10,22,27,39,42],
  "winningAmounts" : [0,0,0,11785496321045587598,29695854120357854896,91780549632145587598,496095854123578548962],
  "timeStamp" : 1507409214
}
})

db.entries.insert({
"raffleID" : "10",
"entriesArr" : [[1,2,3,4,5,6,1,1],[7,8,9,10,11,12,2,2],[13,14,15,16,17,18,3,3],[19,20,21,22,23,24,4,4]],
"entries" : 4,
"resultsArr" : {
  "winningNumbers" : [7,8,9,20,24,31],
  "winningAmounts" : [0,0,0,19695854123570854896,41785409632145587598,129069585412357854896,2060178549632145587598],
  "timeStamp" : 1506805494
}
})

///////////////////////////////////////////////////////////////////////////
/////////////////////Queries...////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

db.ethAdd.update({"ethAdd" : "0xb608678520ee8b741759b6de187939dee3514906"}, {$pull : {"entries.8" : [1,2,3,4,5,6,1,1]}}) //WORKS TO REMOVE ARRAY..

db.ethAdd.update({"ethAdd" : "0xb608678520ee8b741759b6de187939dee3514906"}, {$pull : {"entries.8" : [1,2,3,4,5,6,1,1]}, $push :{"entries.8" : [1,2,3,4,5,6,1,1,0]}}) //CAN'T DO BOTH AT SAME TIME...:(




db.ethAdd.update({"ethAdd" : "0xb608678520ee8b741759b6de187939dee3514906", "entries.9" : [5,10,22,27,39,42,2,2,]}, {$push : {"entries.9.$" : {$each : ["txhash", "timestamp"]}}})// THIS IS THE ONE MOTHERFUCKER!!
//so in javascript:
var obj1 = {}
obj1["ethAdd"] = ethAdd
obj1["entries." + raffleID] = entryNumArr//make sure key is correct string...
var obj2 = {}
obj2["$each"] = [txHash, timeStamp]
var obj3 = {}
obj3["entries." + raffleID + ".$"] = obj2//add a zero to the array to soft-signify that it's been withdrawn...
db.ethAdd.update(obj1, {$push : obj3}).then//and so on...

///////////////////////////////////////////////////////////////////////////
///////////////Create random entries for bot entering//////////////////////
///////////////////////////////////////////////////////////////////////////
/*
selfDestruct code: "0x9cb8a26a"

Snippet for enter raffle...
var raffleABI = eth.contract([{"constant":false,"inputs":[{"name":"_one","type":"uint256"},{"name":"_two","type":"uint256"},{"name":"_three","type":"uint256"},{"name":"_four","type":"uint256"},{"name":"_five","type":"uint256"},{"name":"_six","type":"uint256"}],"name":"enterRaffle","outputs":[],"payable":true,"type":"function"}])
*/
var tktPrice = raffle.tktPrice.call()
for(var q = 0; q < 20; q++){
  for(var m = 0; m < 10; m++){
    var eNums = []
    for(var k = 0; k < 6; k++){
      var n = Math.floor(Math.random() * 49) + 1
      if(n == eNums[0]){k--} else
      if(n == eNums[1]){k--} else
      if(n == eNums[2]){k--} else
      if(n == eNums[3]){k--} else
      if(n == eNums[4]){k--} else
      if(n == eNums[5]){k--} else
      eNums[k] = n
    }
    for (var i = eNums.length - 1; i >= 0; i--){
      for(var j = 1; j <= i; j++){
        if(eNums[j - 1] > eNums[j]){
          var temp = eNums[j - 1]
          eNums[j - 1] = eNums[j]
          eNums[j] = temp
        }
      }
    }
    var data = raffle.enterRaffle.getData(eNums, 0)
    web3.eth.sendTransaction({to:raffleAdd, from:eth.accounts[m], value: tktPrice, data: data, gas: 300000, gasPrice: 20000000000})
  }
}
//to get specific events:
var queries = raffle.LogQuerySent({/* raffleID: rafID */},{fromBlock: 0, toBlock: 'latest'}).get()
//or increment the nonce manually so as not to run into the non-send issue if quick tx submissions = duplicate nonces!:
function batchTx(sender, recipients) {
    var nonce = eth.getTransactionCount(sender);
    for( var i = 0; i < recipients.length; i++ ) {
        eth.sendTransaction({from:sender, to:recipients[i].to, value:recipients[i].value, nonce:nonce+i});
    }
}

//will spread eth to my ten accounts
for(var i = 1; i < 10; i++){
	web3.eth.sendTransaction({to:eth.accounts[i], from:eth.accounts[0], value:2000000000000000000})
}
//will console.log balance of all accounts
for(var i = 0; i < 10; i++){
	console.log("Account", i, ":", web3.fromWei((eth.getBalance(eth.accounts[i])), "ether"), " Ether")
}
//will unlock all ten accounts for one day [or duration of the geth attach...]
for(var i = 0; i < 10; i++){
	personal.unlockAccount(eth.accounts[i], "0x8f23aad1b412dabc050908ad185cd8af744c84f40bb20ef89fc2300103386a44", 86400);
}
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
var nArr = []
for(var i = 0; i<poop.length;i++){
  if(poop[i].event == "LogTicketBought")
  nArr.push(poop[i].args.chosenNumbers)
}

function getMatches(entryNums, winningNums){
  var matches = 0
    for(var i = 0; i < 6; i++){
      for(var j = 0; j < 6; j++){
        if(entryNums[i] === winningNums[j]){
          matches++;
          break;
        }
      }
    }
  return matches;
}
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
function getMissingEntries(numEntries, entriesArr){
  var entriesWithHoles = new Array(numEntries).fill(null)
  for(var i = 0; i < entriesArr.length; i++){//create array with entries in their "correct" index position
    entriesWithHoles[(entriesArr[i][6]) - 1] = entriesArr[i]
  }//now the nulls are the "holes" and null index positions + 1 are the missing numbers...
  var missingNo = []
  for(var i = 0; i < entriesWithHoles.length; i++){
    if (entriesWithHoles[i] == null){
      missingNo.push(i + 1)//plus one makes array contain missing entrynums, not their indices!
    }
  }
  function getBlock() {
    return new Promise(
      function (resolve, reject) {
        web3.eth.getBlockNumber((error, result) => {
          if(!error){
            resolve(result)
          } else {
            reject(error);
          }
        })
      }
    )
  }
  getBlock().then(blockStart => {
    for(var i = 0; i < missingNo.length; i++){
      etheraffle.LogTicketBought({entryNumber: missingNo[i]},{fromBlock: blockStart - 4000, toBlock: "latest"}).get((error,result) => {
        if(!error)
          console.log("Res: ", result, ", blockStart: ", blockStart)
          var chosenNumbers = []
          for(var i = 0; i < 6; i++){
            chosenNumbers.push(JSON.parse(result[0].args.chosenNumbers[i]))
          }
          chosenNumbers.push(JSON.parse(result[0].args.entryNumber))//add entryNum to end of array
          chosenNumbers.push(JSON.parse(result[0].args.personalEntryNumber))
          entriesWithHoles[missingNo[i]] = chosenNumbers
      })
    }
  })
  return entriesWithHoles
}


function poo(_howMany) {
  entArr = []
  for(m = 0; m < _howMany; m++){
    var eNums = []
    for(k = 0; k < 6; k++){
      eNums.push(Math.floor(Math.random() * 49) + 1)
    }
    //sort arr
    for (var i = eNums.length - 1; i >= 0; i--){
      for(var j = 1; j <= i; j++){
        if(eNums[j - 1] > eNums[j]){
          var temp = eNums[j - 1];
          eNums[j - 1] = eNums[j];
          eNums[j] = temp;
        }
      }
    }
    entArr.push(eNums)
  }
  return entArr
}
//Test function so repeat numbers are common...
function getRandomArrays(_howMany){
  return new Promise ((resolve, reject) => {
    var entriesArr = []
    for(m = 0; m < _howMany; m++){
      var eNums = []
      for(k = 0; k < 8; k++){
        eNums.push(Math.floor(Math.random() * 49) + 1)
      }
      for (var i = eNums.length - 1; i >= 0; i--){
        for(var j = 1; j <= i; j++){
          if(eNums[j - 1] > eNums[j]){
            var temp = eNums[j - 1];
            eNums[j - 1] = eNums[j];
            eNums[j] = temp;
          }
        }
      }
      entriesArr.push(eNums)
    }
    if(entriesArr.length == _howMany){
      console.log("Got random arrays!")
      return resolve(entriesArr)
    } else {
      return reject([])
    }
  })
}
//NO REPEATS
function rand(_howMany){
  //return new Promise((resolve, reject) => {
    entriesArr = []
    for(j = 0; j < _howMany; j++){
      var eNums = [null,null,null,null,null,null]
      for(k = 0; k < 6; k++){
        let n = Math.floor(Math.random() * 49) + 1
        if(n == eNums[0]){k--} else
        if(n == eNums[1]){k--} else
        if(n == eNums[2]){k--} else
        if(n == eNums[3]){k--} else
        if(n == eNums[4]){k--} else
        if(n == eNums[5]){k--} else
        eNums[k] = n
      }
      entriesArr.push(eNums)
      if(entriesArr.length == _howMany){
        return entriesArr
      }
    }
    /*
    if(entriesArr.length == _howMany){
      return resolve(entriesArr)
    } else {
      return reject([])
    }
  })
  */
}

function x(_num){
  arrs = []
  for(i = 0; i < _num; i++){
    var obj = {}
    obj['winningNumbers'] = [1,2,3,7,8,9]
    /*
    rand(1000000).then(res => {
      obj['entriesArr'] = res
      var p = getMatchesArr(obj)
    })
    */
    obj['entriesArr'] = rand(1000000)
    var p = getMatchesArr(obj)
    arrs.push(p)
    if(i == _num - 1){
      return arrs
    }
  }
}

function totals(_arr){
  var matches = [0,0,0,0,0,0,0]
  for (i = 0; i < _arr.length; i++){
    for(j = 0; j < _arr[i].length; j++){
      matches[j] += _arr[i][j]
    }
    if(i == _arr.length - 1){
      return matches
    }
  }
}
///////////////////////////////////////////////////////////////////////////////
//////////Get Matches Array for testing.../////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function getMatchesArr(_wObj){
  var matchesArr = [0,0,0,0,0,0,0]
  for(var n = 0; n < _wObj.entriesArr.length; n++){
    var matches = 0
    for(var i = 0; i < 6; i++){
      for(var j = 0; j < 6; j++){
        if(_wObj.entriesArr[n][i] == _wObj.winningNumbers[j]){
          matches++
          break
        }
      }
    }
    matchesArr[matches]++
  }
  return matchesArr
}
for (let i = 1; i <= 100; i++){
  if(i % 3 == 0 && i % 5 == 0) console.log("Fizzbuzz")
  else if(i % 3 == 0) console.log("Fizz")
  else if(i % 5 == 0) console.log("Buzz")
  else console.log(i)
}

for (let i = 1; i <= 100; i++){
  let output = ""
  if(i % 3 == 0) output += "Fizz"
  if(i % 5 == 0) output += "Buzz"
  if(output == "") output += i
  console.log(output)
}
for(i = 0; i < 1e2;) console.log((++i % 3 ? "":"Fizz") + (i % 5 ? "":"Buzz") || i)

function database(_bool){
  return new Promise((resolve, reject) => {
    return _bool == true ? resolve("Yay") : reject(null)
  })
}
function fakeEvent(_bool){
  if(_bool == true){
    console.log("Event succeeded!")
    return true
  }
  console.log("Event failed and so threw an error!")
  return false
}
function getEntry(_event, _db){
  return new Promise((resolve,reject) => {
    let meh = fakeEvent(_event)
    if(meh == false) {
      console.log("Shit! The event errored!")
      return resolve(null)
    } else {
      let p1 = database(_db)
      let p2 = database(_db)
      return Promise.all([p1,p2])
      .then(([r1, r2]) => {
        console.log("res1: ", r1, ", res1: ", r2)
        return resolve("Anything but null!")
      }).catch( err => {
        console.log("Error from db: ", err)
        //reject from the db comes here..but I can call....
        return resolve(null)//goes back to get missing entresi function thus not breaking that oo
      })
    }
  })
}
function getMiss(_event, _db){
  return getEntry(_event, _db)
  .then(result => {
    result != null ? console.log("Result: ", result) : console.log("Null shows here NOT in the catch!")
  }).catch(err => {
    console.log("We're in the getMiss catch handler!: ", err)
    //NO THE CATCH ISN'T CALLED ON THE NULL BEING RETURNED!
  })
}

if using DIFFERENT processes in the workers (as I hope to!) just require the js file in question in that workers spawn logic!
var cluster = require("cluster");
if(cluster.isMaster){
    // Forking Worker1 and Worker2
    var worker1 = cluster.fork({WorkerName: "worker1"});
    var worker2 = cluster.fork({WorkerName: "worker2"});

    // Respawn if one of both exits
    cluster.on("exit", function(worker, code, signal){
        if(worker==worker1) worker1 = cluster.fork({WorkerName: "worker1"});
        if(worker==worker2) worker2 = cluster.fork({WorkerName: "worker2"});
    });
} else {
    if(process.env.WorkerName=="worker1"){
         // Code of Worker1
    }

    if(process.env.WorkerName=="worker2"){
         // Code of Worker2
         // require('./something.js')
         // console.log("Worker has started: ", process.pid );
    }
}

//clustering with error logging incase a worker dies...
var cluster = require('cluster');

var workers = process.env.WORKERS || require('os').cpus().length;

if (cluster.isMaster) {

  console.log('start cluster with %s workers', workers);

  for (var i = 0; i < workers; ++i) {
    var worker = cluster.fork().process;
    console.log('worker %s started.', worker.pid);
  }

  cluster.on('exit', function(worker) {
    console.log('worker %s died. restart...', worker.process.pid);
    cluster.fork();
  });

} else {

  var http = require('http');
  http.createServer(function (req, res) {
    res.end("Look! I'm a server!\n");
  }).listen(3000, "127.0.0.1");

}

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})
//TRY WDRAWING ETHER AND EARLY TOO
//Tier zero :
for (var j = 0; j < 1; j++) {
  for (var i = 0; i < 10; i++) {
    var amt = (i * 10000000000000000) + 50000000000000000
    web3.eth.sendTransaction({to: icoAdd, from: eth.accounts[i], gas: 130000, value: amt})
  }
}
//Tier one:
for (var j = 0; j < 2; j++) {
  for (var i = 0; i < 10; i++) {
    var amt = (i * 10000000000000000) + 50000000000000000
    web3.eth.sendTransaction({to: icoAdd, from: eth.accounts[i], gas: 130000, value: amt})
  }
}
//Tier two:
for (var j = 0; j < 3; j++) {
  for (var i = 0; i < 10; i++) {
    var amt = (i * 10000000000000000) + 50000000000000000
    web3.eth.sendTransaction({to: icoAdd, from: eth.accounts[i], gas: 130000, value: amt})
  }
}
//Tier three:
for (var j = 0; j < 10; j++) {
  for (var i = 0; i < 10; i++) {
    var amt = (i * 10000000000000000) + 50000000000000000
    web3.eth.sendTransaction({to: icoAdd, from: eth.accounts[i], gas: 130000, value: amt})
  }
}
web3.eth.sendTransaction({to: icoAdd, from: eth.accounts[0], gas: 130000, value: 1000000000000000000})
web3.eth.sendTransaction({to: icoAdd, from: eth.accounts[0], gas: 130000, value: 1000000000000000000})

//redeem bonus lot
var data = ico.redeemBonusLot.getData()
for(var i = 0; i < 10; i++) {
  web3.eth.sendTransaction({to: icoAdd, from: eth.accounts[i], gas: 100000, data:data})
}

//send all tokens back to etheraffle address
var amts=[]
for(var i = 0; i < 10; i++) {
  amts.push(lot.balanceOf.call(eth.accounts[i]))
}
for(var i = 0; i < amts.length; i++) {
  var data = lot.transfer.getData(metamask, amts[i])
  web3.eth.sendTransaction({to:lotAdd, from: eth.accounts[i], data:data, gas: 100000})
}

//get bonus redemtion events

var bon = ico.LogBonusLOTRedemption({},{fromBlock:0,toBlock:'latest'}).get()

//show bonus totals
for(var i = 0; i < bon.length; i++) {
  console.log(bon[i].args.lotAmount)
}


//Show token totals
var tot = 0
var tts = []
for(var i = 0; i < 10; i++) {
  var amt = lot.balanceOf.call(eth.accounts[i])
  //console.log('Account ', i, amt,'LOT')
  //console.log(i,':', amt)
  console.log(amt)
  tts.push(amt)
  tot += parseInt(amt)
  if(i == 9) console.log('Token total: ', tot,'LOT')
}

for(var i = 0; i < 4; i++) {
  var amt = lot.number.call(eth.accounts[i])
  console.log('Account ', i, amt,'LOT')
  tot += parseInt(amt)
  if(i == 9) console.log('Token total: ', tot,'LOT')
}
//get lot transfer events
var tfs = ico.LogLOTTransfer({},{fromBlock:0,toBlock:'latest'}).get()
//sort into object by tier
var tf = {0:[],1:[],2:[],3:[]}
for(var j = 0; j < 4; j++) {
  for(var i = 0; i < tfs.length; i++) {
    if(tfs[i].args.inTier == j) tf[j].push(tfs[i])
  }
}
//sort into object by account
var accs = {}
for(var j = 0; j < 10; j++) {
  accs[eth.accounts[j]] = []
  for(var i = 0; i < tfs.length; i++) {
    if(tfs[i].args.toWhom == eth.accounts[j]) accs[eth.accounts[j]].push(tfs[i])
  }
}
//sort into accounts and individual tiers
acc0 = {0:[],1:[],2:[],3:[]}
for(var j = 0; j < 4; j++) {
  for(var i = 0; i < accs[eth.accounts[0]].length; i++)
    if(accs[eth.accounts[0]][i].args.inTier == j) acc0[j].push(accs[eth.accounts[0]][i])
  }
}

acc1 = {0:[],1:[],2:[],3:[]}
for(var j = 0; j < 4; j++) {
  for(var i = 0; i < accs[eth.accounts[1]].length; i++)
    if(accs[eth.accounts[1]][i].args.inTier == j) acc1[j].push(accs[eth.accounts[1]][i])
  }


acc2 = {0:[],1:[],2:[],3:[]}
for(var j = 0; j < 4; j++) {
  for(var i = 0; i < accs[eth.accounts[2]].length; i++)
    if(accs[eth.accounts[2]][i].args.inTier == j) acc2[j].push(accs[eth.accounts[2]][i])
  }
}

acc3 = {0:[],1:[],2:[],3:[]}
for(var j = 0; j < 4; j++) {
  for(var i = 0; i < accs[eth.accounts[3]].length; i++)
    if(accs[eth.accounts[3]][i].args.inTier == j) acc3[j].push(accs[eth.accounts[3]][i])
  }
}

acc4 = {0:[],1:[],2:[],3:[]}
for(var j = 0; j < 4; j++) {
  for(var i = 0; i < accs[eth.accounts[4]].length; i++)
    if(accs[eth.accounts[4]][i].args.inTier == j) acc4[j].push(accs[eth.accounts[4]][i])
  }
}


acc5 = {0:[],1:[],2:[],3:[]}
for(var j = 0; j < 4; j++) {
  for(var i = 0; i < accs[eth.accounts[5]].length; i++)
    if(accs[eth.accounts[5]][i].args.inTier == j) acc5[j].push(accs[eth.accounts[5]][i])
  }
}


acc6 = {0:[],1:[],2:[],3:[]}
for(var j = 0; j < 4; j++) {
  for(var i = 0; i < accs[eth.accounts[6]].length; i++)
    if(accs[eth.accounts[6]][i].args.inTier == j) acc6[j].push(accs[eth.accounts[6]][i])
  }
}


acc7 = {0:[],1:[],2:[],3:[]}
for(var j = 0; j < 4; j++) {
  for(var i = 0; i < accs[eth.accounts[7]].length; i++)
    if(accs[eth.accounts[7]][i].args.inTier == j) acc7[j].push(accs[eth.accounts[7]][i])
  }
}


acc8 = {0:[],1:[],2:[],3:[]}
for(var j = 0; j < 4; j++) {
  for(var i = 0; i < accs[eth.accounts[8]].length; i++)
    if(accs[eth.accounts[8]][i].args.inTier == j) acc8[j].push(accs[eth.accounts[8]][i])
  }
}


acc9 = {0:[],1:[],2:[],3:[]}
for(var j = 0; j < 4; j++) {
  for(var i = 0; i < accs[eth.accounts[9]].length; i++)
    if(accs[eth.accounts[9]][i].args.inTier == j) acc9[j].push(accs[eth.accounts[9]][i])
  }
}
///////////////////////////////
//get acc totals per tier
acc0tot = {0:0, 1:0, 2:0, 3:0}
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < acc0[i].length; j++) {
    acc0tot[i] += parseInt(acc0[i][j].args.LOTAmt)
    console.log(i,': ', acc0[i][j].args.LOTAmt)
  }
}
var acc0sum = acc0tot[0] + acc0tot[1] + acc0tot[2] + acc0tot[3]

acc1tot = {0:0, 1:0, 2:0, 3:0}
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < acc1[i].length; j++) {
    acc1tot[i] += parseInt(acc1[i][j].args.LOTAmt)
    console.log(i,': ', acc1[i][j].args.LOTAmt)
  }
}
var acc1sum = acc1tot[0] + acc1tot[1] + acc1tot[2] + acc1tot[3]

acc2tot = {0:0, 1:0, 2:0, 3:0}
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < acc2[i].length; j++) {
    acc2tot[i] += parseInt(acc2[i][j].args.LOTAmt)
    console.log(i,': ', acc2[i][j].args.LOTAmt)
  }
}
var acc2sum = acc2tot[0] + acc2tot[1] + acc2tot[2] + acc2tot[3]

acc3tot = {0:0, 1:0, 2:0, 3:0}
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < acc3[i].length; j++) {
    acc3tot[i] += parseInt(acc3[i][j].args.LOTAmt)
    console.log(i,': ', acc3[i][j].args.LOTAmt)
  }
}
var acc3sum = acc3tot[0] + acc3tot[1] + acc3tot[2] + acc3tot[3]

acc4tot = {0:0, 1:0, 2:0, 3:0}
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < acc4[i].length; j++) {
    acc4tot[i] += parseInt(acc4[i][j].args.LOTAmt)
    console.log(i,': ', acc4[i][j].args.LOTAmt)
  }
}
var acc4sum = acc4tot[0] + acc4tot[1] + acc4tot[2] + acc4tot[3]

acc5tot = {0:0, 1:0, 2:0, 3:0}
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < acc5[i].length; j++) {
    acc5tot[i] += parseInt(acc5[i][j].args.LOTAmt)
    console.log(i,': ', acc5[i][j].args.LOTAmt)
  }
}
var acc5sum = acc5tot[0] + acc5tot[1] + acc5tot[2] + acc5tot[3]

acc6tot = {0:0, 1:0, 2:0, 3:0}
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < acc6[i].length; j++) {
    acc6tot[i] += parseInt(acc6[i][j].args.LOTAmt)
    console.log(i,': ', acc6[i][j].args.LOTAmt)
  }
}
var acc6sum = acc6tot[0] + acc6tot[1] + acc6tot[2] + acc6tot[3]

acc7tot = {0:0, 1:0, 2:0, 3:0}
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < acc7[i].length; j++) {
    acc7tot[i] += parseInt(acc7[i][j].args.LOTAmt)
    console.log(i,': ', acc7[i][j].args.LOTAmt)
  }
}
var acc7sum = acc7tot[0] + acc7tot[1] + acc7tot[2] + acc7tot[3]

acc8tot = {0:0, 1:0, 2:0, 3:0}
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < acc8[i].length; j++) {
    acc8tot[i] += parseInt(acc8[i][j].args.LOTAmt)
    console.log(i,': ', acc8[i][j].args.LOTAmt)
  }
}
var acc8sum = acc8tot[0] + acc8tot[1] + acc8tot[2] + acc8tot[3]

acc9tot = {0:0, 1:0, 2:0, 3:0}
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < acc9[i].length; j++) {
    acc9tot[i] += parseInt(acc9[i][j].args.LOTAmt)
    console.log(i,': ', acc9[i][j].args.LOTAmt)
  }
}
var acc9sum = acc9tot[0] + acc9tot[1] + acc9tot[2] + acc9tot[3]

var gts = []
gts.push(acc0sum, acc1sum, acc2sum, acc3sum, acc4sum, acc5sum, acc6sum, acc7sum, acc8sum, acc9sum)


//gts = grand totals purchased, tts = token totals after bonus
var bts = []
for(i = 0; i < tts.length; i++) {
  var amt = tts[i] - gts[i]
  bts.push(amt)
}



///////
for(var i = 0; i < 10; i++) {
  ico.tier0.call([eth.accounts[i]])
}
