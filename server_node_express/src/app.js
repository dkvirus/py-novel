const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');

const router = require('./router');
require('./utils/db');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));   // parse application/x-www-form-urlencoded
app.use(bodyParser.json());     // parse application/json

app.use(express.static(path.join(process.cwd(), 'statics')));   // 设置静态资源目录
app.set('view engine', 'ejs');    // 设置模板引擎为 ejs

router(app);

app.listen(3000, function () {
  console.log('server is starting on port: 3000.')
});