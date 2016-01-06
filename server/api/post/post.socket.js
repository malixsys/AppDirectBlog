'use strict';

var Post = require('./post.model');

exports.register = function (socket) {

  Post.schema.post('save', function (doc) {
    socket.emit('Post:save', doc);
  });

  Post.schema.post('remove', function (doc) {
    socket.emit('Post:remove', doc);
  });

};
