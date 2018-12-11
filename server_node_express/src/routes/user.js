module.exports = {
    /**
     * 查询用户信息 
     */
    getUserInfo: async function (req, res) {
        const { client_type, username, password } = req.query;
        
        // 校验参数
        if (!client_type || !username) {
            return res.json({ code: '9999', message: '用户名和客户端类型字段不能为空' })
        }
        
        let sql = 'select id, nickname from gysw_user where 1 = 1';
        if (client_type === 'OPENID') {
            sql += ` and username = "${username}" and client_type = "OPENID"`;
        } else {
            sql += ` and username = "${username}" and password = "${password}" and client_type = "${client_type}"`;
        }

        const result = await dbexec(sql);
        result.data = result.data[0];
        
        res.json(result);
    },

    /**
     * 保存用户信息，只支持用手机号注册
     */
    addUserInfo: async function (req, res) {
        const sql = `insert into gysw_user(username, password, client_type) values (?, ?, ?)`;
        const { client_type, username, password = '' } = req.body;
        const result = await dbexec(sql, [username, password, client_type]);
        result.data = result.data = { id: result.data.insertId };
        res.json(result);
    },

    /**
     * 校验手机号是否已注册
     */
    validateUser: async function (req, res) {
        const sql = 'select * from gysw_user where username = ?';
        const { username } = req.query;
        const result = await dbexec(sql, username);
        res.json(result);
    },
}