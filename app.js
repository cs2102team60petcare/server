var createError = require('http-errors')
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var logger = require('morgan')
var session = require('express-session')
var passport = require('./config/passportconfig')
var flash = require('connect-flash')
// Import database connections
const pool = require('./database/connection')

// Import Routes
var signUpRouter = require('./routes/signup')

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

app.get('/', function (req, res, next) {
  res.render('home', { title: 'PetCare Main Page' })
})

app.get('/login', function (req, res, next) {
  console.log(req.body)
  res.render('loginform', { title: 'Login to Petcare' })
})

app.post('/login', passport.authenticate('local', { successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true }))

app.get('/home', function (req, res, next) {
  res.render('home', { title: 'Welcome to PetCare Home' })
})
// Add routes to app
app.use('/signup', signUpRouter)

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
