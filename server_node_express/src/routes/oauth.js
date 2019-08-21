const jwt = require('jsonwebtoken')
const userDao = require('../daos/user')
const mobileDao = require('../daos/mobile')
const { tokenSecret, tokenExpiresIn } = require('../../config')

module.exports = {
    /**
     * 拿token
     */
    getToken: async function (req, res) {
        const { userId } = req.query

        if (!userId) {
            return res.json({ code: '9999', message: '用户名ID(userId)不能为空', data: {} })
        }

        try {
            const result = await userDao.getUser({ userId })
            const username = result.data.username
            const token = jwt.sign({ username }, tokenSecret, { expiresIn: tokenExpiresIn })
            res.json({ code: '0000', message: '获取token成功', data: { token } })
        } catch (e) {
            console.log('[-] routes getToken()', e.message)
            res.json({ code: '9999', message: '获取token失败', data: {} })
        }
    },

    /**
     * 登录，查询用户
     */
    signin: async function (req, res) {
        const { username, password } = req.body

        // 校验参数必填
        if (!username || !password) {
            return res.json({ code: '9999', message: '用户名和密码不能为空', data: {} })
        }

        try {
            // 根据手机号和密码查询用户信息
            const result = await userDao.getUser({ username, password })

            if (result.data.id) {
                // jwt 生成 token 返回给用户
                const token = jwt.sign({ username }, tokenSecret, { expiresIn: tokenExpiresIn })
                const { id, nickname, avatar_url } = result.data
                return res.json({
                    code: '0000',
                    message: '登录成功',
                    data: {
                        userId: id,
                        nickname,
                        avatarUrl: avatar_url,
                        token,
                    },
                })
            }

            res.json({ code: '9999', message: '用户名或密码错误', data: {} }) 
        } catch (e) {
            console.log('[-] routes signin()', e.message)
            res.json({ code: '9999', message: '登录失败', data: {} })
        }
    },

    /**
     * 注册，新增用户
     */
    signup: async function (req, res) {
        const { username, password, vcode } = req.body

        // 校验参数是否必填以及格式是否正确
        if (!username) {
            return res.json({ code: '9999', message: '手机号不能为空', data: {} })
        } else if (String(username).length !== 11 || !(/^1[34578]\d{9}$/.test(String(username)))) {
            return res.json({ code: '9999', message: '手机号格式不正确', data: {} })
        }

        if (!password) {
            return res.json({ code: '9999', message: '密码不能为空', data: {} })
        }

        if (!vcode) {
            return res.json({ code: '9999', message: '短信验证码不能为空', data: {} })
        }
        
        try {
            // 根据手机号去用户表拿数据，手机号必须没有注册过的，才能进行注册
            const result = await userDao.getUser({ username })
            if (result.data.id) {
                return res.json({ code: '9999', message: '手机号已注册，请直接登录' })
            }

            // 校验验证码是否正确
            const vcodeResult = await mobileDao.validateVcode({ vcode, mobile: username })
            // 验证码不正确，返回提示文字
            if (vcodeResult.code !== '0000') {
                return res.json(vcodeResult)
            }

            // 验证码正确，新增一条用户信息
            const clientType = 'MOBILE'
            const userResult = await userDao.saveUser({ username, password, clientType })
            res.json({
                code: '0000',
                message: '注册成功',
                data: {
                    userId: userResult.data.insertId,
                },
            })
        } catch (e) {
            console.log('[-] routes signup()', e.message)
            res.json({ code: '9999', message: '注册失败', data: {} })
        }
    },

    /**
     * 重置密码，修改用户
     */
    resetpw: async function (req, res) {
        const { username, password, vcode } = req.body

        // 校验参数是否必填以及格式是否正确
        if (!username) {
            return res.json({ code: '9999', message: '手机号不能为空', data: {} })
        } else if (String(username).length !== 11 || !(/^1[34578]\d{9}$/.test(String(username)))) {
            return res.json({ code: '9999', message: '手机号格式不正确', data: {} })
        }

        if (!password) {
            return res.json({ code: '9999', message: '密码不能为空', data: {} })
        }

        if (!vcode) {
            return res.json({ code: '9999', message: '短信验证码不能为空', data: {} })
        }

        try {
            // 根据手机号去用户表拿数据，重置密码要求手机号必须已经注册过，才能改密码
            const result = await userDao.getUser({ username })
            if (!result.data.id) {
                return res.json({ code: '9999', message: '手机号未注册，请先注册新用户' })
            }

            // 校验验证码是否正确
            const vcodeResult = await mobileDao.validateVcode({ vcode, mobile: username })
            // 验证码不正确，返回提示文字
            if (vcodeResult.code !== '0000') {
                return res.json(vcodeResult)
            }

            // 验证码输入正确，修改用户密码
            await userDao.updateUser({ username, password })
            res.json({ code: '0000', message: '重置密码成功', data: {} })
        } catch (e) {
            console.log('[-] routes resetpw()', e.message)
            res.json({ code: '9999', message: '重置密码失败', data: {} })
        }
    },

    /**
     * 发送短信验证码
     * type: 'signup' | 'resetpw'
     */
    sendVcode: async function (req, res) {
        const { username, type } = req.body

        // 校验参数必填
        if (!username) {
            return res.json({ code: '9999', message: '手机号必填', data: {} })
        } else if (String(username).length !== 11 || !(/^1[34578]\d{9}$/.test(String(username)))) {
            return res.json({ code: '9999', message: '手机号格式不正确', data: {} })
        }

        if (!type) {
            return res.json({ code: '9999', message: '功能类型不能为空' })
        }

        try {
            // 根据手机号去用户表拿数据
            const result = await userDao.getUser({ username })
            
            // type=“signup” 注册时要求之前没有往用户表插过手机号
            if (type === 'signup' && result.data.id) {
                return res.json({ code: '9999', message: '手机号已注册，请直接登录' })
            }
            
            // type="resetpw" 重置密码要求之前已经往用户表插过手机号
            if (type === 'resetpw' && !result.data.id) {
                return res.json({ code: '9999', message: '手机号未注册，请先注册新用户' })
            }

            // 发送短信验证码，返回响应
            const vcodeResult =  await mobileDao.sendVcode({ mobile: username })
            res.json(vcodeResult)
        } catch (e) {
            console.log('[-] routes sendVcode()', e.message)
            res.json({ code: '9999', message: '发送验证码失败', data: {} })
        }
    },
}