const { email_account } = require('../../config');

module.exports = {
    /**
     * 发送 email 邮件
     */
    sendEmailCode: function (req, res) {
        const { email, userId } = req.body;           // 收件人地址
        
        const code = String(Math.random().toFixed(6)).substr(2);
        const mailOption={
            from: email_account,                          // 发件人
            to: email,                           // 收件人
            subject: '【公羊阅读】邮箱验证码',             // 纯文本
            html: `<h3 style="display: inline;">欢迎注册 
                <h1 style="display: inline;">公羊阅读</h1>
                ，您本次的注册验证码为：
                <h1 style="display: inline;">${code}</h1>
            </h3>`,
        };

        try {
            transporter.sendMail(mailOption, async function (err, info) {
                if (err) {
                    return res.json({ code: '9999', message: err });
                }
                
                // 保存/更新邮箱校验码
                await redis.hmsetAsync(`user${userId}`, { email: code });
        
                res.json({ code: '0000', message: '已发送邮件', data: code });
            });   
        } catch (e) {
            res.json({ code: '9999', message: e });
        }
        
    },

    /**
     * 校验验证码输入是否正确
     */
    validateEmailCode: async function (req, res) {
        const { code, userId } = req.body;

        try {
            // 从 redis 中读取邮箱验证码
            const emailCode = await redis.hgetAsync(`user${userId}`, 'email');
    
            if (!emailCode) return res.json({ code: '9999', message: '邮箱校验超时，请重新发送验证码' });
    
            if (emailCode !== code) {
                return res.json({ code: '9999', message: '邮箱校验码输入错误' })
            }
    
            // 校验成功之后要置空校验码值
            await redis.hmsetAsync(`user${userId}`, { email: '' });
            res.json({ code: '0000', message: '邮箱校验码验证成功' });
        } catch (e) {
            res.json({ code: '9999', message: 'redis 读取数据失败' });
        }
        
    },
}