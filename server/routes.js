'use strict';

var config = require('./config/environment');

module.exports = function (app) {

  // API
  app.use('/api/metas', require('./api/meta'));
  app.use('/api/settings', require('./api/settings'));
  app.use('/api/posts', require('./api/post'));
  app.use('/api/users', require('./api/user'));

  app.use('/api/render', require('./api/renderer'));

  // Auth
  app.use('/auth', require('./auth'));

  app.route('/:url(api|app|bower_components|assets)/*')
    .get(function (req, res) {
      res.status(404).end();
    });

  app.route('/*')
    .get(function (req, res) {
      res.sendFile(
        app.get('appPath') + '/index.html',
        { root: config.root }
      );
    });

};
