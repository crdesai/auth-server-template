const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String
});

// On save Hook
// Before saving password, encrypt it
userSchema.pre('save', function(next) {
  // get access to user model
  const user = this;

  // generate a salt asynchronously
  bcrypt.genSalt(10, function(err, salt) {
    if(err) {return next(err);}

    // encrypt our password using salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {

      // overwrite password with encrypted one
      user.password = hash;

      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
