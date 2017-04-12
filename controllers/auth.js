const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(userModel) {
  const timestamp = new Date().getTime();
  return jwt.encode({sub: userModel.id, iat: timestamp}, config.secret);
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password) {
    return res.status(422).send({error: "You must provide email and password"});
  }

  // Find if a user exists with the email
  User.findOne({email: email}, function(err, existingUser) {
    if(err) {
      return next(err);
    }

    if(existingUser) {
      return res.status(422).send({error: "Email is in use"});
    }

    // If a user does not exist, create a new one
    const newUser = new User({
      email: email,
      password: password
    });

    newUser.save(function(err) {
      if(err) {
        return next(err);
      }

      res.json({token: tokenForUser(newUser)});
    });
  });
}

exports.signin = function(req, res, next) {
  res.send({token: tokenForUser(req.user)});
}
