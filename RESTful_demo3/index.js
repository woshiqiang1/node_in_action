var http = require('http')
var url = require('url')
var items = []

var server = http.createServer((req,res) => {
  switch(req.method){
    case 'POST':
      let item = ''
      req.setEncoding('utf8')
      req.on('data', chunk => {
        item += chunk
      })
      req.on('end', () => {
        items.push(item)
        res.end('post ok\n')
      })
      break
    case 'GET':
      let body = items.map((item,i) => {
        return `${i}) ${item}`
      })
      res.setHeader('Content-Length', Buffer.byteLength(body))
      res.setHeader('Content-type', 'text/plain; chartset="utf-8"')
      res.end(body)
      break
    case 'DELETE':
      let path = url.parse(req.url).pathname
      let i = parseInt(path.slice(1), 10)
      if(isNaN(i)){
        res.statusCode = 400
        res.end('Invalid item id')
      }
      else if(!items[i]){
        res.statusCode = 404
        res.end('Item not found')
      }
      else{
        items.splice(i,1)
        res.end('delete ok\n')
      }
      break
    case 'PUT':
      // to do...      
  }
})

server.listen(5000, () => console.log('Server listen 5000 port'))