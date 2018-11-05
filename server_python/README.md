# SERVER

## 概述

目前部分数据库存入本地数据库，部分数据从网上直接爬取转换为 json 结构直接返回，之前放在小程序云函数上的几张表也转移到本地数据库中。

在 server/reptile 目录下有 config.py 配置文件，主要是连接数据库的参数，dk 由于使用自己的数据库将该文件忽略上传了，本地启动服务时需要自己添加该文件。格式如下：

```
# config.py
# encoding:utf-8

host = 'your ip'
user = 'db user'
password = 'db pw'
db = 'db name'
```

## 目录结构

```
|-- server_python
    |-- reptile                     # 爬虫
        |-- db.py                   # 封装数据库操作方法
        |-- novel.py                # 爬小说
        |-- classify.py             # 爬分类
        |-- chapter.py              # 爬章节
    |-- config.py                   # flask 框架配置参数
    |-- index.py                    # 对外提供接口的入口文件
    |-- README.md
```

## API


- `/api/gysw/novel`：根据条件查询小说列表
- `/api/gysw/classify`：查询小说分类
- `/api/gysw/chapter/<path:url>`：查询小说目录
- `/api/gysw/content/<path:url>`：查询小说内容
- `/api/gysw/shelf`：查询书架中的小说
- `/api/gysw/shelf/<id>`：删除书架中小说
- `/api/gysw/shelf/<int:id>`：更新书架中小说
- `/api/gysw/shelf`：往书架中添加小说
- `/api/gysw/search/hot`：查询热门搜索
- `/api/gysw/search/hist/<open_id>`：查询搜索历史
- `/api/gysw/search/hist`：添加搜索历史

## 启动

```
$ cd server_python
$ python3 index.py
```

打开浏览器访问 `http://localhost:5000`。
