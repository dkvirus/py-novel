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
        }

        const result = await dbexec(sql);
        res.json(result);
    },

    /**
     * 保存用户信息
     */
    addUserInfo: async function (req, res) {
        const sql = `insert into gysw_user(username, password, client_type) values (?, ?, ?)`;
        const { client_type, username, password = '' } = req.body;
        const result = await dbexec(sql, [username, password, client_type]);
        res.json(result);
    },

    /**
     * 修改用户信息
     */
    editUserInfo: async function (req, res) {
        // const sql = `insert into gysw_user(username, password, client_type, nickname, avatar_url,
        //     birth, gender, address, email, remark) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    },
}