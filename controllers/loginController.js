var passport = require('../config/passportconfig')

exports.getLoginPage = function(req, res, next) {
    res.render('login', { title: 'Login to Petcare' })
}

exports.login = passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
})