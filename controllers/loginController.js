const url = require('url')
var passport = require('../config/passportconfig')

exports.getLoginPage = function (req, res, next) {
  res.render('login', { title: 'Login to Petcare' })
}

exports.login = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) return next(err)
    if (!user) {
      return res.redirect('/login')
    }
    req.login(user, function (err) {
      if (err) return next(err)
      return res.redirect(url.format({
        pathname: '/redirectToCorrectProfile'
      }))
    })
  })(req, res, next)
}
