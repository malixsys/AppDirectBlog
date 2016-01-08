'use strict';

var _ = require('lodash');
var Posts = require('../post/post.model');
var Settings = require('../settings/settings.model');

function handleError(res, err) {
  console.error('[RENDER]', 'ERROR', err);
  return res.status(500).send(err);
}

exports.render = function (cb) {
  var handlebars = require('handlebars').create();
  Posts.find({}, function (err, posts) {
    if (err) {
      return cb(err);
    }
    console.log('[RENDER]', 'Found', posts && posts.length, 'post(s)');

    Settings.findOne({name: 'url'}, function (err, url) {
      if (err) {
        return cb(err);
      }
      if (!url || !url.value) {
        return res.status(201).send({});
      }

      console.log('[RENDER]', 'Getting posts from', url.value);

      require('request')(url.value, function (error, response, body) {
        if (error) {
          return cb(error);
        }
        try {
          var json = JSON.parse(body);
          console.log('[RENDER]', 'Found', json && json.length, 'app(s)');
          posts = posts && posts.map && posts.map(function (p) {
              var post = p.toObject();
              var app = json && json.forEach && json.filter(function (p) {
                  return p.id == post.appId;
                }).shift();

              console.log('[RENDER]', 'Found', 'app', app && app.url);
              try {
                var template = handlebars.compile(post.content);
                var html = template(app);
                return {
                  description: html,
                  guid: post._id,
                  title: post.title,
                  date: post.updated,
                  url: app.url
                };
              } catch (ex) {
                console.error('[RENDER]', 'ERROR', ex);
                return 'ERROR';
              }

            });


          return cb(null, posts);
        } catch (ex) {
          return cb(ex);
        }
      })
    })
  });

};
/**
 * Get list of Meta
 *
 * @param req
 * @param res
 */
exports.index = function (req, res) {
  exports.render(function (err, posts) {
    if (err) {
      return handleError(res, err);
    }
    res.status(201).json({posts: posts})
  })
};

