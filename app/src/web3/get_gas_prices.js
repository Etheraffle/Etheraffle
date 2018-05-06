/* Returns either the safe low gas price or err */
export default () => {
  return new Promise ((resolve, reject) => {
    return fetch('https://ethgasstation.info/json/ethgasAPI.json')
    .then(res => {
      return res.json()
      .then(json => {
        return resolve({
          average = json.average / 10,
          low = json.safelow_calc / 10
        })
      })
    }).catch(err => {
      return reject(err)
    })
  })
}