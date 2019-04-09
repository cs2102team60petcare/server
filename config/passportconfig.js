var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
const pool = require('../database/connection')
const queries = require('../database/queries')
const bcrypt = require('bcrypt')

passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {
  console.log('Authenticating with passport')
  pool.query(queries.loginQuery, [email], (err, data) => {
    if (err) {
      return done(err)
    } else if (data.rows.length == 0) {
        pool.query(queries.loginManagerQuery, [email], (err, manData) => {
          if (err) {return done(err)}
          else if (manData.rows.length == 0) { done(null, false, {message: 'Incorrect username or password'})}
          else {
            var user = manData.rows[0]
            var storedHash = user.password.toString().trim()
            bcrypt.compare(password, storedHash, function (err, res) {
            if (err) done(err)
            if (res == true) {
              done(null, user)
            } else {
              done(null, false, { message: 'Incorrect username or password' })
            }
            })
          }
        })
    } else {
      var user = data.rows[0]
      var storedHash = user.password.toString().trim()
      bcrypt.compare(password, storedHash, function (err, res) {
        if (err) done(err)
        if (res == true) {
          done(null, user)
        } else {
          done(null, false, { message: 'Incorrect username or password' })
        }
      })
    }
  })
}))

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  (async () => {
    var id = user.user_id
    var email = user.email
    const client = await pool.connect()
    try {
      var userData = {}
      const user = await client.query(queries.deserializeUserQuery, [id])

      const manager = await client.query(queries.deserializeManagerQuery, [email])
      Promise.all([user, manager]).then((data) => {
        var isUserData = data[0]
        var isManagerData = data[1]

        if (isUserData.rows.length > 0) {
          var userID = isUserData.rows[0].user_id
          var userName = isUserData.rows[0].name
          var userEmail = isUserData.rows[0].email
          userData['user_id'] = userID
          userData['name'] = userName
          userData['user'] = true
          userData['email'] = userEmail

          pool.query(queries.isOwnerOrCaretakerQuery, [userEmail], (err, data) => {
            if (err) {
              console.log(err)
              return done(err)
            } else {
              var result = data.rows[0]['?column?']
              console.log(result)
              if (result == 1) {
                userData['role'] = 'OWNER'
              } else {
                userData['role'] = 'CARETAKER'
              }
              done(null, userData)
            }
          })
        } else {
          var managerID = isManagerData.rows[0].manager_id
          var managerEmail = isManagerData.rows[0].email
          var managerUsername = isManagerData.rows[0].username
          var managerPhoneNumber = isManagerData.rows[0].phone

          userData['user_id'] = managerID
          userData['name'] = managerUsername
          userData['email'] = managerEmail
          userData['managerPhoneNumber'] = managerPhoneNumber
          userData['user'] = false
          done(null, userData)
        }
      })
    } catch (e) {
      done(e)
    } finally {
      client.release()
    }
  })().catch(e => console.error(e.stack))
})

module.exports = passport
