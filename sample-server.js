'use strict';

var open = require('open');
var express = require('express');

var app = express();
app.use(require('connect-livereload')());

app.use('/', express.static('node_modules'));
app.use('/', express.static('sample'));
app.use('/', express.static('dist'));

var port = 8080;
app.listen(port, function () {
  console.log('Server listening on : http://localhost:' + port);
  open('http://localhost:' + port);
});
