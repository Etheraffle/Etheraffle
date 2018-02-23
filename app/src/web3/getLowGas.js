/* Returns either the safe low gas price or err */
export default () => {
  return new Promise((resolve, reject) => {
    return fetch("https://etheraffle.com/api/gas")
    .then(res => {
      if(res.status !== 200) return reject(new Error('Cannot retrieve low gas prices!'))
      return res.json()
      .then(json => {
        if(!(json.safeLow > 0)) return resolve(null)
        let price = json.safeLow  + ' Gwei'
        return resolve(price)
      })
    })
    .catch(err => {return reject(null)})//We don't care about errors here
  })
}
