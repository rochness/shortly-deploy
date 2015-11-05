var mongoose = require('mongoose');
var linkSchema = require('../config').linkSchema;
var crypto = require('crypto');

// linkSchema.shortenLink = function(attrs, options) {
//   var shasum = crypto.createHash('sha1');
//   shasum.update(this['url']);
//   this['code'] = shasum.digest('hex').slice(0, 5);
// };

// var Link = mongoose.model('Link', linkSchema);

// module.exports = Link;
