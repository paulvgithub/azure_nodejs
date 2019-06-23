

var express = require('express');

var app = express();

var path = require('path');
var bodyParser = require('body-parser');
//var dotenv = require('dotenv');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var index = require('./routes');


module.exports = app;


