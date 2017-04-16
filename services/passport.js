const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local Strategy
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Check if email and password matches the one in database
  // If they are correct, call done with userSchema. Else, call done with false
  User.findOne({email}, function(err, user) {
    if(err) {
      return done(err);
    }
    if(!user) {
      return done(null, false);
    }

    // Compare password
    user.comparePassword(password, function(err, isMatch) {
      if(err) {
        return done(err);
      }

      if(!isMatch) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
});

// options for JwtStrategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authentication'),
  secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // See if userid exists in database
    // if it does call 'done' with that user, else call done without user objest
    User.find(payload.sub, function(err, user) {
      if(err) {
        return done(err, false);
      }

      if(user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
});

// Tell pasport to use the above Strategy
passport.use(jwtLogin);
passport.use(localLogin);
