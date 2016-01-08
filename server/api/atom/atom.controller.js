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

  var RSS = require('rss');


  var posts = require('../renderer/renderer.controller');
  posts.render(function (err, posts) {
    if (err) {
      return handleError(res, err);
    }


    try {
      console.log('[ATOM]', 'Generating feed', RSS);

      var feed = new RSS({
        title: 'Posts',
        feed_url: req.url,
        site_url: req.url.replace('//atom','')
      });

      posts.forEach(function(post) {
        console.log('[ATOM]', 'Generating Item', post);
        feed.item({
          title:  post.title,
          description: post.description,
          guid: post.guid.toString(),
          date: post.date
        });
      });

      console.log('[ATOM]', 'Generating XML');

      var xml = feed.xml();

      res.set('Content-Type', 'text/xml');
      res.status(201).send(xml)

    } catch (ex) {
      return handleError(res, ex);
    }
  });

};

