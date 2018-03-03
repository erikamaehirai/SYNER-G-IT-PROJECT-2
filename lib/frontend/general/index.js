'use strict';

// ========================================================
// Load necessary modules =================================
const express = require('express');
const app = express();

app.use('/', function(req, res){
    res.send('Hello World');
});

module.exports = app;