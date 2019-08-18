const mysql = require('mysql')
const { dbHost, dbUser, dbPassword, dbDatabase } = require('../../config')

const db = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
})

global.db = db

global.dbexec = function (sql, params) {
    return new Promise(function (resolve, reject) {
        db.query(sql, params, (err, result) => {
            if (err) reject({ code: '9999', message: err })
            resolve({ code: '0000', message: '操作成功', data: result})
        })
    })
}



