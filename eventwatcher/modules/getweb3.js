const Web3               = require("web3"),
      ZeroClientProvider = require('web3-provider-engine/zero.js'),
      contract           = require("./abi"),
      apikeys            = require('./apikeys')
/* Instantiate Contract */
const cb   = "0xb608678520ee8b741759b6de187939dee3514906",
      web3 = new Web3(
        ZeroClientProvider({
          static: {
            eth_syncing: false,
            web3_clientVersion: "ZeroClientProvider",
          },
          pollingInterval: 4000,
          rpcUrl: apikeys.infura,
          getAccounts: (cb) => cb(null, [])
        })
      ),
      raffleAdd  = contract.raffleAdd,
      raffleABI  = web3.eth.contract(contract.raffleABI),
      etheraffle = raffleABI.at(raffleAdd)

module.exports = {
  web3: web3,
  etheraffle: etheraffle
}
