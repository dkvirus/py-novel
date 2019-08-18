/**
 * 忽略 favicon.ico 请求
 */

module.exports = function () {
    return function (req, res, next) {
        if (req.originalUrl === '/favicon.ico') { 
            res.sendStatus(204) 
        } else {
            next()
        }
    }
}