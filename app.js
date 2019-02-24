var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');         
const { Pool } = require('pg')

/* --- V7: Using dotenv     --- */
require('dotenv').load();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

pool.connect()
  .then(client => {
    console.log('connected')
    client.release()
  })
  .catch(err => console.error('error connecting', err.stack))

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* SQL Query */
var sql_query = 'SELECT * FROM customers';

app.get('/', function(req, res, next) {
	pool.query(sql_query, (err, data) => {
        console.log(data);
        res.status(200).json(data);
	});
});

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
