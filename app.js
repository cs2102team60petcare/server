var createError = require('http-errors')
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var logger = require('morgan')
var session = require('express-session')
var passport = require('./config/passportconfig')
var flash = require('connect-flash')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// Load environment variables
require('dotenv').load()
// Authentication
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  httpOnly: true,
  cookie: { maxAge: 360000, secure: false }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Add routes
var routes = require('./routes/main')
app.use('/', routes)

app.get('/bids', function(req, res, next){
  res.render('bids',{ bids: [
    { "oid": 1,
      "starttime": "30/03/2019 1130",
      "endtime":  "31/03/2019 2340" ,
      "bidplaced": 20,
      "status": 1
    },

    { "oid": 2,
    "starttime": "30/03/2019 1330",
    "endtime": "31/03/2019 2340" ,
    "bidplaced": 25,
    "status": 1
    } ] 
  });
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
