const chalk = require('chalk');
const moment = require('moment');
const { apiPrefix } = require('./configs/config');

const shelf = require('./routes/shelf');
const search = require('./routes/search');
const novel = require('./routes/novel');
const user = require('./routes/user');

module.exports = function (app) {
    
    app.use('*', function (req, res, next) {
        const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss SSS');
        console.log(`
Timer: ${chalk.green(now)} ——【${chalk.green(req.method)}  ${chalk.green(req.originalUrl)}】
请求参数(req.query)：${chalk.green(JSON.stringify(req.query))}   
请求参数(req.body)：${chalk.green(JSON.stringify(req.body))}
        `);
        next();
    })

    app.get('/', (req, res) => res.send('hello world!'))

    // 书架
    app.post(`${apiPrefix}/gysw/shelf`, shelf.addShelf);                            // 往书架中添加一本小说
    app.delete(`${apiPrefix}/gysw/shelf/:id`, shelf.removeShelf);                   // 在书架中删除一本小说
    app.put(`${apiPrefix}/gysw/shelf/:id`, shelf.editShelf);                        // 修改书架中小说最新阅读章节
    app.get(`${apiPrefix}/gysw/shelf`, shelf.getShelf);                             // 查询书架列表

    // 搜索
    app.post(`${apiPrefix}/gysw/search/hist`, search.addSearchHist);                // 添加查询历史记录
    app.get(`${apiPrefix}/gysw/search/hist/:user_id`, search.getSearchHist);        // 查询用户搜索历史
    app.get(`${apiPrefix}/gysw/search/hot`, search.getSearchHot);                   // 查询热门搜索
    app.get(`${apiPrefix}/gysw/search/novel`, search.getSearchNovel);               // 根据小说名/作者名查询小说列表

    // 小说
    app.get(`${apiPrefix}/gysw/novel/content`, novel.getNovelContent);              // 查看小说内容
    app.get(`${apiPrefix}/gysw/novel/chapter`, novel.getNovelChapter);              // 查看章节目录
    app.get(`${apiPrefix}/gysw/novel/detail`, novel.getNovelIntro);                 // 查看小说详情
    app.get(`${apiPrefix}/gysw/novel/classify`, novel.getNovelClassify);            // 查看小说分类 

    // 用户
    app.get(`${apiPrefix}/gysw/user/info`, user.getUserInfo);                       // 查看用户信息
    app.post(`${apiPrefix}/gysw/user/info`, user.addUserInfo);                      // 新增用户

    // Not Found
    app.use('*', function (req, res) { res.json({ code: '9999', message: '没有找到对应的路由' }) });
}