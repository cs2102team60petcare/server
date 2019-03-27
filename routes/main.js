var express = require('express')
var router = express.Router()
var mainController = require('../controllers/mainController')
var loginRoute = require('./login')
var logoutRoute = require('./logout')
var homeRoute = require('./home')
var signUpRoute = require('./signup')

router.use('/login', loginRoute)
router.use('/home', homeRoute)
router.use('/signup', signUpRoute)
router.use('/logout', logoutRoute)

const loggedInOnly = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect("/login");
};

router.get('/', mainController.getMainPage)

router.get('/profile' , loggedInOnly, function(req, res, next) {
    res.render('profile')
})
module.exports = router