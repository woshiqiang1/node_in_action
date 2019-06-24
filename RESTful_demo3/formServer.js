let http = require('http')
let item = []

let server = http.createServer((req, res) => {
  if('/' === req.url){
    switch(req.method){
      case 'GET':
        show(res)
        break
      case 'POST':
        add(req, res)
        break
      default:
        badRequest(res)    
    }
  }
  else{
    notFound(res)
  }
})

server.listen(3000)

function show(res){
  const html = `
  <html>
    <head>
      <title>Todo List</title>
    </head>
    <body>
      <h1>Todo List</h1>
      <ul>
        ${items.map(item => `<li>${item}</li>`)}
      </ul>
      <form method="post" action="/">
        <p>
          <input type="text" name="item"/>
        </p>
      </form>
    </body>
  </html>  
  `
}