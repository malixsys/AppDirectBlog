'use strict';

var path = require('path');

module.exports = {
  mongo: {
    uri: 'tingodb://'+ path.join(__dirname, '..', '..','data')
    //uri: 'mongodb://localhost/appdirectblog-dev'
  }
};
