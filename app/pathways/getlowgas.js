const utils   = require('../modules/utils')
    , request = require('request')
    , cheerio = require('cheerio')
/* Scrapes the eth gas station to pull out the safe low price */
module.exports = () => {
  return new Promise((resolve, reject) => {
    request('https://ethgasstation.info/', (err, res, html) => {
      if(err) return reject(err)
      let $ = cheerio.load(html)
        , x = $('.tile_stats_count').find('div')
        , g = $(x[3]).text()
      return resolve(g)
    })
  })
}
