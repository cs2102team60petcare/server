var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');         
var session = require('express-session');
var passport = require('./config/passportconfig');
var flash = require('connect-flash');
// Import database connections
const pool = require('./database/connection');

// Import Routes
var signUpRouter = require('./routes/signup');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Authentication 
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 60000, secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash()); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* SQL Query - to be removed later*/
var sql_query = 'SELECT * FROM student_info';

app.get('/', function(req, res, next) {
	pool.query(sql_query, (err, data) => {
        console.log(data);
        res.status(200).json(data);
	});
});

app.get('/login', function(req, res,next) {
  console.log(req.body);
  res.render('loginform', { title: 'Login to Petcare' });
});



app.post('/login', passport.authenticate('local', {successRedirect :'/signup',
                                                  failureRedirect :'/login',
                                                  failureFlash :true}));
                                                  
// Add routes to app
app.use('/signup', signUpRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
