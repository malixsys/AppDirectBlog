'use strict';

process.env.NODE_ENV = 'development';

var path = require('path');
var _ = require('lodash');
var DEFAULT_PORT = 3000;
var PORT = process.env.PORT || DEFAULT_PORT;

require('./database');
var all = {

  env: 'development',
  root: path.normalize(__dirname + '/../../..'),
  port: PORT,

  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  secrets: {
    session: process.env.SESSION_SECRET || '19efbab5-551a-4272-a8be-3adc699168fzzw@'
  }
};

module.exports = _.merge(all, require('./' + all.env + '.js'));
