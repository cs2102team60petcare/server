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
router.use('/ownerprofile', ownerprofileRoute)
router.use('/managerprofile', managerprofileRoute)
router.use('/caretakerprofile', caretakerprofileRoute)
router.use('/bids', bidsRoute)
router.use('/services', servicesRoute)
router.get('/', mainController.getMainPage)

router.get('/profile', utilities.loggedInOnly, function (req, res, next) {
  res.render('profile')
})

router.get('/caretakerform', function (req, res, next) {
  res.render('caretakerform')
})

router.get('/serviceForm', function(req, res, next){
  res.render('services');
})



module.exports = router
