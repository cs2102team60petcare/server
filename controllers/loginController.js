var passport = require('../config/passportconfig')

exports.getLoginPage = function (req, res, next) {
    console.log(req.body)
    res.render('login', { title: 'Login to Petcare' })
}
  
exports.login = passport.authenticate('local', { successRedirect: '/profile',
  failureRedirect: '/home',
  failureFlash: true })
  