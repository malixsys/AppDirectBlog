'use strict';

module.exports = {
  ip: process.env.IP || undefined,
  mongo: {
    uri: 'tingodb://'+ path.join(__dirname, '..', '..','data')
  }
};
