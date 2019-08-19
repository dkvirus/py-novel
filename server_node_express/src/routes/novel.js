const novelDao = require('../daos/novel')
const shelfDao = require('../daos/shelf')

module.exports = {
    /**
     * 查询小说内容
     * 更新最新阅读章节
     */
    getNovelContent: async function (req, res) {
        const { url, shelfId } = req.query

        if (!url) {
            return res.json({ code: '9999', message: '章节地址(url)不能为空', data: {} })
        }

        try {
            const result = await novelDao.reptileNovelContent({ url })
            res.json(result)
        } catch (e) {
            console.log('[-] routes > novel > getNovelContent()', e.message)
            res.json({ code: '9999', message: '查询小说内容信息失败', data: [] })
        }

        try {
            // 更新小说最新阅读章节
            await shelfDao.updateShelf({ id: shelfId, recentChapterUrl: url })
        } catch (e) {
            console.log('[-] routes > novel > getNovelContent()', e.message)
        }
    },

    /**
     * 查看小说章节 
     */
    getNovelChapter: async function (req, res) {
        const { url } = req.query

        if (!url) {
            return res.json({ code: '9999', message: '章节地址(url)不能为空', data: {} })
        }

        try {
            const result = await novelDao.reptileChapterList({ url })
            res.json(result)
        } catch (e) {
            console.log('[-] routes > novel > getNovelChapter()', e.message)
            res.json({ code: '9999', message: '查询小说章节列表信息失败', data: [] })
        }
    },

    /**
     * 查询小说详情 
     */
    getNovelIntro: async function (req, res) {
        const { url } = req.query

        if (!url) {
            return res.json({ code: '9999', message: '章节地址(url)不能为空', data: {} })
        }

        try {
            const result = await novelDao.reptileNovelIntro({ url })
            res.json(result)
        } catch (e) {
            console.log('[-] routes > novel > getNovelIntro()', e.message)
            res.json({ code: '9999', message: '查询小说详情信息失败', data: {} })
        }
    },

    /**
     * 查看小说分类
     */
    getNovelClassify: async function (req, res) {
        try {
            const result = await novelDao.getClassifyList()
            res.json(result)
        } catch (e) {   
            console.log('[-] routes > novel > getNovelClassify()', e.message)
            res.json({ code: '9999', message: '查询小说分类列表失败', data: [] })
        }
    },

    /**
     * 查询小说列表
     */
    getNovelList: async function (req, res) {
        const { classifyId } = req.query

        try {
            const result = await novelDao.getNovelList({ classifyId })
            res.json(result)
        } catch (e) {
            console.log('[-] routes > novel > getNovelList()', e.message)
            res.json({ code: '9999', message: '查询小说列表失败', data: [] })
        }
    },

}