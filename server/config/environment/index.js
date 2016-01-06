'use strict';

var path = require('path');
var _ = require('lodash');

require('./database');
var all = {

  env: process.env.NODE_ENV || 'development',
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 3000,

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
