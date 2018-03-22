/* Queries gdax public api for price. Returns rate or null */
export default () => {
  return new Promise((resolve, reject) => {
    return fetch("https://api.gdax.com/products/ETH-USD/ticker", {
      method: "GET",
      headers: {'content-type': 'application/JSON'}
    }).then(res => {
      if (res.status === 429) return reject(new Error('Cannot retrieve exchange rate - too many requests'))
      if (res.status !== 200) return reject(new Error('Cannot retrieve exchange rate'))
      return res.json()
      .then(json => {
        return resolve(json.price)
      })
    }).catch(err => {
      return reject(err)
    })
  })
}
