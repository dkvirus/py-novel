const jwt = require('jsonwebtoken')
const axios = require('axios')
const userDao = require('../daos/user')
const { wxAppId, wxAppSecret, tokenSecret, tokenExpiresIn } = require('../../config')

module.exports = {
    /**
     * 微信小程序登录接口
     */
    signin: async function (req, res) {
        const { code } = req.body

        if (!code) {
            return res.json({ code: '9999', message: '登录码(code)不能为空', data: {} })
        }

        try {
            const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${wxAppId}&secret=${wxAppSecret}&js_code=${code}&grant_type=authorization_code`
            const response = await axios.get(url)
            // 获取 openid
            const { openid } = response.data

            // 查询用户信息
            const userResult = await userDao.getUser({ username: openid })
            const token = jwt.sign({ username: openid }, tokenSecret, { expiresIn: tokenExpiresIn })
            // 用户不存在，则新增用户
            if (!userResult.data.id) {
                const insertResult = await userDao.saveUser({ clientType: 'OPENID', username: openid, password: openid })
                res.json({
                    code: '0000', 
                    message: '获取用户信息成功', 
                    data: { 
                        userId: insertResult.data.insertId,
                        openId: openid,
                        token, 
                    }, 
                })
            } else {
                const { id, nickname, avatar_url } = userResult.data
                res.json({ 
                    code: '0000', 
                    message: '获取用户信息成功', 
                    data: { 
                        userId: id,
                        openId: openid, 
                        nickname,
                        avatarUrl: avatar_url,
                        token,
                    }, 
                })
            }
        } catch (e) {
            console.log('[-] routes > weapp > signin()', e.message)
            res.json({ code: '9999', message: '获取用户信息失败', data: {} })
        }
    },
}