# SERVER_NODE_EXPRESS

Node + Express + Mariadb 提供后台接口服务。

## 目录结构

```
|-- server_node_express
    |-- src/                        <= 源码目录
        |-- middlewares             <= 中间件目录
            |-- jwt-verify.js       <= jwt 认证中间件
            |-- ignore-favicon.js   <= 忽略 favicon.ico 中间件
            |-- logger.js           <= 打印请求信息中间件
            |-- turn-apiprefix.js   <= 自动转换请求前缀中间件，统一给每个请求加上前缀，e.g. /api/v1
        |-- routes                  <= 路由目录，每个模块具体做了哪些事
        |-- utils                   <= 常用工具类目录
        |-- app.js                  <= 项目入口文件
        |-- router.js               <= 路由分发文件
    |-- config.js                   <= 配置文件
    |-- .gitignore
    |-- package.json
    |-- README.md
```

## start

要把服务端跑起来：

- src 目录下创建 `config.js`，按照下面说明添加相关配置；
- 启动 redis，通常命令是 `$ redis-server`；
  做发短信和发邮件时用到了 redis 依赖，需要先启动；或者将 src/app.js 中导入 redis 那一行代码删掉就可以不启动 redis 了
- 启动项目 `$ npm run dev`；

`config.js` 文件，主要是连接数据库的参数，dk 由于使用自己的数据库将该文件忽略上传了，本地启动服务时需要自己添加该文件。

有些接口本地用不上的，可以暂时注释相关配置。如发邮件的接口、发短信的接口、请求微信用户信息的接口。

