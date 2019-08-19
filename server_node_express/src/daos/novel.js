const axios = require('axios')
const qs = require('querystring')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const uuidv4 = require('uuid/v4')

module.exports = {

    /**
     * 查询小说列表数据
     */
    getNovelList: async function ({ classifyId }) {
        let sql = 'select * from gysw_novel where 1 = 1'
        if (classifyId) {
            sql += ` and classify_id = ${classifyId}`
        }
        const result = await dbexec(sql)
        return result
    },

    /**
     * 查询小说分类列表
     */
    getClassifyList: async function () {
        const sql = 'SELECT * FROM gysw_classify'
        const result = await dbexec(sql)
        return result
    },

    /**
     * 爬虫爬取小说列表
     */
    reptileNovelList: async function ({ keyword }) {
        const target_url = 'https://www.biquge5200.cc/modules/article/search.php?searchkey=' + qs.escape(keyword)
        const response = await axios.get(target_url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.37 70.100 Safari/537.36',
            },
            responseType: 'arraybuffer',
        })

        const html = iconv.decode(response.data, 'gbk')
        const $ = cheerio.load(html)

        const $trs = $('tr').slice(1)
        const arr = []

        for (let i = 0; i < $trs.length; i++) {
            const obj = Object.create(null)
            obj.bookName = $($trs[i]).find('td').eq(0).find('a').text()
            obj.authorName = $($trs[i]).find('td').eq(2).text()
            obj.bookUrl = $($trs[i]).find('td').eq(0).find('a').attr('href')
            arr.push(obj)
        }

        return { code: '0000', message: '爬取小说列表成功', data: arr }
    },

    /**
     * 爬虫爬取小说详情
     */
    reptileNovelIntro: async function ({ url }) {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.37 70.100 Safari/537.36',
            },
            responseType: 'arraybuffer',
        })

        const html = iconv.decode(response.data, 'gbk')
        const $ = cheerio.load(html)

        const result = Object.create(null)
        result.bookName = $('div#info h1').text()                                             // 书名
        result.authorName = $('div#info p').eq(0).text().split('：')[1]                       // 作者
        result.classifyName = $('div.con_top a').eq(2).text()                                 // 小说类型
        result.lastUpdateAt = $('div#info p').eq(2).text().replace('最后更新：', '')           // 最后更新时间
        result.bookDesc = $('div#intro p').text()                                             // 小说简介
        result.recentChapterUrl = $($('dd a').slice(9)[0]).attr('href')                      // 小说第一章地址

        if (!result.bookName) {
            throw new Error('小说网址错误，没查到小说详情')
        }

        return { code: '0000', message: '查询小说详情信息成功', data: result }
    },

    /**
     * 爬虫爬取小说章节列表
     */
    reptileChapterList: async function ({ url }) {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.37 70.100 Safari/537.36',
            },
            responseType: 'arraybuffer',
        })

        const html = iconv.decode(response.data, 'gbk')
        const $ = cheerio.load(html)

        const $dds = $('dd a').slice(9)

        if ($dds.length === 0) {
            throw new Error('小说网址错误，没查到小说章节')
        }   

        const result = []
        for (let i = 0; i < $dds.length; i++) {
            const obj = Object.create(null)
            obj.name = $($dds[i]).text()
            obj.url = $($dds[i]).attr('href')
            obj.uuid = 'dk' + uuidv4()
            result.push(obj)
        }

        return { code: '0000', message: '查询小说章节列表成功', data: result }
    },

    /**
     * 爬虫爬取小说内容
     */
    reptileNovelContent: async function ({ url }) {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.37 70.100 Safari/537.36',
            },
            responseType: 'arraybuffer',
        })

        const html = iconv.decode(response.data, 'gbk')
        const $ = cheerio.load(html)

        const result = Object.create(null)
        result.title = $('div.bookname h1').text()                     // 章节标题
        result.content = $('div#content').html()                       // 章节内容
        result.prevUrl = $('div.bottem1 a').eq(1).attr('href')         // 上一章节 url
        result.nextUrl = $('div.bottem1 a').eq(3).attr('href')         // 下一章节 url

        if (!result.title) {
            throw new Error('小说网址错误，没查到小说内容')
        }

        return { code: '0000', message: '查询小说内容信息成功', data: result }
    },

}