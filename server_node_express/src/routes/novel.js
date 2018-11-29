const iconv = require('iconv-lite');
const request = require('request');
const cheerio = require('cheerio');
const uuidv4 = require('uuid/v4');

module.exports = {
    /**
     * 查询小说内容
     */
    getNovelContent: async function (req, res) {
        const url = req.query.url;

        try {
            request({ url, encoding: null }, function (err, resp, body) {
                if (err) return res.json({ code: '9999', message: err });

                const html = iconv.decode(body, 'gbk');
                const $ = cheerio.load(html);

                const result = {};
                result.title = $('div.bookname h1').text();                     // 章节标题
                result.content = $('div#content').html();                       // 章节内容
                result.prev_url = $('div.bottem1 a').eq(1).attr('href');        // 上一章节 url
                result.next_url = $('div.bottem1 a').eq(3).attr('href');        // 下一章节 url

                res.json({ code: '0000', data: result });
            });
        } catch (e) {
            res.json({ code: '9999', message: e })
        }
    },

    /**
     * 查看小说章节 
     */
    getNovelChapter: async function (req, res) {
        const url = req.query.url;
        
        try {
            request({ url, encoding: null }, function (err, resp, body) {
                if (err) return res.json({ code: '9999', message: err });
                
                const html = iconv.decode(body, 'gbk');
                const $ = cheerio.load(html);
    
                const result = [];
                const $dds = $('dd a').slice(9);
                if ($dds.length === 0) return res.json({ code: '0000', data: result });

                for (let i = 0; i < $dds.length; i++) {
                    const obj = {};
                    obj.name = $($dds[i]).text();
                    obj.url = $($dds[i]).attr('href');
                    obj.uuid = 'dk' + uuidv4();
                    result.push(obj);
                }

                res.json({ code: '0000', data: result });
            });
        } catch (e) {
            res.json({ code: '9999', message: e });
        }
        
    },

    /**
     * 查询小说详情 
     */
    getNovelIntro: function (req, res) {
        const url = req.query.url;

        try {
            request({ url, encoding: null }, function (err, resp, body) {
                if (err) return res.json({ code: '9999', message: err });
                
                const html = iconv.decode(body, 'gbk');
                const $ = cheerio.load(html);
                
                const result = {};
                result.book_name = $('div#info h1').text();                                             // 书名
                result.author_name = $('div#info p').eq(0).text().split('：')[1];                       // 作者
                result.classify_name = $('div.con_top a').eq(2).text();                                 // 小说类型
                result.last_update_at = $('div#info p').eq(2).text().replace('最后更新：', '');           // 最后更新时间
                result.book_desc = $('div#intro p').text();                                             // 小说简介
                result.recent_chapter_url = $($('dd a').slice(9)[0]).attr('href');                      // 小说第一章地址

                res.json({ code: '0000', data: result });
            });
        } catch (e) {
            res.json({ code: '9999', message: e });
        }
    },

    /**
     * 查看小说分类
     */
    getNovelClassify: async function (req, res) {
        const sql = 'SELECT * FROM gysw_classify';
        const result = await dbexec(sql);
        res.json(result);
    },

}