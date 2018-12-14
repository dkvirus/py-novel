const express = require('express');
const bodyParser = require('body-parser');

// 自定义中间件
const trunApiPrefix = require('./middlewares/trun-apiprefix');
const logger = require('./middlewares/logger');

const router = require('./router');
const { api_prefix, server_port } = require('../config');
require('./utils/db');
require('./utils/email');
require('./utils/redis');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));   // parse application/x-www-form-urlencoded
app.use(bodyParser.json());     // parse application/json

app.use(logger());                      // 日志处理
app.use(trunApiPrefix(api_prefix));     // 统一处理请求前缀

router(app);

app.listen(server_port, function () {
  console.log(`server is starting on port: ${server_port}.`)
});