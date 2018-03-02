const express          = require('express'),
      app              = express(),
      port             = 3000,
      bodyParser       = require('body-parser'),
      utils            = require('./modules/utils'),
      getLowGas        = require('./pathways/getlowgas'),
      retrieveResults  = require('./pathways/retrieveResults'),
      retrieveMatches  = require('./pathways/retrieveMatches'),
      updateOnWithdraw = require('./pathways/updateonwithdraw')

/*
Notes:
Tweet entries for funsies?
use pm2 for clustering/load balancing
please works
*/

//process.on('warning', e => console.warn(e.stack))//give me the stack trace on the event emitter warning...
//process.setMaxListeners(Infinity)//Will silence warning but first I need to know why...
process.on('unhandledRejection', err => {console.log('unhandledRejection', err.stack)})//TODO: remove!
/* Various pathways to serve the whitepaper */
app.use(['/whitepaper','/ico/whitepaper'],  (req,res) => {
  res.sendFile((__dirname + '/public/etheraffleWhitePaper.pdf'))
})
app.use('/ethrelief/whitepaper',  (req,res) => {
  res.sendFile((__dirname + '/public/ethReliefWhitePaper.pdf'))
})
/* Requests to etheraffle.com/ico picks up the ico react app static files from this location */
app.use('/ico', express.static(__dirname + '/../../ico/build/'))
/* Public folder for serving static images/miscellany */
app.use('/public', express.static(__dirname + '/public/'));
/* All other reqs pick up this app's build */
app.use(express.static(__dirname + '/build/'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use((err, req, res, next) => {//Allows custom error handling of the bodyParser middleware...
  if(err instanceof SyntaxError) return res.status(500).send("Error - malformed JSON input!")
  return res.status(500).send("Internal Server Error!")
})
/* Specific pathways come first... */
app.get('/ico', (req, res) => res.sendFile(__dirname + '/../../ico/build/index.html'))
/* Before the catch all version grabs the other requests! */
app.get('/', (req, res) => res.sendFile(__dirname + '/build/index.html'))

/* Get matches array for smart contract */
app.post("/api/a", (req,res) => {
  return retrieveMatches(req.body)
  .then(result => {
    res.status(200).json({m:result})
  }).catch(err => utils.errorHandler("api/a", "App", req.body, err))
})

/* Get user results for front end */
app.post("/api/ethaddress", (req,res) => {
  return retrieveResults(req.body)
  .then(results => {
    return results != null ? res.status(200).json(results) : res.status(200).json({message:"Eth address not found"})
  }).catch(err => utils.errorHandler("/api/ethaddress", "App", req.body, err))
})

/* Update user results on withdraw */
app.post("/api/updateonwithdraw", (req,res) => {
  return updateOnWithdraw(req.body)
  .then(bool => {
    return bool == true ? res.status(200).json({message:"Success!"}) : res.status(500).json({message:"Fail!"})
  }).catch(err => utils.errorHandler("api/updateonwithdraw", "App", req.body, err))
})

/* Contact form emails */
app.post("/api/contactform", (req,res) => {
  return utils.sendEmail('Contact Form Submission', 'From: ' + req.body.email + '<br><br>Query: ' + req.body.query, 'support')
  .then(bool => {
    res.status(200).json({success: bool})
  }).catch(err => utils.errorHandler("api/contactform", "App", req.body, err))
})

/* Get Safe Low Gas */
app.get("/api/gas", (req,res) => {
  return getLowGas()
  .then(gas => {
    res.status(200).json({safeLow: gas})
  }).catch(err => utils.errorHandler("api/gas", "App", req.body, err))
})

/* Error logging from front end */
app.post('/api/error', (req, res) => {
  console.log("Front end error: ", req.body.message, ", error: ", req.body.error)
  return res.sendStatus(200)
})

app.listen(port, () => console.log("Express server started & is listening on port: " + port))
