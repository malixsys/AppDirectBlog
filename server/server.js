'use strict';
console.time('\tloaded in');
var express = require('express');
var chalk = require('chalk');

console.log('\n------------------------------------------------------------------------------------------------');
console.log('Loading...');

var config = require('./config/environment');

var mongoose = require('mongoose');
mongoose.connect(config.mongo.uri, config.mongo.options);

express.static.mime.define({'application/font-woff': ['woff']});

var app = express();
var server = require('http').createServer(app);
var socket = require('socket.io')(server, { serveClient: true });
require('./config/sockets.js')(socket);

require('./config/express')(app);
require('./routes')(app);

server.listen(config.port, config.ip, function () {

  console.log(
    chalk.white('\tExpress server') +
    chalk.red(' listening on port ')
    + chalk.yellow('%d')
    + chalk.red(', in ')
    + chalk.yellow('%s')
    + chalk.red(' mode.'),
    config.port,
    app.get('env')
  );

  if (config.env === 'development') {
    require('ripe').ready();
  }

  console.timeEnd('\tloaded in');
  console.log('------------------------------------------------------------------------------------------------\n');
});

module.exports = server;
