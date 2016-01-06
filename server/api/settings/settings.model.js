'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Settingschema = new Schema({
  name: String,
  value: Schema.Types.Mixed
});

module.exports = mongoose.model('Settings', Settingschema);
