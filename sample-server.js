'use strict';

var open = require('open');
var express = require('express');

var app = express();
app.use(require('connect-livereload')());

app.use('/vendors', express.static('vendors'));
app.use('/dist', express.static('dist'));
app.use('/', express.static('sample'));

var port = 8080;
app.listen(port, function () {
  console.log('Server listening on : http://localhost:' + port);
  open('http://localhost:' + port);
});
