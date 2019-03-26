var express = require('express')
var router = express.Router()
var mainController = require('../controllers/mainController')
var loginRoute = require('./login')
var homeRoute = require('./home')
var signUpRoute = require('./signup')

router.use('/login', loginRoute)
router.use('/home', homeRoute)
router.use('/signup', signUpRoute)

router.get('/', mainController.getMainPage)

module.exports = router