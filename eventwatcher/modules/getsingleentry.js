const getWeb3 = require('./getweb3')

module.exports = (_blockStart, _raffleID, _missingNo) => {
  return new Promise ((resolve, reject) => {
    return getWeb3.etheraffle.LogTicketBought({entryNumber: _missingNo},{fromBlock: _blockStart - 40000, toBlock: "latest"}).get((err, res) => {
      if (err || res.length == 0) return resolve(null)//Errors here don't matter too much, not critical we get ALL entries when calling this!
      if (_raffleID != res[0].args.forRaffle) return resolve(null)
      const raffleID = JSON.parse(res[0].args.forRaffle),
            ethAdd   = res[0].args.theEntrant,
            chosen   = []
      for (let j = 0; j < 6; j++) {chosen.push(JSON.parse(res[0].args.chosenNumbers[j]))}
      chosen.push(JSON.parse(res[0].args.entryNumber), JSON.parse(res[0].args.personalEntryNumber))
      let obj = {raffleID: raffleID, ethAdd: ethAdd, chosenNumbers: chosen}
      return resolve(obj)
    })
  })
}