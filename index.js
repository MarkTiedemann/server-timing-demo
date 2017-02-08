const http = require('http')

const randomNumber = max =>
  Math.floor(Math.random() * max)

const generateTimings = () => [
  {
    name: 'stat-service', 
    desc: 'Statistics Service (uWS 0.12.0 on Node 7.5.0)', 
    time: randomNumber(20)
  }, 
  {
    name: 'db-service', 
    desc: 'Database Service (PouchDB 6.1.2)',
    time: randomNumber(80)
  }
]

const calculateTotal = timings =>
  timings.map(({ time }) => time)
  .reduce((t0, t1) => t0 + t1, 0)

const buildTotalTiming = total => ({
  name: 'total',
  desc: 'Total',
  time: total
})

const formatTiming = ({ name, desc, time }) =>
  `${name}=${time / 1000}; "${desc}"`

const formatHeaders = timings => 
  timings.map(formatTiming)
  .join(', ')

http.createServer((req, res) => {
  if (req.url !== '/') 
    return res.end()

  const timings = generateTimings()
  const total = calculateTotal(timings)
  timings.push(buildTotalTiming(total))
  const header = formatHeaders(timings)

  setTimeout(() => {
    res.writeHead(200, {
      'Timing-Allow-Origin': '*',
      'Server-Timing': header
    })
    res.end()
  }, total)
}).listen(3000)