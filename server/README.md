# SERVER

python 爬取数据，将 html 字符串处理为 json 数据。

## 概述

提供数据接口。

## API

## 1. 根据关键字查小说

`/novel/search/<name>`

## 2. 根据小说url查章节目录

`/novel/chapter/<url>`

## 3. 根据章节url查文章内容

`/novel/content/<url>`

## 启动

```
$ cd server
$ python3 index.py
```

打开浏览器访问 `http://localhost:5000/novel/search/兵者`。
