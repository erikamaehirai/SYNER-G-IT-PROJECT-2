'use strict';

const config = require('config');

module.exports = {
    connection: {
        host: config.get('mysql.host'),
        user: config.get('mysql.user'),
        password: config.get('mysql.password')
    },
    database: config.get('mysql.database'),
    user_table: 'user_credentials'
};