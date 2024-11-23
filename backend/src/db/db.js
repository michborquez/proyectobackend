const mysql = require('mysql');

const dbConfig = {
    host: 'localhost',
    user: 'something',
    password: '1h!7Qn1EQoC6$6z1SLkK',
    database: 'mumi_merch'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to DB: ', err);
        return;
    }
    console.log('Connected to DB');
});


module.exports = connection;