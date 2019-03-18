var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
const pool = require('../database/connection');


passport.use('local', new localStrategy({ 
    passReqToCallback : true,
    usernameField: 'username' 
  }, function(req, username, password, done) {
          console.log('called local strategy');
          var findUserQuery = "SELECT * FROM users WHERE name=?";
          pool.query(findUserQuery, [username],(err, data) => {
            console.log(data);
            var user = data;
            if (password == user.password) {
              console.log('User exists in database');
              done(null, user);
            } else {
              done(null, false, {message : "Incorrect username and password"});
            }
      });
         
    }
  ));
  
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
   
passport.deserializeUser(function(id, done) {
    console.log('DeserializeUser');
    var findIdQuery = "SELECT * FROM users where user_id = ?";
    pool.query(findIdQuery, [id],(err, data) => {
    console.log(data);
    var user = data;
    if (user) {
        done(null, user);
    } else {
        done(null, false, {message : "Incorrect username and password"});
        }
    });
});
  
module.exports = passport;
  