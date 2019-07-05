var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

let indexRouter = require('./routes/index')
let usersRouter = require('./routes/users')
let photosRouter = require('./routes/photos')
let uploadRouter = require('./routes/upload')


var app = express();

// app.configure(() => {
//   app.set('photos', __dirname + '/public/photos')
// })

// app.configure('production', () => {
//   app.set('photos', '/mounted-volume/photos')
// })

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('photos', path.join(__dirname, '/public/photos'))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/photos', photosRouter)
app.use('/upload', uploadRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500);
  res.render('error')
});

app.listen(3000, () => {
  console.log('server listening port 3000')
})

// module.exports = app
