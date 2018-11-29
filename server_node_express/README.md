# SERVER_NODE_EXPRESS

node + express + mariadb 提供后台接口服务。

## 目录结构

```
|-- server_node_express
    |-- src/                        <= 源码目录
        |-- configs/                <= 配置目录，包含数据库属性
        |-- routes                  <= 路由目录
        |-- statics                 <= 静态目录
        |-- utils                   <= 常用工具类目录
        |-- views                   <= 视图目录，暂时没有内容
        |-- app.js                  <= 项目入口文件
        |-- router.js               <= 路由分发文件
    |-- .gitignore
    |-- package.json
    |-- README.md
```

## 说明

`src/configs` 目录下有 `config.js` 文件，主要是连接数据库的参数，dk 由于使用自己的数据库将该文件忽略上传了，本地启动服务时需要自己添加该文件。格式如下：

```
exports.apiPrefix = '/api/v2';

exports.db_host = 数据库地址;     // 本地就是 localhost，云主机就是对应 ip
exports.db_user = 数据库登录用户名;
exports.db_password = 数据库登录用户需要的密码;
exports.db_database = 使用哪个数据库;
```

## 接口

- `/api/v2/gysw/shelf` 往书架中添加一本小说
- `/api/v2/gysw/shelf/:id` 在书架中删除一本小说
- `/api/v2/gysw/shelf/:id` 修改书架中小说最新阅读章节
- `/api/v2/gysw/shelf` 查询书架列表
- `/api/v2/gysw/search/hist` 添加查询历史记录
- `/api/v2/gysw/search/hist/:user_id` 查询用户搜索历史
- `/api/v2/gysw/search/hot` 查询热门搜索
- `/api/v2/gysw/search/novel` 根据小说名/作者名查询小说列表
- `/api/v2/gysw/novel/content` 查看小说内容
- `/api/v2/gysw/novel/chapter` 查看章节目录
- `/api/v2/gysw/novel/detail` 查看小说详情
- `/api/v2/gysw/novel/classify` 查看小说分类 
- `/api/v2/gysw/user/info` 查看用户信息
- `/api/v2/gysw/user/info` 新增用户

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