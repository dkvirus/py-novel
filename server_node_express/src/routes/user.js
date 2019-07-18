const moment = require('moment');
const request = require('request');
const { wxAppId, wxAppSecret } = require('../../config');

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
        
        // 根据手机号查询
        let sql = 'select id, nickname, avatar_url, password from gysw_user where 1 = 1';
        if (client_type === 'OPENID') {
            sql += ` and username = "${username}" and client_type = "OPENID"`;
        } else {
            sql += ` and username = "${username}" and client_type = "${client_type}"`;
        }

        const result = await dbexec(sql);

        if (result.data.length === 0) {         // 未注册
            res.json({ code: '9999', message: '请先注册', data: {} });
            return;
        }

        result.data = result.data[0];
        if (client_type !== 'OPENID' && result.data.password !== password) {    // 密码输入错误
            res.json({ code: '9999', message: '账号或密码输入错误', data: {} });
            return;
        }

        delete result.data.password;        
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
        result.data = { id: result.data.insertId };
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

    /**
     * 获取微信用户信息
     */
    getWxUserInfo: function (req, res) {
        const { code } = req.query

        try {
            request({
                url: `https://api.weixin.qq.com/sns/jscode2session?appid=${wxAppId}&secret=${wxAppSecret}&js_code=${code}&grant_type=authorization_code`,
            }, async function (err, result) {
                if (err) {
                    res.json({ code: '9999', message: '获取用户信息失败', data: {} });
                } else {
                    const { openid } = JSON.parse(result.body)
                    let userId = ''
                    
                    // 查询用户信息
                    let querySql = 'select id from gysw_user where username = ? and client_type = "OPENID"';
                    const queryResult = await dbexec(querySql, [openid]);

                    // 用户不存在，则新增用户
                    if (queryResult.data.length === 0) {
                        const insertSql = 'insert into gysw_user(username, client_type, create_at) values (?, "OPENID", now())';
                        const insertResult = await dbexec(insertSql, [openid]);
                        userId = insertResult.data.insertId
                    } else {
                        userId = queryResult.data[0].id
                    }

                    res.json({ code: '0000', message: '获取用户信息成功', data: { userId, openId: openid } })
                }
            })
        } catch (e) {
            res.json({ code: '9999', message: e });
        }
    },
}