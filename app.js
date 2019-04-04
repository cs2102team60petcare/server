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
  // use the dB to store sessions @psyf
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 180000,
    secure: false,
    httpOnly: true // protects against Cross Site Scripting
  },
  name: 'id' // SECURITY NOTE: making it harder to tell we're using express-session
  // courtesy of: https://lockmedown.com/securing-node-js-managing-sessions-express-js/
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

app.post('/ownerprofile/addPet' , function (req, res, next) {
  console.log(req.body)
  res.json({'Updated' : true})
})
app.get('/ownerprofile', function (req, res, next) {
  res.render('ownerprofile', {
    bids: [
      { status: 'successful',
        bid_id: '1',
        money: '20',
        ending: '20/4/2019',
        starting: '12/4/2019'
      },
      { status: 'pending',
        bid_id: '2',
        money: '30',
        ending: '20/4/2019',
        starting: '12/4/2019'

      },
      { status: 'cancelled',
        bid_id: '3',
        money: '10',
        ending: '20/4/2019',
        starting: '12/4/2019'

      },
      { status: 'succesful',
        bid_id: '4',
        money: '50',
        ending: '20/4/2019',
        starting: '12/4/2019'
      }
    ],
    pets: [
      {
        pet_id: 1,
        name: 'wuffles',
        type: 'husky',
        biography: 'easy to take care',
        born: '20/9/16',
        death: 'Alive'
      },
      {
        pet_id: 1,
        name: 'wuffles',
        type: 'husky',
        biography: 'easy to take care',
        born: '20/9/16',
        death: 'Alive'
      },
      {
        pet_id: 1,
        name: 'wuffles',
        type: 'husky',
        biography: 'easy to take care',
        born: '20/9/16',
        death: 'Alive'
      },
      {
        pet_id: 1,
        name: 'wuffles',
        type: 'husky',
        biography: 'easy to take care',
        born: '20/9/16',
        death: 'Alive'
      }
    ],
    tasks: [
      {
        task_id: 0,
        user_id: 3,
        name: 'teojunjie',
        starting: '20/1/18',
        ending: '12/5/19',
        money: '20'
      },
      {
        task_id: 0,
        user_id: 3,
        name: 'teojunjie',
        starting: '20/1/18',
        ending: '12/5/19',
        money: '20'
      },
      {
        task_id: 0,
        user_id: 3,
        name: 'teojunjie',
        starting: '20/1/18',
        ending: '12/5/19',
        money: '20'
      },
      {
        task_id: 0,
        user_id: 3,
        name: 'teojunjie',
        starting: '20/1/18',
        ending: '12/5/19',
        money: '20'
      }
    ]

  })
})

app.get('/caretakerprofile', function (req, res, next) {
  res.render('caretaker', {
    tasks: [
      {
        task_id: 1,
        petname: 'mrwaffles',
        ownername: 'jj',
        starting: '12/3/19',
        ending: '12/3/22'
      }
    ],
    bids: [
      {
        bids_id: 1,
        pet_id: 2,
        owner_id: 3,
        service_id: 2,
        money: 20,
        status: 'Successful',
        starting: '12/3/18',
        ending: '9/2/20'
      }
    ],
    services: [
      {
        service_id: 1,
        caretaker_id: 2,
        minwage: 20,
        status: 'Taken',
        starting: '18/3/14',
        ending: '16/03/18'
      }
    ],
    tasksHistory: [
      {
        task_id: 1,
        petname: 'mrwaffles',
        ownername: 'jj',
        starting: '12/3/19',
        ending: '12/3/22'
      }
    ]
  })
})

app.get('/managerprofile', function (req, res , next) {
  res.render('managerprofile', {
    requests: [
      {
        request_id: 1,
        user_id: 2,
        status: 'solved',
        created: '11/2/19',
        message: 'Please attend urgently'
      },
      {
        request_id: 2,
        user_id: 2,
        status: 'solved',
        created: '11/2/19',
        message: 'Please attend urgently'
      },
      {
        request_id: 3,
        user_id: 2,
        status: 'solved',
        created: '11/2/19',
        message: 'Please attend urgently'
      },
      {
        request_id: 4,
        user_id: 2,
        status: 'solved',
        created: '11/2/19',
        message: 'Please attend urgently'
      }

    ]
  })
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
