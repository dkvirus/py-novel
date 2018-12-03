const { email_account } = require('../configs/config');

module.exports = {
    /**
     * 发送 email 邮件
     */
    getEmailCode: function (req, res) {
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

        transporter.sendMail(mailOption, function (err, info) {
            if (err) {
                return res.json({ code: '9999', message: err });
            }
            
            if (req.session[`user${userId}`]) {
                req.session[`user${userId}`].email = code;
            } else {
                req.session[`user${userId}`] = { email: code };
            }
 
            res.json({ code: '0000', message: '已发送邮件', data: code });
        });   
    },

    /**
     * 校验验证码输入是否正确
     */
    validateEmail: function (req, res) {
        const { code, userId } = req.body;

        const user = req.sesson[`user${userId}`];
        console.log(user)
        if (!user) return res.json({ code: '9999', message: '邮箱校验超时，请重新发送验证码' });

        if (user.email == code) {
            res.json({ code: '0000', data: true, message: '验证码输入成功' });
        } else {
            res.json({ code: '9999', data: false, message: '验证码输入错误' })
        }
    },
}