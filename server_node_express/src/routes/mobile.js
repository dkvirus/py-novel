const mobileUtil = require('../utils/mobile');

module.exports = {
    /**
     * 发送短信验证码 
     */
    sendMobileCode: async function (req, res) {
        const { mobile } = req.body;

        const code = String(Math.random().toFixed(6)).substr(2);    // 验证码
        const deadline = 10;        // 在 [deadline] 分钟内填写
        const result = await mobileUtil.sendMobileSms(mobile, [code, deadline]);
    
        if (result.code === '0000') {
            console.log('短信验证码：', code);
            await redis.hmsetAsync(`user${mobile}`, { mobile: code });
        }

        res.json(result);
    },

    /**
     * 校验短信验证码 
     */
    validateMobileCode: async function (req, res) {
        const { code, mobile } = req.body;
        
        try {
            // 从 redis 中读取短信验证码
            const mobileCode = await redis.hgetAsync(`user${mobile}`, 'mobile');

            if (!mobileCode) return res.json({ code: '9999', message: '短信校验超时，请重新发送验证码' });
    
            if (mobileCode !== code) {
                return res.json({ code: '9999', message: '短信校验码输入错误' })
            }
    
            // 校验成功之后要置空校验码值
            await redis.hmsetAsync(`user${mobile}`, { mobile: '' });
            res.json({ code: '0000', message: '短信校验码验证成功' });

        } catch (e) {
            res.json({ code: '9999', message: 'redis 读取数据失败' });
        }
    },
}