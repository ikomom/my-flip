const fse = require("fs-extra");
const multiparty = require("multiparty");
const path = require("path");
const UPLOAD_DIR = path.resolve(__dirname, ".", "temp");
const app = require('express')()

app.post('/upload', (req, res) => {
  const multipart = new multiparty.Form();
  multipart.parse(req, async (err, fields, files) => {
    if (err) return
    for (let file of files.files) {
      let dest =`${UPLOAD_DIR}/${file.originalFilename}`
      if (await fse.exists(dest)) {
        const p = path.parse(file.originalFilename)
        console.log(p)
        dest = `${UPLOAD_DIR}/${p.name}_${new Date().getTime()}${p.ext}`
      }
      fse.moveSync(file.path, dest)
    }

    console.log({
      fields: fields,
      files: files.files
    })

    res.json({ success: true })
  })
})

app.listen(3000, () => console.log("listening port 3000"))
