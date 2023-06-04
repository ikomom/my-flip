const path = require('node:path')
const app = require('express')()
// require('node:http').Server(app)
const favicon = require('serve-favicon')

app.use(favicon(path.join(__dirname, './favicon.ico')))
app.get('/', (req, res) => {
})

app.listen(3000)
