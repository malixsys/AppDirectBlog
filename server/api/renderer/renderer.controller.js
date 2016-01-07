'use strict';

var _ = require('lodash');
var Posts = require('../post/post.model');
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
  var handlebars = require('handlebars').create();
  Posts.find({}, function (err, posts) {
    if (err) {
      return handleError(res, err);
    }
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
          var json = JSON.parse(body);
          posts = posts && posts.map && posts.map(function(p) {
              var post = p.toObject();
              var app = json && json.forEach && json.filter(function(p) {
                  return p.id == post.appId;
                }).shift();
              var template = handlebars.compile(post.content);
              var html = template(app);
              return html;
            });


          return res.status(201).json({posts: posts});
        } catch (ex) {
          return handleError(res, ex);
        }
      })
    })
  })
};

