const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs290_meyerni',
    password        : '9123',
    database        : 'cs290_meyerni'
});

module.exports = pool;