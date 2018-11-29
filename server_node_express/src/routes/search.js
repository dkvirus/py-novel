const iconv = require('iconv-lite');
const request = require('request');
const qs = require('querystring');
const cheerio = require('cheerio');
const moment = require('moment');

module.exports = {

    /**
     * 添加搜索历史
     */
    addSearchHist: async function (req, res) {
        // 首先根据当前用户和查询关键字查询是否查过
        const { user_id, keyword } = req.body;
        
        try {
            const querySql = 'select * from gysw_search where keyword = ? and user_id = ?';
            const queryResult = await dbexec(querySql, [keyword, user_id]);
            
            if (queryResult.data && queryResult.data.length === 0) {    // 没有查询过，新增
                const insertSql = 'insert into gysw_search (user_id, keyword, last_update_at) values (?, ?, ?)';
                const last_update_at = moment(new Date()).format('YYYY-MM-DD');
                await dbexec(insertSql, [user_id, keyword, last_update_at]);
            } else {        // 查询过，修改查询次数+1
                const updateSql = 'update gysw_search set times = ?, last_update_at = ? where user_id = ? and keyword = ?';
                const times = queryResult.data[0].times + 1;
                const last_update_at = moment(new Date()).format('YYYY-MM-DD');
                await dbexec(updateSql, [times, last_update_at, user_id, keyword]);
            }

            res.json({ code: '0000', message: '添加搜索历史记录成功' });
        } catch (e) {
            res.json(e);
        }
       
    },

    /**
     * 查询当前用户搜索记录
     */
    getSearchHist: async function (req, res) {
        const sql = 'select keyword from gysw_search where user_id = ? order by last_update_at desc limit 5';
        const result = await dbexec(sql, req.params.user_id);
        res.json(result);    
    },

    /**
     * 查询热门搜索
     */
    getSearchHot: async function (req, res) {
        const sql = `select keyword, convert(sum(times), int) as times 
            from gysw_search group by keyword order by times desc limit 6`;
        const result = await dbexec(sql);
        res.json(result);
    },

    /**
     * 查询小说列表
     * 查询条件：作者名/小说名    get 请求
     */
    getSearchNovel: async function (req, res) {
        let sql = 'select * from gysw_novel where 1 = 1';
        const { keyword = '', classify_id } = req.query;
        
        if (keyword) {
            sql += ` and book_name like "%${keyword}%" or author_name like "%${keyword}%"`;
        }
        if (classify_id) {
            sql += ` and classify_id = ${classify_id}`;
        }

        const result = await dbexec(sql);

        if (result.code === '0000' && result.data.length > 0) {
            return res.json(result);
        }

        const target_url = 'https://www.biquge5200.cc/modules/article/search.php?searchkey=' + qs.escape(keyword);
        
        try {
            request({ url: target_url, encoding: null }, function (err, result, body) {
                if (err) return res.json({ code: '9999', message: err });
    
                const html = iconv.decode(body, 'gbk');
                const $ = cheerio.load(html);
    
                const $trs = $('tr').slice(1);
                const arr = [];
    
                for (let i = 0; i < $trs.length; i++) {
                    const obj = {};
                    obj.book_name = $($trs[i]).find('td').eq(0).find('a').text();
                    obj.author_name = $($trs[i]).find('td').eq(2).text();
                    obj.book_url = $($trs[i]).find('td').eq(0).find('a').attr('href');
                    arr.push(obj);
                }
                
                res.json({ code: '0000', data: arr });
            });
        } catch (e) {
            res.json({ code: '9999', message: e });
        }
    },
}