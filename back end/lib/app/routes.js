'use strict';

const express = require('express');
const dbconfig = require('../database/database');
const bodyParser = require('body-parser');

const formidable = require('formidable');

const mysql = require('mysql');
const url = require('url');
const str = require('string');
const StringBuilder = require('string-builder')
const app = express();

const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

const appRoot = require('app-root-path');

app.use(bodyParser);

const connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

module.exports = function(app, passport) {

    // ============================================================================
    // =============================== HOME PAGE ==================================
    // ============================================================================
    app.get('/', function(req, res) {
        res.render('../../frontend/authenticate/views/login.ejs', { message: req.flash('loginMessage') });
    });

    // ============================================================================
    // ================================= LOGIN ====================================
    // ============================================================================
    app.get('/login', function(req, res) {
        res.redirect('../../frontend/authenticate/views/login.ejs', { message: req.flash('loginMessage') });
    })

    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/dashboard',
            failureRedirect: '/login',
            failureFlash: true
        }),
        function(req, res) {
            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 4;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        });
    // PROTECTED
    // ============================================================================
    // ============================================================================

    app.get('/dashboard', isLoggedIn, function(req, res) {
        res.render('../../frontend/general/views/dashboard');
    })

    // ============================================================================
    // ================================== LOGOUT ==================================
    // ============================================================================
    app.get('/logout', isLoggedIn, function(req, res) {
        req.session.destroy(function(err) {
            res.redirect('/');
        });
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}