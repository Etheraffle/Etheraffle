/* Returns either the safe low gas price or err */
export default () => {
  return new Promise ((resolve, reject) => {
    return fetch('https://ethgasstation.info/json/ethgasAPI.json')
    .then(res => {
      return res.json()
      .then(json => {
        let gas = json.average / 10
        return gas > 0 ? resolve(gas) : reject(null)
      })
    }).catch(err => {
      return reject(err)
    })
  })
}