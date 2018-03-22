const moment  = require('moment')
    , mongo   = require('../modules/mongo')

module.exports = (_data) => {
  const timeStamp     = moment.unix(JSON.parse(_data.args.atTime)).format('dddd, MMMM Do, YYYY h:mm:ss A'),
        ethAdd        = _data.args.theEntrant,
        raffleID      = JSON.parse(_data.args.forRaffle),
        entryNumber   = JSON.parse(_data.args.entryNumber),
        personalENum  = JSON.parse(_data.args.personalEntryNumber),
        entriesStr    = "entries." + raffleID,
        chosenNumbers = [],
        obj = {}
  for(let i = 0; i < 6; i++){chosenNumbers.push(JSON.parse(_data.args.chosenNumbers[i]))}
  chosenNumbers.push(entryNumber, personalENum)
  obj[entriesStr] = chosenNumbers
  obj["raffleIDs"] = raffleID
  let data = {obj: obj, raffleID: raffleID, ethAdd: ethAdd, chosenNumbers: chosenNumbers}
  return mongo.batchInsertion(data)
}
