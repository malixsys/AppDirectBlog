'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: String,
  content: String,
  appId: Number
});

module.exports = mongoose.model('Post', PostSchema);
