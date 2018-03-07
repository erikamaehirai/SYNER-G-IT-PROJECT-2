'use strict';

const express = require('express');
const config = require('config');
const app = express();

var port = process.env.port || config.get("http_server.port");

var authenticate = require('./lib/frontend/authenticate');

var md_notfound = function(req, res) {
    res.send('<h1>NOT FOUND</h1>');
}

app.use('/gen', express.static(__dirname + '/gen'));

app.use('/', authenticate);
app.all('*', md_notfound);
app.all('/*', md_notfound);

app.listen(port, function() {
    console.log('Server started on port' + port);
});