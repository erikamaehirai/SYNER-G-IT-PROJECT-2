'use strict';

// ========================================================
// Load necessary modules =================================
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const dbconfig = require('../database/database');
const connection = mysql.createConnection(dbconfig.connection);

/* Secret Salt for encryption and decryption */
var salt = bcrypt.genSaltSync(10);

// Connect to database
connection.query('USE ' + dbconfig.database);

module.exports = function(passport){
    // Serialize the user that is logging in
    passport.serializeUser(function(user, done){
        done(null, user.credential_id);
    });

    // Deserialize the user incase of new user loging in
    passport.deserializeUser(function(id, done){
        connection.query("SELECT * FROM user_credentials WHERE credential_id = ?;", [id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // Local network login authentication 
    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done){
            /* Method for creating an encrypted password
            var hashedPassword = bcrypt.hashSync(passwordField, salt);
            */
            
            // Validate if the user exist. Hashes the password and checks for equality
            connection.query("SELECT * FROM user_credentials WHERE username = ?;", [username], function(err, rows){
                // Error Catching
                if(err){
                    return done(err);
                }

                // No username detected
                if(!rows.length){
                    return done(null, false, req.flash('loginMessage', 'Invalid Credentials!'));
                }

                // Wrong ecrypted password
                if(!bcrypt.compareSync(password, rows[0].password)){
                    return done(null, false, req.flash('loginMessage', 'Invalid Credentials!'));
                }

                // Valid user found
                return done(null, rows[0]);
            });
        })
    );
}