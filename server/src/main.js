const path = require('node:path')
const app = require('express')()
// require('node:http').Server(app)
const favicon = require('serve-favicon')

const WebSocket = require('ws')

app.use(favicon(path.join(__dirname, './favicon.ico')))

const wss = new WebSocket.Server({ port: 9888 })

wss.on('connection', (ws) => {
  console.log('server : receive connection.')

  ws.on('message', (message) => {
    console.log('server: received message: %s', message)
  })
  // let i = 100
  // setInterval(() => {
  //   if (i > 0) {
  //     ws.send(`world ${i}<br/>`)
  //     i--
  //   }
  // }, i)

  ws.send('world')
  ws.on('close', () => {
    console.log('websocket close ')
  })
})

app.get('/', (req, res) => {
  console.log('get', req.url)
  res.sendFile(path.resolve(__dirname, './index.html'))
})
app.get('/WwLogin.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, './WwLogin.js'))
})

app.listen(3000)
