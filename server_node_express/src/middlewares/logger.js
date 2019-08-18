/**
 * 日志中间件。
 * 打印：
 * 【请求时间】【请求方法】【请求地址】
 * 【请求参数】
 */

const chalk = require('chalk')
const moment = require('moment')

module.exports = function () {
    return function (req, res, next) {
        const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS')
        console.log(`
Timer: ${chalk.green(now)} ——【${chalk.green(req.method)}  ${chalk.green(req.originalUrl)}】
请求参数(req.query)：${chalk.green(JSON.stringify(req.query))}   
请求参数(req.body)：${chalk.green(JSON.stringify(req.body))}
        `)
        next()
    }
}