const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// 自定义中间件
const trunApiPrefix = require('./middlewares/trun-apiprefix');
const logger = require('./middlewares/logger');

const router = require('./router');
const { apiPrefix } = require('./configs/config');
require('./utils/db');
require('./utils/email');
require('./utils/redis');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));   // parse application/x-www-form-urlencoded
app.use(bodyParser.json());     // parse application/json

app.use(express.static(path.join(process.cwd(), 'statics')));   // 设置静态资源目录
app.set('view engine', 'ejs');          // 设置模板引擎为 ejs

app.use(logger());                      // 日志处理
app.use(trunApiPrefix(apiPrefix));      // 统一处理请求前缀

router(app);

app.listen(3000, function () {
  console.log('server is starting on port: 3000.')
});