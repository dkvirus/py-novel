const mysql = require('mysql');
const { db_host, db_user, db_password, db_database } = require('../../config');

const db = mysql.createPool ({
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_database,
});

// db.connect((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log('Connected to database');
// });

global.db = db;

global.dbexec = function (sql, params) {
    return new this.Promise(function (resolve, reject) {
        db.query(sql, params, (err, result) => {
            if (err) reject({ code: '9999', message: err });
            resolve({ code: '0000', message: '操作成功', data: result});
        });
    });
}



