var passport = require('passport')
var localStrategy = require('passport-local').Strategy
const pool = require('../database/connection')
const queries = require('../database/queries')
const bcrypt = require('bcrypt')

passport.use('local', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    console.log('Authenticating with passport')
    pool.query(queries.loginQuery, [email], (err, data) => {
        if (err) {
            return done(err)
        } else if (data.rows.length == 0) {
            done(null, false, { message: 'Incorrect username or password' })
        } else {
            var user = data.rows[0] 
            var storedHash = user.password.toString().trim()
            bcrypt.compare(password, storedHash, function(err, res) {
                if (res == true) {
                    console.log('redirect to home page')
                    //REDIRECT to home page with appropriate header change @teojunjie
                    done(null, user)
                } else {
                    console.log('incorrect username or password')
                    done(null, false, { message: 'Incorrect username or password' })
                }
            });
        }
    })
}))

passport.serializeUser(function(user, done) {
    console.log('Serializing')
    done(null, user.user_id)
})

passport.deserializeUser(function(id, done) {
    console.log('Deserializing')
    pool.query(queries.deserializeQuery, [id], (err, data) => {
        if (err) {
            return done(err)
        } else {
            var user = data.rows[0]
            return done(null, user)
        }
    })
})

module.exports = passport