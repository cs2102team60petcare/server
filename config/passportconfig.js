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
                    //REDIRECT to LOGIN PAGE WITH MESSAGE @teojunjie
                    done(null, false, { message: 'Incorrect username or password' })
                }
            });
        }
    })
}))

passport.serializeUser(function(user, done) {
    console.log(user)
    done(null, user.user_id)
})

passport.deserializeUser(function(id, done) {
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