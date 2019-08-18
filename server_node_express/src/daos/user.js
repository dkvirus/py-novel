module.exports = {
    /**
     * 根据 username 查询用户信息
     */
    getUser: async function ({ username, password }) {
        let sql = 'select id, nickname, avatar_url from gysw_user where username = ?'
        if (password) {
            sql += ' and password = ?'
        }
        const result = await dbexec(sql, [username, password])
        result.data = result.data[0] || {}
        return result
    },

    /**
     * 新增一条用户信息
     */
    saveUser: async function ({ clientType, username, password }) {
        const sql = 'insert into gysw_user(username, password, client_type, create_at) values (?, ?, ?, now())'
        const result = await dbexec(sql, [username, password, clientType])
        return result
    },

    /**
     * 修改用户信息
     */
    updateUser: async function ({ nickname, avatarUrl, username, password, gender, address, birth, remark }) {

        let sql = `update gysw_user set username = ${username}`
        if (nickname) {
            sql += `, nickname = "${nickname}"`
        }
        if (avatarUrl) {
            sql += `, avatar_url = "${avatarUrl}"`
        }
        if (gender) {
            sql += `, gender = "${gender}"`
        }
        if (address) {
            sql += `, address = "${address}"`
        }
        if (birth) {
            sql += `, birth = "${birth}"`
        }
        if (remark) {
            sql += `, remark = "${remark}"`
        }
        if (password) {
            sql += `, password = "${password}"`
        }
        sql += `, last_update_at = now() where username = ${username}`

        const result = await dbexec(sql)
        return result
    },
}