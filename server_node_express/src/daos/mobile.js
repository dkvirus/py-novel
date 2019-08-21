const mobileUtil = require('../utils/mobile')

module.exports = {
    /**
     * 发送短信验证码
     */
    sendVcode: async function ({ mobile }) {
        const code = String(Math.random().toFixed(6)).substr(2)    // 验证码
        const deadline = 10        // 在 [deadline] 分钟内填写

        try {
            const result = await mobileUtil.sendMobileSms(mobile, [code, deadline])

            if (result.code !== '0000') {
                console.log('[-] daos sendVcode()', result)
                return { code: '9999', message: '发送短信验证码失败', data: {} }
            } 

            console.log('短信验证码：', code)
            await redis.hmsetAsync(`user${mobile}`, { mobile: code })
            return { code: '0000', message: '已发送短信验证码', data: {} }
        } catch (e) {
            console.log('[-] daos > mobile > sendVcode()', e.message)
            return { code: '9999', message: '发送短信验证码失败', data: {} }
        }
    },

    /**
     * 校验短信验证码是否正确
     */
    validateVcode: async function ({ vcode, mobile }) {
        try {
            // 从 redis 中读取短信验证码
            const mobileCode = await redis.hgetAsync(`user${mobile}`, 'mobile')
            if (!mobileCode) return { code: '9999', message: '短信校验超时，请重新发送验证码' }
    
            if (mobileCode !== vcode) {
                return { code: '9999', message: '短信校验码输入错误' }
            }
    
            // 校验成功之后要置空校验码值
            await redis.hmsetAsync(`user${mobile}`, { mobile: '' })
            return { code: '0000', message: '短信校验码验证成功' }
        } catch (e) {
            console.log('[-] daos > mobile > validateVcode()', e.message)
            return { code: '9999', message: '短信校验码验证失败' }
        }
    },
}