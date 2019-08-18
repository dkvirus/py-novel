module.exports = {

    /**
     * 查询搜索历史记录
     */
    getHistList: async function ({ userId, keyword }) {
        let sql = 'select * from gysw_search where user_id = ?'
        if (keyword) {
            sql += ` and keyword = "${keyword}"`
        }
        sql += ' order by last_update_at desc limit 5'
        const result = await dbexec(sql, [userId])
        return result
    },

    /**
     * 查询热门搜索记录
     */
    getHotList: async function () {
        const sql = `select keyword, convert(sum(times), int) as times 
            from gysw_search group by keyword order by times desc limit 6`
        const result = await dbexec(sql)
        return result
    },

    /**
     * 更新搜索记录
     */
    updateSearch: async function ({ times, userId, keyword }) {
        const sql = 'update gysw_search set times = ?, last_update_at = now() where user_id = ? and keyword = ?'
        const result = await dbexec(sql, [times, userId, keyword])
        return result
    },

    /**
     * 新增搜索记录
     */
    saveSearch: async function ({ userId, keyword }) {
        const sql = 'insert into gysw_search (user_id, keyword, last_update_at) values (?, ?, now())'
        const result = await dbexec(sql, [userId, keyword])
        return result
    },

}