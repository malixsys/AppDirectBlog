'use strict';

var express = require('express');
var compression = require('compression');
var path = require('path');
var bodyParser = require('body-parser');

// auth purpose
var session = require('express-session');
var passport = require('passport');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

var config = require('./environment');

module.exports = function (app) {

  var env = config.env;

  app.set('view engine', 'html');
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(compression());
  app.use(function(req, res, next){
    var chalk = require('chalk');
    console.info('[REQ]'
      , chalk.green(req.method)
      , chalk.grey(req.url)
    );
    next();
  });
  app.use(passport.initialize());
  app.use(express.static(path.join(config.root, 'client')));
  app.set('appPath', 'client');

  app.use(session({
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({ mongooseConnection: mongoose.connection })
  }));

  if (env === 'development' || env === 'test') {
    app.use(require('errorhandler')());
  }

};
