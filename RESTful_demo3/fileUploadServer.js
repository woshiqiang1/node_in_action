let http = require('http')
let formidable = require('formidable')
let server = http.createServer((req, res) => {
  switch(req.method){
    case 'GET':
      show(req, res)
      break
    case 'POST':
      upload(req, res)
      break  
  }
})

server.listen(3000)

function show(req, res){
  let html = `
  <form method="post" action="/" enctype="multipart/form-data">
    <p>
      <input type="text" name="name"/>
    </p>
    <p>
      <input type="file" name="file"/>
    </p>
    <p>
      <input type="submit" value="Upload"/>
    </p>
  </form>  
  `
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-length', Buffer.byteLength(html))
  res.end(html)
}

function upload(req, res){
  if(!isFormData(req)){
    res.statusCode = 400
    res.end('Bad Request: expecting multipart/form-data')
    return
  }

  let form = new formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    console.log(fields)
    console.log(files)
    res.end('upload complete!')
  })

  form.on('progress', (bytesReceived, bytesExpected) => {
    let percent = Math.floor(bytesReceived / bytesExpected * 100)
    console.log(`已上传${percent}%`)
  })
}

function isFormData(req){
  let type = req.headers['content-type'] || ''
  return type.indexOf('multipart/form-data') === 0
}