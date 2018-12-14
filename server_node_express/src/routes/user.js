const moment = require('moment');

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
        
        let sql = 'select id, nickname, avatar_url from gysw_user where 1 = 1';
        if (client_type === 'OPENID') {
            sql += ` and username = "${username}" and client_type = "OPENID"`;
        } else {
            sql += ` and username = "${username}" and password = "${password}" and client_type = "${client_type}"`;
        }

        const result = await dbexec(sql);
        result.data = result.data[0] || {};
        
        res.json(result);
    },

    /**
     * 保存用户信息，只支持用手机号注册
     */
    addUserInfo: async function (req, res) {
        const sql = 'insert into gysw_user(username, password, client_type, create_at) values (?, ?, ?, ?)';
        const { client_type, username, password = '' } = req.body;
        const now = new Date();
        const result = await dbexec(sql, [username, password, client_type, now]);
        result.data = result.data = { id: result.data.insertId };
        res.json(result);
    },

    /**
     * 更新用户信息
     */
    editUserInfo: async function (req, res) {
        const { nickname, avatar_url, gender, address, birth, remark } = req.body;
        const { id } = req.params;

        let sql = `update gysw_user set id = ${id}`;
        if (nickname) {
            sql += `, nickname = "${nickname}"`;
        }
        if (avatar_url) {
            sql += `, avatar_url = "${avatar_url}"`;
        }
        if (gender) {
            sql += `, gender = "${gender}"`;
        }
        if (address) {
            sql += `, address = "${address}"`;
        }
        if (birth) {
            sql += `, birth = "${birth}"`;
        }
        if (remark) {
            sql += `, remark = "${remark}"`;
        }
        const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS');
        sql += `, last_update_at = "${now}" where id = ${id}`;

        const result = await dbexec(sql);
        res.json(result);
    },

    /**
     * 校验手机号是否已注册
     */
    validateUser: async function (req, res) {
        const sql = 'select * from gysw_user where username = ?';
        const { username } = req.query;
        const result = await dbexec(sql, username);
        result.data = result.data[0] || {};
        res.json(result);
    },
}