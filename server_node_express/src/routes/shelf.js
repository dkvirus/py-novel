module.exports = {

    /**
     * 往书架中添加小说
     */
    addShelf: async function (req, res) {
        const { user_id, author_name, book_name, 
            book_desc, book_cover_url, recent_chapter_url } = req.body;
        const sql = `insert into gysw_shelf (user_id, author_name, book_name, 
            book_desc, book_cover_url, recent_chapter_url) values (?, ?, ?, ?, ?, ?)`;

        const result = await dbexec(sql, [user_id, author_name, book_name, book_desc, book_cover_url, recent_chapter_url]);
        res.json(result);
    },

    /**
     * 删除书架中的小说
     */
    removeShelf: async function (req, res) {
        const sql = 'delete from gysw_shelf where id = ?';
        const result = await dbexec(sql, req.params.id)
        res.json(result);
    },

    /**
     * 更新书架小说最新阅读章节
     */
    editShelf: async function (req, res){
        const sql = 'update gysw_shelf set recent_chapter_url = ? where id = ?';
        const { recent_chapter_url } = req.body;
        const { id } = req.params;
        const result = await dbexec(sql, [recent_chapter_url, id]);
        res.json(result);
    },

    /**
     * 查询书架列表
     */
    getShelf: async function (req, res) {
        const { user_id, book_name = '', author_name = '' } = req.query;
        let sql = 'select * from gysw_shelf where 1 = 1';

        if (user_id) {
            sql += ' and user_id = ' + user_id;
        }
        if (book_name) {
            sql += ` and book_name = "${book_name}"`;
        }
        if (author_name) {
            sql += ` and author_name = "${author_name}"`;
        }
        
        const result = await dbexec(sql);
        res.json(result);
    },
}