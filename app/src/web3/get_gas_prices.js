/* Returns either the safe low gas price or err */
export default () => {
  return new Promise ((resolve, reject) => {
    return fetch('https://ethgasstation.info/json/ethgasAPI.json')
    .then(res => {
      return res.json()
      .then(json => {
        let low = json.safelow_calc / 10
          , average = json.average / 10
        return { average, low }
        // return low > 0 ? resolve(gas) : reject(null)
      })
    }).catch(err => {
      return reject(err)
    })
  })
}