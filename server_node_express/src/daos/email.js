const { emailAccount } = require('../../config')

module.exports = {

    /**
     * 发送 email 邮件
     */
    sendEmailCode: async function ({ email, userId }) {
        const code = String(Math.random().toFixed(6)).substr(2)
        const mailOption = {
            from: emailAccount,                          // 发件人
            to: email,                           // 收件人
            subject: '【公羊阅读】邮箱验证码',             // 纯文本
            html: `<h3 style="display: inline;">欢迎注册 
                <h1 style="display: inline;">公羊阅读</h1>
                ，您本次的注册验证码为：
                <h1 style="display: inline;">${code}</h1>
            </h3>`,
        }

        const result = await sendMail(mailOption)
        // 保存/更新邮箱校验码
        await redis.hmsetAsync(`user${userId}`, { email: code })
        return result
    },

    /**
     * 校验验证码输入是否正确
     */
    validateEcode: async function ({ code, userId }) {
        try {
            // 从 redis 中读取邮箱验证码
            const emailCode = await redis.hgetAsync(`user${userId}`, 'email')
            if (!emailCode) return { code: '9999', message: '邮箱校验超时，请重新发送验证码', data: {} }
            
            if (emailCode !== code) {
                return { code: '9999', message: '邮箱校验码输入错误', data: {} }
            }

            // 校验成功之后要置空校验码值
            await redis.hmsetAsync(`user${userId}`, { email: '' })
            return { code: '0000', message: '邮箱校验码验证成功', data: {} }
        } catch (e) {
            console.log('[-] daos > email > validateEcode()', e.message)
            return { code: '9999', message: 'redis 读取数据失败', data: {} }
        }

    },

    /**
     * 发送用户反馈邮件
     */
    sendFeedbackEmail: async function ({ title, content, userId, email }) {
        const mailOption = {
            from: emailAccount,                          // 发件人
            to: 'me@dkvirus.com',                        // 收件人
            subject: '【公羊阅读】用户反馈',                // 纯文本
            html: `
                <h1>标题：${title}</h1>
                <p>内容：${content}</p>
                <p>反馈人：${userId}</p>   
                <p>反馈人邮箱：${email}</p>
            `,
        }

        const result = await sendMail(mailOption)
        return result        
    },

}