'use strict';

var _ = require('lodash');
var Settings = require('../settings/settings.model');

function handleError(res, err) {
  return res.status(500).send(err);
}

/**
 * Get list of Meta
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
  Settings.findOne({name: 'url'}, function (err, url) {
    if (err) {
      return handleError(res, err);
    }
    if (!url || !url.value) {
      return res.status(201).send({});
    }
    require('request')(url.value, function (error, response, body) {
      if (error) {
        return handleError(res, error);
      }
      try {
        var columns = ['name', 'url', 'description', 'overview', 'blurb', 'free', 'startingPrice'];
        var json = JSON.parse(body);
        return res.status(201).json({
          columns: columns,
          apps: json.map(function (app) {
            return _.pick(app, ['id'].concat(columns));
          })
        });
      } catch (ex) {
        return handleError(res, ex);
      }
      res.setHeader('content-type', 'text/json');
    })
  })
};

