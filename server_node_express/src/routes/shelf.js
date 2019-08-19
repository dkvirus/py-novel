const shelfDao = require('../daos/shelf')

module.exports = {

    /**
     * 往书架中添加小说
     * 小说介绍页面，添加到书架
     */
    addShelf: async function (req, res) {
        const { userId, authorName, bookName, 
            bookDesc, bookCoverUrl, recentChapterUrl } = req.body

        if (!userId) {
            return res.json({ code: '9999', message: '书架书籍ID(id)不能为空', data: {} })
        }

        if (!authorName) {
            return res.json({ code: '9999', message: '作者名(authorName)不能为空', data: {} })
        }

        if (!bookName) {
            return res.json({ code: '9999', message: '书名(bookName)不能为空', data: {} })
        }

        if (!recentChapterUrl) {
            return res.json({ code: '9999', message: '最新阅读章节(recentChapterUrl)不能为空', data: {} })
        }

        try {
            // 判断书籍是否已存在该用户书架中，避免重复添加
            const getResult = await shelfDao.getShelfList({ userId, authorName, bookName })
            if (getResult.data.length > 0) {
                return res.json({ code: '9999', message: '该书籍已在书架中，不可重复添加', data: {} })
            }

            // 新增书架书籍
            await shelfDao.saveShelf({ userId, authorName, bookName, 
                bookDesc, bookCoverUrl, recentChapterUrl })
            res.json({ code: '0000', message: '新增书架书籍成功', data: { } })
        } catch (e) {
            console.log('[-] routes > shelf > addShelf()', e.message)
            res.json({ code: '9999', message: '新增书架书籍失败', data: {} })
        }
    },

    /**
     * 删除书架中的小说
     * 小说书架页面，删除书架中的一本书
     */
    removeShelf: async function (req, res) {
        const { id } = req.body

        if (!id) {
            return res.json({ code: '9999', message: '书架书籍ID(id)不能为空', data: {} })
        }

        try {
            await shelfDao.deleteShelf({ id })
            res.json({ code: '0000', message: '删除书架书籍信息成功', data: {} })
        } catch (e) {
            console.log('[-] routes > shelf > removeShelf()', e.message)
            res.json({ code: '9999', message: '删除书架书籍信息失败', data: {} })
        }
    },

    /**
     * 更新书架小说最新阅读章节
     */
    editShelf: async function (req, res){
        const { id } = req.params
        const { recentChapterUrl } = req.body

        if (!recentChapterUrl) {
            return res.json({ code: '9999', message: '最新阅读章节地址(recentChapterUrl)不能为空', data: {} })
        }

        try {
            await shelfDao.updateShelf({ id, recentChapterUrl })
            res.json({ code: '0000', message: '更新书架书籍信息成功', data: {} })
        } catch (e) {
            console.log('[-] routes > shelf > editShelf()', e.message)
            res.json({ code: '9999', message: '更新书架书籍信息失败', data: {} })
        }
    },

    /**
     * 查询书架列表
     * userId 小说书架页面，根据用户 ID 查询拥有的书籍
     * userId、bookName、authorName 小说介绍页面，判断图书是否已加入书架，避免重复添加
     */
    getShelfList: async function (req, res) {
        const { userId = '' } = req.query

        if (!userId) {
            return res.json({ code: '9999', message: '用户ID(userId)不能为空', data: [] })
        }

        try {
            const result = await shelfDao.getShelfList({ userId })
            res.json(result)
        } catch (e) {
            console.log('[-] routes > shelf > getShelf()', e.message)
            res.json({ code: '9999', message: '获取书架列表失败', data: [] })
        }
    },
}