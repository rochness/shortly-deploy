var mongoose = require('mongoose');
var userSchema = require('../config').userSchema;
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this['password'], null, null).bind(this)
    .then(function(hash) {
      this['password'] = hash;
    });
  next();
});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this['password'], function(err, isMatch) {
    callback(isMatch);
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
