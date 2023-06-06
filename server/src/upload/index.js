const http = require("http");
const server = http.createServer();
const fse = require("fs-extra");
const multiparty = require("multiparty");
const path = require("path");
const UPLOAD_DIR = path.resolve(__dirname, ".", "temp");
const util = require('util');

server.on("request", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  console.log('req', req.url, {req, res})
  if (req.method === "OPTIONS") {
    console.log('OPTIONS', {req, res})
    res.status = 200;
    res.end();
    return;
  } 

  if (req.url === '/upload' && req.method === 'POST') {
    const multipart = new multiparty.Form();
    multipart.parse(req, async (err, fields, files) => {
      if (err) return
      //       const [chunks] = files.chunk
      for (let file of files.files) {
        fse.moveSync(file.path, `${UPLOAD_DIR}/${file.originalFilename }`)
      }
      res.writeHead(200, { 'content-type': 'text/plain' });
      res.write('ok');
      console.log({ fields: fields, files: files.files })
      
      res.end();
    })
  }


});

server.listen(3000, () => console.log("listening port 3000"));
