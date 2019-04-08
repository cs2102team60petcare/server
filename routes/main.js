var express = require('express')
var router = express.Router()
var mainController = require('../controllers/mainController')
var loginRoute = require('./login')
var logoutRoute = require('./logout')
var homeRoute = require('./home')
var signUpRoute = require('./signup')
var ownerprofileRoute = require('./ownerprofile')
var managerprofileRoute = require('./managerprofile')
var caretakerprofileRoute = require('./caretakerprofile')
var bidsRoute = require('./bids')
var servicesRoute = require('./services')
var utilities = require('../controllers/utilities')

router.use('/login', loginRoute)
router.use('/home', homeRoute)
router.use('/signup', signUpRoute)
router.use('/logout', logoutRoute)
router.use('/ownerprofile', utilities.loggedInOnly, ownerprofileRoute)
router.use('/managerprofile', utilities.loggedInOnly, managerprofileRoute)
router.use('/caretakerprofile', utilities.loggedInOnly, caretakerprofileRoute)
router.use('/bids', bidsRoute)
router.use('/services', servicesRoute)
router.get('/', mainController.getMainPage)

router.get('/profile', utilities.loggedInOnly, function (req, res, next) {
  res.render('profile')
})

router.get('/redirectToCorrectProfile', function (req, res, next) {
  console.log(req.user)
  var isUser = req.user.user
  if (isUser) {
    var role = req.user.role
    console.log(role)
    if (role == 'CARETAKER') {
      console.log('Is caretaker')
      res.redirect('/caretakerprofile')
    } else if (role == 'OWNER') {
      console.log('Is owner')
      res.redirect('/ownerprofile')
    } else {
      res.redirect('/login')
    }
  } else {
    console.log('Is manager')
    res.redirect('/managerprofile')
  }
})

router.get('/caretakerform', function (req, res, next) {
  res.render('caretakerform')
})

router.get('/serviceForm', function (req, res, next) {
  res.render('serviceform')
})

module.exports = router
