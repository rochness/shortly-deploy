var mongoose = require('mongoose');
var db = mongoose.connection;
var path = require('path');

var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var crypto = require('crypto');


var userSchema, linkSchema, User, Link;

mongoose.connect('mongodb://127.0.0.1/shortlymongodb');

db.on('error', console.error);

db.once('open', function() {
});

userSchema = new mongoose.Schema({
  username: String,
  password: String
});

linkSchema = new mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});


exports.db = db;

exports.userSchema = userSchema;
exports.linkSchema = linkSchema;

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
