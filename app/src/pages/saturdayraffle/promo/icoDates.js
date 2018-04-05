import moment from 'moment'
/*
UTC to human readable:
moment.unix(me).format('dddd Do [of] MMMM YYYY [at] HH:mm:ss')
Human date to UTC:
moment("19/04/2018 9:00", "DD/MM/YYYY HH:mm").unix()//HH = 24hr time
Now:
moment().unix()
*/
//Tier 0 start will count as from when the page goes live until the tier1 start date.
const format  = 'DD/MM/YYYY HH:mm',
      t0Human = '05/03/2018 00:00',//'19/02/2018 00:00',//proposed date the ico page & ads go live
      t1Human = '29/03/2018 00:00',
      t0Start = moment(t0Human, format).unix(),
      t1Start = moment(t1Human, format).unix(),
      t2Start = moment.unix(t1Start).add(14, 'days').unix(),
      t3Start = moment.unix(t2Start).add(21, 'days').unix(),
      icoEnds = moment.unix(t3Start).add(28, 'days').unix(),
      wdEnds  = moment.unix(icoEnds).add(14, 'days').unix(),
      getTier = (_str) => {
        if (moment().unix() < t0Start) return _str !== true ? -1 : 'Minus One'
        if (moment().unix() < t1Start) return _str !== true ? 0 : 'Zero'
        if (moment().unix() < t2Start) return _str !== true ? 1 : 'One'
        if (moment().unix() < t3Start) return _str !== true ? 2 : 'Two'
        if (moment().unix() < icoEnds) return _str !== true ? 3 : 'Three'
        if (moment().unix() < wdEnds)  return _str !== true ? 4 : 'Four'//wdraw period
        if (moment().unix() > wdEnds)  return _str !== true ? 5 : 'Five'//over
      },
      getRate = (_str) => {
        let t = getTier()
        if (t === 0) return _str === true ? '110,000' : 110000
        if (t === 1) return _str === true ? '100,000' : 100000
        if (t === 2) return _str === true ? '90,000'  : 90000
        if (t === 3) return _str === true ? '80,000'  : 80000
        return 0
      },
      getCap = () => {
        let t = getTier()
        if (t === 0) return 700
        if (t === 1) return 2500
        if (t === 2) return 7000
        if (t === 3) return 20000
        return 0
      },
      getStrap = () => {
        let t = getTier()
        if (t === -1) return "Countdown until the opening of the Etheraffle ICO"
        if (t === 0)  return "Pre-Sale ICO Period Open Now!"
        if (t === 1)  return "Tier-One Bonus Period Open Now!"
        if (t === 2)  return "Tier-Two Bonus Period Open Now!"
        if (t === 3)  return "Tier-Three Bonus Period Open Now!"
        if (t === 4)  return "Bonus LOT Redemption Period Open Now!"
        if (t === 5)  return "The Etheraffle ICO is now closed"
      },
      getRem = () => {
        let t = getTier()
        if (t === 0) return (((moment().unix() - t0Start) / (t1Start - t0Start)) * 100).toFixed(1)
        if (t === 1) return (((moment().unix() - t1Start) / (t2Start - t1Start)) * 100).toFixed(1)
        if (t === 2) return (((moment().unix() - t2Start) / (t3Start - t2Start)) * 100).toFixed(1)
        if (t === 3) return (((moment().unix() - t3Start) / (icoEnds - t3Start)) * 100).toFixed(1)
        if (t === 4) return (((moment().unix() - icoEnds) / (wdEnds - icoEnds)) * 100).toFixed(1)
        return '0'
      },
      getTRem = () => {
        return (((moment().unix() - t0Start) / (icoEnds - t0Start)) * 100).toFixed(1)
      }
export default {
  t0Start: t0Start,
  t1Start: t1Start,
  t2Start: t2Start,
  t3Start: t3Start,
  icoEnds: icoEnds,
  wdEnds:  wdEnds,
  cap:     getCap(),
  rem:     getRem(),
  tRem:    getTRem(),
  tier:    getTier(),
  rate:    getRate(),
  strap:   getStrap(),
  rateStr: getRate(true),
  tierStr: getTier(true)
}
