const express = require('express')
const path = require('path')
const router = require('./service/video')
const cors= require('cors')
const app = express()

app.use(cors())
app.use(router);

app.use('/assets', express.static(path.resolve(__dirname, './assets')))
 
app.listen(8000, () => {
  console.log(`服务器运行于 http://127.0.0.1:8000`);
})
