var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config').db;
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find(function(err, links) {
    if (err) {
      console.log('Error in retrieving links: ', err);
    } else {
      res.send(200, links);
    }
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url: uri }, function(err, link) {
    if (err) {
      console.log('Error in retrieving link: ', err);
    } else if (link) {
      res.send(200, link);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        newLink.save(function(err, newLink) {
          if (err) {
            console.log('Error in saving link: ', err);
          } else {
            res.send(200, newLink);
          }
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
    if (err) {
      console.log('Error in retrieving user: ', err);
    } else if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
    if (err) {
      console.log('Error in retrieving user: ', err);
    } else if (!user) {
      res.redirect('/login');
      // sign up
      var newUser = new User({
        username: username,
        password: password
      });

      newUser.hashPassword();
      newUser.save(function(err, newUser) {
        if (err) {
          console.log('Error in saving new user: ', err);
        } else {
          util.createSession(req, res, newUser);
        }
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }, function(err, link) {
    if (err) {
      console.log('Link not found: ', err);
    } else if (!link) {
      res.redirect('/');
    } else {
      link['visits'] = link['visits'] + 1;
      link.save(function(err) {
        if (err) {
          console.log('Error updating link visit count: ', err);
        } else {
          return res.redirect(link['url']);
        }
      });
    }
  });
};
