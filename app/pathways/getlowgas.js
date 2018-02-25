const utils   = require('../modules/utils'),
      request = require('request'),
      cheerio = require('cheerio')

/* Scrapes the eth gas station to pull out the safe low price */
module.exports = function() {
  return new Promise((resolve, reject) => {
    request('https://ethgasstation.info/', (err, res, html) => {
      if(err) return reject(err)
      let $ = cheerio.load(html),
          x = $('.tile_stats_count').find('div'),//closest class tag to what we want...
          g = $(x[3]).text()//3rd div contains what we want
      return resolve(g)
    })
  })
}
