/**
 * jwt 校验
 * 
 * 校验一：token 是否存在      'invalid token'，恶意试探，拉黑or其它行为
 * 校验二：token 是否失效      'jwt expired'
 * 
 * 参数：
 * exUrl   不包括的请求，并不是所有请求都要做认证的，如注册请求就不需要认证
 * exMethod    实际场景，GET 获取资源一般不做认证，如电商网站未登录状态可以浏览商品，当需要购买时进行登录操作
 */
const jwt = require('jsonwebtoken')
const { tokenSecret } = require('../../config')

module.exports = function (opt) {
    return function (req, res, next) {
        const { exUrl = [], exMethod = [] } = opt
        const { url, method } = req

        if (~exUrl.findIndex(item => item === url)) {
            return next()
        }

        if (~exMethod.findIndex(item => String(item).toLowerCase() === String(method).toLowerCase())) {
            return next()
        }

        // 从请求头里获取 token
        const authorization = req.headers.authorization
        if (!authorization) {
            res.status(401).json({
                code: '9999',
                message: '认证失败',
                data: {},
            })
            return
        }

        const token = authorization.split(' ').pop()

        // 校验 token 是否有效
        jwt.verify(token, tokenSecret, (error) => {
            if (error) {
                switch (error.message) {
                    case 'invalid token':
                    case 'invalid signature':
                        res.status(401).json({
                            code: '9999',
                            message: '认证失败：token 不合法',
                            data: {},
                        })
                        break
                    case 'jwt expired': 
                        res.status(401).json({
                            code: '9999',
                            message: '认证失败：token 过期',
                            data: {},
                        })
                        break
                    default:
                        res.status(401).json({
                            code: '9999',
                            message: '认证失败',
                            data: {},
                        })
                }
                return 
            }

            // token 通过
            next()
        })
    }
}
