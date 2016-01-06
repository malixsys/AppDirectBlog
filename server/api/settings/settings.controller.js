'use strict';

var _ = require('lodash');
var Settings = require('./settings.model');

function handleError(res, err) {
  return res.status(500).send(err);
}

/**
 * Get list of Settings
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
  Settings.find(function (err, settings) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(settings);
  });
};

/**
 * Get a single Settings
 *
 * @param req
 * @param res
 */
exports.show = function (req, res) {
  Settings.findById(req.params.id, function (err, settings) {
    if (err) {
      return handleError(res, err);
    }
    if (!settings) {
      return res.status(404).end();
    }
    return res.status(200).json(settings);
  });
};

/**
 * Creates a new Settings in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  return exports.update(req, res);
};

/**
 * Updates an existing Settings in the DB.
 *
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  console.log('saving', req.body);
  Settings.update({name: req.body.name}, req.body, {upsert: true}, function (err, settings) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(settings);
  });
};

/**
 * Deletes a Settings from the DB.
 *
 * @param req
 * @param res
 */
exports.destroy = function (req, res) {
  Settings.findById(req.params.id, function (err, settings) {
    if (err) {
      return handleError(res, err);
    }
    if (!settings) {
      return res.status(404).end();
    }
    settings.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).end();
    });
  });
};
