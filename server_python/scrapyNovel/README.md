# scrapyNovel

Python3 + Scrapy

```
$ scrapy crawl classify     <= 爬分类
$ scrapy crawl novel        <= 爬小说
```

配置文件 scrapyNovel/scrapyNovel/settings.py

```
# -*- coding: utf-8 -*-

BOT_NAME = 'scrapyNovel'

SPIDER_MODULES = ['scrapyNovel.spiders']
NEWSPIDER_MODULE = 'scrapyNovel.spiders'

# 数据库
MYSQL_HOST = 数据库主机/ip
MYSQL_USER = 数据库登录用户名
MYSQL_PASS = 数据库登录密码
MYSQL_DB = 数据库名称

ITEM_PIPELINES = {
   'scrapyNovel.pipelines.ClassifyPipeline': 300,
   'scrapyNovel.pipelines.NovelPipeline': 300,
   'scrapyNovel.pipelines.HtmlPipeline': 300,
}
```
