'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./atom.controller.js');

router.get('/', controller.index);

module.exports = router;
