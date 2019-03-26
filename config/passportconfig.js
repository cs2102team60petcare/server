var passport = require('passport')
var localStrategy = require('passport-local').Strategy
const pool = require('../database/connection')

passport.use('local', new localStrategy({
  passReqToCallback: true
}, function (req, email, password, done) {
  console.log(req.body)
  console.log('called local strategy')
  console.log(email + ' ' + password)
  var findUserQuery = "select * from users where email = 'teojunjie@gmail.com'"
  pool.query(findUserQuery, (err, data) => {
    if (err) {
      return done(err)
    }
    var user = data.rows[0]
    console.log(user)
    console.log()
    var userPasswordString = user.password.toString().trim()
    var passwordString = password.toString().trim()

    if (passwordString === userPasswordString) {
      console.log('User exists in database')
      done(null, user)
    } else {
      console.log('Username and password does not match')
      done(null, false, { message: 'Incorrect username and-or password' })
    }
  })
}
))

passport.serializeUser(function (user, done) {
  done(null, user.user_id)
})

passport.deserializeUser(function (id, done) {
  console.log('DeserializeUser')
  var findIdQuery = "SELECT * FROM users where user_id = '2'"
  pool.query(findIdQuery, (err, data) => {
    if (err) {
      return done(err)
    }
    var user = data.rows[0]
    console.log(user)
    if (user) {
      done(null, user)
    } else {
      done(null, false, { message: 'Incorrect username and password' })
    }
  })
})

module.exports = passport
