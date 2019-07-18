const shelf = require('./routes/shelf');
const search = require('./routes/search');
const novel = require('./routes/novel');
const user = require('./routes/user');
const email = require('./routes/email');
const mobile = require('./routes/mobile');
const oauth = require('./routes/oauth');

module.exports = function (app) {

    app.get('/', (req, res) => res.send('hello world!'));

    // 书架
    app.post('/gysw/shelf', shelf.addShelf);                            // 往书架中添加一本小说
    app.delete('/gysw/shelf/:id', shelf.removeShelf);                   // 在书架中删除一本小说
    app.put('/gysw/shelf/:id', shelf.editShelf);                        // 修改书架中小说最新阅读章节
    app.get('/gysw/shelf', shelf.getShelf);                             // 查询书架列表

    // 搜索
    app.post('/gysw/search/hist', search.addSearchHist);                // 添加查询历史记录
    app.get('/gysw/search/hist/:user_id', search.getSearchHist);        // 查询用户搜索历史
    app.get('/gysw/search/hot', search.getSearchHot);                   // 查询热门搜索
    app.get('/gysw/search/novel', search.getSearchNovel);               // 根据小说名/作者名查询小说列表

    // 小说
    app.get('/gysw/novel/content', novel.getNovelContent);              // 查看小说内容
    app.get('/gysw/novel/chapter', novel.getNovelChapter);              // 查看章节目录
    app.get('/gysw/novel/detail', novel.getNovelIntro);                 // 查看小说详情
    app.get('/gysw/novel/classify', novel.getNovelClassify);            // 查看小说分类 

    // 用户
    app.get('/gysw/user/info', user.getUserInfo);                       // 查看用户信息
    app.post('/gysw/user/info', user.addUserInfo);                      // 新增用户
    app.put('/gysw/user/info/:id', user.editUserInfo);                  // 更新用户信息
    app.get('/gysw/user/validate', user.validateUser);                  // 校验用户是否已注册
    app.get('/gysw/user/wxinfo', user.getWxUserInfo);                   // 获取微信用户信息

    // 邮箱验证码
    app.post('/gysw/email/code', email.sendEmailCode);                  // 发送 email 验证码
    app.post('/gysw/email/validate', email.validateEmailCode);          // 检验验证码是否正确
    app.post('/gysw/email/feedback', email.sendFeedbackEmail);          // 发送用户反馈邮箱
    
    // 短信验证码
    app.post('/gysw/mobile/code', mobile.sendMobileCode);               // 发送短信验证码
    app.post('/gysw/mobile/validate', mobile.validateMobileCode);       // 检验验证码是否正确

    // 认证
    app.post('/gysw/oauth/token', oauth.getToken);                       // 获取 token

    // Not Found
    app.use('*', function (req, res) { res.json({ code: '9999', message: '没有找到对应的路由' }) });
}