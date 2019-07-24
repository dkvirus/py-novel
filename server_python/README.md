# SERVER

Python + Flask + Scrapy

## 概述

目前线上用的服务端接口是由 server_node_express 提供的，server_python 已经下线了，仅供学习。

部分数据库存入本地数据库，部分数据从网上直接爬取转换为 json 结构直接返回，之前放在小程序云函数上的几张表也转移到本地数据库中。

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
    |-- scrapyNovel                 # 爬虫
    |-- reptile                     # 爬虫
        |-- db.py                   # 封装数据库操作方法
        |-- novel.py                # 爬小说
        |-- classify.py             # 爬分类
        |-- chapter.py              # 爬章节
    |-- config.py                   # flask 框架配置参数
    |-- index.py                    # 对外提供接口的入口文件
    |-- README.md
```

用 scrapy 爬虫框架也写了一版爬虫，具体参见 [scrapyNovel](./scrapyNovel/README.md)

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

## 更新日志

2018年11月28日 公羊阅读后台接口突然崩了，小程序上访问不了页面。经排查后发现是 `/api/gysw/chapter/<path:url>` 和 `/api/gysw/content/<path:url>` 接口的问题。restful 传参组装在请求地址里，但如果参数本身就是个 url 地址就会出现问题。

```
/api/gysw/chapter/https://www.biquge5200.cc/92_92627/
```

后端拿到的参数 url 变成了 `https:/www.biquge5200.cc/92_92627/`，注意 `https:` 后面少了一个斜杠。以为是 flask 的问题，后来用 node-express 也整了个web框架，同样的参数 url 也会少个斜杠。奇怪的是，在本地 mac 电脑上一切正常，将代码上传到 CentOS7 服务器才出现这个问题。更奇怪的是，在11月28日之前一切正常，突然之间参数就传递异常了。目前，已添加处理可以访问，但是问题根源仍未可知。