jwt 配置建议打开，之前 dk 就因为没有做接口认证，导致数据库数据被恶意删除。参见 [issue#23](https://github.com/dkvirus/py-novel/issues/23)

```
/**
 * 通用配置
 */
exports.apiPrefix = '/api/v1';        // 请求前缀
exports.server_port = 4000;           // 监听端口

/**
 * 连接数据库参数
 */
exports.db_host = 数据库地址;           // 本地就是 localhost，云主机就是对应 ip
exports.db_user = 数据库登录用户名;
exports.db_password = 数据库登录用户需要的密码;
exports.db_database = 使用哪个数据库;

/**
 * jwt 开放接口
 * token_exUrl        不做认证的接口
 * token_exMethod     不做认证的请求方法
 */
exports.token_secret = 'qunimade';              // token 密钥
exports.token_expiresIn = 10080;                // token 过期时间
exports.token_exUrl = [                         // 不做认证的接口
  '/gysw/oauth/token',        
  '/gysw/user/info',
  '/gysw/user/validate',
  '/gysw/mobile/code',
  '/gysw/mobile/validate',
];
exports.token_exMethod = ['GET'];               // 不做认证的请求方法

/**
 * 发送邮件必要参数
 * 使用 nodemailer 工具包，示例参考：https://segmentfault.com/a/1190000012251328
 * 发邮件具体代码写在 utils/email.js 和 routes/email.js
 */
// exports.email_account = 邮箱账号;
// exports.email_pass = 邮箱密码;
// exports.email_from = 发送者邮箱;

/**
 * 发送手机短信必要参数
 * 使用的是腾讯云的短信服务，一个月免费有 500 条短信
 * 参数含义参照官方接口文档：https://cloud.tencent.com/document/product/382/3772
 */
// exports.mobile_appid = 短信AppId;
// exports.mobile_appkey = 短信AppKey;
// exports.mobile_signature = 短信签名;                                
// exports.mobile_templateId = 短信模板ID;          

/**
 * 获取微信openId必要参数
 */
// exports.wxAppId = 微信AppId;                          
// exports.wxAppSecret = 微信AppSecret;       
```

## 接口

假设上面👆的配置中 `apiPrefix=/api/v1`，端口 `server_port=4000`，启动之后本机访问接口为：

### 测试接口

- `GET http://localhost:4000/api/v1` 测试接口，返回 hello world 表示启动成功 

### 书架相关接口

- `GET http://localhost:4000/api/v1/gysw/shelf` 查询书架中所有小说
- `POST http://localhost:4000/api/v1/gysw/shelf` 往书架中新增一本小说
- `DELETE http://localhost:4000/api/v1/gysw/shelf/:id` 删除书架中的一本小说
- `PUT http://localhost:4000/api/v1/gysw/shelf/:id` 更新书架中的一本小说，通常是更新阅读章节

### 搜索相关接口

- `GET http://localhost:4000/api/v1/gysw/search/hot` 查询热门搜索列表
- `GET http://localhost:4000/api/v1/gysw/search/hist/:user_id` 查询用户搜索历史
- `GET http://localhost:4000/api/v1/gysw/search/novel` 根据小说名/作者名查询小说列表
- `POST http://localhost:4000/api/v1/gysw/search/hist` 新增搜索历史记录

### 小说相关接口

- `GET http://localhost:4000/api/v1/gysw/novel/content` 查询小说某一章节内容。章节标题，章节内容等
- `GET http://localhost:4000/api/v1/gysw/novel/chapter` 查询小说章节列表数据，展示所有章节
- `GET http://localhost:4000/api/v1/gysw/novel/detail`  查询小说详细内容。小说书名、作者名、简介等
- `GET http://localhost:4000/api/v1/gysw/novel/classify`  查询小说分类列表信息。修真、都市、灵异、军事等

更多接口详见 `src/router.js` 文件。

接口仅供参考，学习，请勿干坏事哦~

## 接口响应说明

```
// 接口响应格式：
{
  code: string;
  message: string;
  data: object|array;
}

只有 code === '0000' 说明请求成功；
当看到 code === '9999' 或其它非 '0000' 时，表示业务处理失败。比如：该用户已经注册，不能重复注册等。
```

## 表结构

- `gysw_user` 用户表。

```
CREATE TABLE `gysw_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(255) NOT NULL DEFAULT '' COMMENT '用户名',
  `password` varchar(255) DEFAULT '' COMMENT '登录密码',
  `client_type` varchar(20) NOT NULL DEFAULT '' COMMENT '客户端类型。OPENID/MOBILE/THIRDQQ/THIRDWX',
  `nickname` varchar(255) DEFAULT '' COMMENT '昵称',
  `avatar_url` varchar(255) DEFAULT '' COMMENT '头像',
  `birth` varchar(255) DEFAULT '' COMMENT '生日',
  `gender` varchar(4) DEFAULT '保密' COMMENT '男、女、保密',
  `address` varchar(255) DEFAULT '' COMMENT '居住地址',
  `email` varchar(100) DEFAULT '' COMMENT '邮箱',
  `remark` varchar(255) DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
```

- `gysw_shelf` 书架表。

```
CREATE TABLE `gysw_shelf` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int(11) NOT NULL COMMENT '用户外键',
  `author_name` varchar(255) NOT NULL DEFAULT '' COMMENT '作者名',
  `book_name` varchar(255) NOT NULL DEFAULT '' COMMENT '书名',
  `book_desc` varchar(255) DEFAULT '' COMMENT '小说描述',
  `book_cover_url` varchar(255) NOT NULL DEFAULT 'https://novel.dkvirus.top/images/cover.png' COMMENT '封面地址',
  `recent_chapter_url` varchar(255) NOT NULL DEFAULT '' COMMENT '最近阅读章节地址',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;
```

- `gysw_search` 搜索表。

```
CREATE TABLE `gysw_search` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int(11) NOT NULL COMMENT '用户外键',
  `keyword` varchar(255) NOT NULL DEFAULT '' COMMENT '关键字',
  `times` int(11) NOT NULL DEFAULT '1' COMMENT '次数',
  `last_update_at` date NOT NULL COMMENT '最后更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;
```

- `gysw_novel` 小说表。

```
CREATE TABLE `gysw_novel` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `classify_id` int(11) NOT NULL COMMENT '分类外键',
  `author_name` varchar(255) NOT NULL COMMENT '作者名',
  `book_name` varchar(255) NOT NULL DEFAULT '' COMMENT '小说名',
  `book_desc` varchar(1500) NOT NULL COMMENT '小说描述',
  `book_cover_url` varchar(255) NOT NULL DEFAULT 'https://novel.dkvirus.top/images/cover.png' COMMENT '小说封面',
  `book_url` varchar(255) NOT NULL DEFAULT '' COMMENT '小说网络地址，可以查询所有章节',
  `last_update_at` date NOT NULL DEFAULT '1971-01-01' COMMENT '最后更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=499 DEFAULT CHARSET=utf8;
```

- `gysw_classify` 小说分类表。

```
CREATE TABLE `gysw_classify` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `path` varchar(255) NOT NULL DEFAULT '',
  `desc` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
```