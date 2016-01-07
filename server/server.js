'use strict';
console.time('\tloaded in');
var express = require('express');
var chalk = require('chalk');

console.log('\n------------------------------------------------------------------------------------------------');
console.log('Loading...');

var config = require('./config/environment');

var mongoose = require('mongoose');
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

var exiting = false;
process.on('SIGINT', function() {
  if (exiting) return;
  exiting = true;
  db.connection.close(function() {
    console.log('[DB]','Connection disconnected through app termination');
    process.exit(0);
  });
});

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
    + chalk.yellow('%s')
    + chalk.red(' in ')
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

  var __slice = [].slice;
  var moment = require('moment');
  var log = console.log;
  console.log = console.info = function(){
    var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    var start = '';
    if(args[0].indexOf && args[0].indexOf('[') === 0) {
      start = args.shift();
    }
    var msg = require('util').format.apply(this, args);
    var now = new moment();
    log.call(this, chalk.white('[') + chalk.grey(now.format("YYYY-MMM-DD HH:mm:ss.SSS")) + chalk.white(']'), chalk.yellow(start), msg);
  };

});



module.exports = server;
