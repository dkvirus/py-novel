const jwt = require('jsonwebtoken');
const { token_secret, token_expiresIn } = require('../../config');

module.exports = {
    /**
     * 认证：获取 token
     */
    getToken: async function (req, res) {
        const { client_type, username = '', password = '' } = req.body;

        // 校验参数
        if (!client_type || !username) {
            return res.json({ code: '9999', message: '用户名和客户端类型字段不能为空' })
        }

        // 校验用户身份是否存在
        let sql = `select id, nickname, avatar_url, password from gysw_user where 1 = 1 and username = "${username}" and client_type = "${client_type}"`;
        const result = await dbexec(sql);

        if (result.data && result.data.length === 0) {     
            return res.json({
                code: '9999',
                message: '获取 token 失败，用户未注册',
            })
        }

        result.data = result.data[0];
        if (result.data.password !== password) {    
            return res.json({
                code: '9999',
                message: '获取 token 失败，用户名或密码错误',
            })
        }

        // jwt 生成 token 返回给用户
        const token = jwt.sign({ username }, token_secret, { expiresIn: token_expiresIn });

        res.json({
            code: '0000',
            message: '认证通过',
            data: {
                token,
                username,
            }
        });
    },
}