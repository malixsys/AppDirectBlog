'use strict';

var path = require('path');

module.exports = {
  ip: process.env.IP || undefined,
  mongo: {
    uri: 'tingodb://'+ path.join(__dirname, '..', '..','data')
  }
};
