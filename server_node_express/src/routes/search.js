const searchDao = require('../daos/search')
const novelDao = require('../daos/novel')

module.exports = {
    /**
     * 查询当前用户搜索记录
     */
    getSearchHist: async function (req, res) {
        const { userId } = req.query

        if (!userId) {
            return res.json({ code: '0000', message: '用户ID(userId)不能为空', data: [] })
        }

        try {
            const result = await searchDao.getHistList({ userId })
            res.json(result)
        } catch (e) {
            console.log('[-] routes > search > getSearchHist()', e.message)
            res.json({ code: '9999', message: '查询搜索历史记录失败', data: [] })
        }
    },

    /**
     * 查询热门搜索
     */
    getSearchHot: async function (req, res) {
        try {
            const result = await searchDao.getHotList()
            res.json(result)
        } catch (e) {
            console.log('[-] routes > search > getSearchHot()', e.message)
            res.json({ code: '9999', message: '查询搜索热门记录失败', data: [] })
        }
    },

    /**
     * 查询小说列表
     * 查询条件：作者名/小说名
     */
    getSearchNovel: async function (req, res) {
        const { keyword, userId } = req.query

        if (!keyword) {
            return res.json({ code: '9999', message: '关键字(keyword)不能为空', data: [] })
        }

        if (!userId) {
            return res.json({ code: '9999', message: '用户ID(userId)不能为空', data: [] })
        }

        let reptileResult
        try {
            reptileResult = await novelDao.reptileNovelList({ keyword })
            res.json(reptileResult)
        } catch (e) {
            console.log('[-] routes > search > getSearchNovel()', e.message)
            res.json({ code: '9999', message: '没有找到小说', data: [] })
        }

        try {
            if (reptileResult.data.length > 0) {
                // 根据 userId 和 keyword 去搜索表中查数据
                const histResult = await searchDao.getHistList({ keyword, userId })
                if (histResult.data.length > 0) {
                    // 已搜过关键词，更改次数
                    const times = histResult.data[0].times + 1
                    await searchDao.updateSearch({ times, userId, keyword })
                    console.log('更新搜索历史记录成功 userId=%o, keyword=%o', userId, keyword)
                } else {
                    // 未搜过关键词，新增
                    await searchDao.saveSearch({ userId, keyword })
                    console.log('新增搜索历史记录成功 userId=%o, keyword=%o', userId, keyword)
                }
            }
        } catch (e) {
            console.log('[-] routes > search > getSearchNovel()', e.message)
        }
    },
}