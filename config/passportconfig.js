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
      done(null, false, { message: 'Incorrect username or password' })
    } else {
      var user = data.rows[0]
      var storedHash = user.password.toString().trim()
      bcrypt.compare(password, storedHash, function (err, res) {
        if (err) done(err)
        if (res == true) {
          console.log('redirect to home page')
          // REDIRECT to home page with appropriate header change @teojunjie
          done(null, user)
        } else {
          console.log('incorrect username or password')
          done(null, false, { message: 'Incorrect username or password' })
        }
      })
    }
  })
}))

passport.deserializeUser(function (user, done) {
  (async () => {
    var id = user.user_id
    var email = user.email
    const client = await pool.connect()
    try {
      console.log('Deserializing')
      var userData = {}
      await client.query('BEGIN')
      console.log('Sending deserialziing user query')
      const user = await client.query(queries.deserializeUserQuery, [id])
      console.log('Sending deserialziing manager query')

      const manager = await client.query(queries.deserializeManagerQuery, [email])
      Promise.all([user, manager]).then((data) => {
        var isUserData = data[0]
        var isManagerData = data[1]
        
        console.log('Doing promises')
        console.log(isUserData)
        console.log(isManagerData)
        if (isUserData.rows.length > 0) {
          var userID = isUserData.rows[0].user_id
          var userName = isUserData.rows[0].name
          var userEmail = isUserData.rows[0].email
          user['user_id'] = userID
          user['name'] = userName
          user['user'] = true
          user['email'] = userEmail

          pool.query(queries.isOwnerOrCaretakerQuery, [userEmail], (err, data) => {
            console.log('Checking if user is owner or caretaker')
            if (err) {
              console.log('Error after query')
              console.log(err)
              return done(err)
            } else {
              var result = data.rows[0]
              if (result == 1) {
                user['role'] = 'OWNER'
              } else {
                user['role'] = 'CARETAKER'
              }
              console.log('Is owner or caretaker query completed')
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
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      done(e)
    } finally {
      client.release()
    }
  })().catch(e => console.error(e.stack))
})

passport.serializeUser(function (user, done) {
  console.log('Serializing')
  done(null, user)
})
module.exports = passport
