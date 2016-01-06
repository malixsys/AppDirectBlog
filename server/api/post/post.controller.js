'use strict';

var _ = require('lodash');
var Post = require('./post.model');

function handleError (res, err) {
  return res.status(500).send(err);
}

/**
 * Get list of Post
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
  Post.find(function (err, posts) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(posts);
  });
};


/**
 * Get a single Post
 *
 * @param req
 * @param res
 */
exports.show = function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    if (err) { return handleError(res, err); }
    if (!post) { return res.status(404).end(); }
    return res.status(200).json(post);
  });
};

exports.render = function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    if (err) { return handleError(res, err); }
    if (!post) { return res.status(404).end(); }
    return res.status(200).send('<pre>' +
      JSON.stringify(post) +
      '</pre>');
  });
};

/**
 * Creates a new Post in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  Post.create(req.body, function (err, post) {
    if (err) { return handleError(res, err); }
    return res.status(201).json(post);
  });
};

/**
 * Updates an existing Post in the DB.
 *
 * @param req
 * @param res
 */
exports.update = function (req, res) {
  if (req.body._id) { delete req.body._id; }
  Post.findById(req.params.id, function (err, post) {
    if (err) { return handleError(res, err); }
    if (!post) { return res.status(404).end(); }
    var updated = _.merge(post, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(post);
    });
  });
};

/**
 * Deletes a Post from the DB.
 *
 * @param req
 * @param res
 */
exports.destroy = function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    if (err) { return handleError(res, err); }
    if (!post) { return res.status(404).end(); }
    post.remove(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(204).end();
    });
  });
};
