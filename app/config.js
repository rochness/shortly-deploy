var mongoose = require('mongoose');
var db = mongoose.connection;
var path = require('path');

var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var crypto = require('crypto');

var userSchema, linkSchema, User, Link;

db.on('error', console.error);

db.once('open', function() {
  // Create your schemas and models here.
  userSchema = new mongoose.Schema({
    username: String,
    password: String
  });

  userSchema.hashPassword = function() {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this['password'], null, null).bind(this)
      .then(function(hash) {
        this['password'] = hash;
      });
  };

  userSchema.comparePassword = function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this['password'], function(err, isMatch) {
      callback(isMatch);
    });
  };

  User = mongoose.model('User', userSchema);
  

  linkSchema = new mongoose.Schema({
    url: String,
    base_url: String,
    code: String,
    title: String,
    visits: Number
  });

  linkSchema.shortenLink = function(attrs, options) {
    var shasum = crypto.createHash('sha1');
    shasum.update(this['url']);
    this['code'] = shasum.digest('hex').slice(0, 5);
  };

  Link = mongoose.model('Link', linkSchema);
});

mongoose.connect('mongodb://127.0.0.1:4568/shortlymongodb');
exports.db = db;

exports.userSchema = userSchema;
exports.linkSchema = linkSchema;

exports.User = User;
exports.Link = Link;

// var db = Bookshelf.initialize({
//   client: 'sqlite3',
//   connection: {
//     host: '127.0.0.1',
//     user: 'your_database_user',
//     password: 'password',
//     database: 'shortlydb',
//     charset: 'utf8',
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   }
// });
