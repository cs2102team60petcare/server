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
                    //REDIRECT to home page with appropriate header change @teojunjie
                    done(null, user)
                } else {
                    done(null, false, { message: 'Incorrect username or password' })
                }
            });
        }
    })
}))

passport.serializeUser(function(user, done) {
    done(null, user.email)
})

passport.deserializeUser(function(email, done) {
    pool.query(queries.loginQuery, [email], (err, data) => {
        if (err) {
            return done(err)
        } else {
            return done(null, email)
        }
    })
})

module.exports = passport