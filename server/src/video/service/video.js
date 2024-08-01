const router = require('express').Router();
const fs = require('fs')
const path = require('path')

router.get('/flower', (req, res) => {

  let videoPath = path.resolve(__dirname, '../assets/flower.webm')

  fs.readFile(videoPath, (err, data) => {
    if (err) throw err;

    res.send(data);
  })

})
router.get('/flower1', (req, res) => {

  let videoPath = path.resolve(__dirname, '../assets/flower.webm')

  let readStream = fs.createReadStream(videoPath)

  readStream.pipe(res);
})

router.get('/m3u8Index', (req, res) => {
  let videoPath = path.resolve(__dirname, '../assets/test/index.m3u8')

  fs.readFile(videoPath, (err, data) => {
    if (err) throw err;

    res.send(data);
  })
})

module.exports = router;
