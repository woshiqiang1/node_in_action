let http = require('http')
let parse = require('url').parse
let join = require('path').join
let fs = require('fs')

let root = __dirname
let server = http.createServer((req,res) => {
  let url = parse(req.url)
  let path = join(root, url.pathname)

  fs.stat(path, (err,stat) => {
    if(err){
      if(err.code === 'ENOENT'){
        res.statusCode = 404
        res.end('Not Found')
      }
      else{
        res.statusCode = 500
        res.end('Internal Server Error')
      }
    }
    else{
      res.setHeader('Content-Length', stat.size)
      let stream = fs.createReadStream(path)
      // 利用pipe精简代码 res.end()会在pipe内部调用
      stream.pipe(res)
      stream.on('error', err => {
        res.statusCode = 500
        res.end('Internal Server Error')
      })
    }
  })
})

server.listen(3000)