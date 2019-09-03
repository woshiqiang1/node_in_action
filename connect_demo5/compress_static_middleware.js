let connect = require('connect')
let compression = require('compression')
let static = require('serve-static')

let app = connect()
  .use(compression()) // 旧版为connect.compress
  .use(static('source')) // 旧版为connect.static
  .listen(3000)


