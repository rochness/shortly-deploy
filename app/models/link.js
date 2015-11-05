var mongoose = require('mongoose');
var linkSchema = require('../config').linkSchema;
var crypto = require('crypto');

linkSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this['url']);
  this['code'] = shasum.digest('hex').slice(0, 5);
  next();
});

var Link = mongoose.model('Link', linkSchema);

module.exports = Link;
