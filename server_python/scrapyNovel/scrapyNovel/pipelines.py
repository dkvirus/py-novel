# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
from scrapyNovel.db import Db

class ClassifyPipeline(object):
    classify_list = []  # 缓存列表
    db = Db()

    def process_item(self, item, spider):
        self.classify_list.append([item['path'], item['desc']])
        self.max_count = 5
        if len(self.classify_list) == self.max_count:
            self.multi_insert()
            del self.classify_list[:]
        return item

    def multi_insert(self):
        sql = "insert into gysw_classify (`path`, `desc`) values(%s, %s)"
        try:
            self.db.executemany(sql, self.classify_list)
            self.db.commit()
        except Exception as e:
            print(e)
            self.db.rollback()
            
    def open_spider(self, spider):
        try:
            self.db.execute('truncate table gysw_classify')
            self.db.commit()
        except Exception as e:
            print(e)
            self.db.rollback()

    def close_spider(self, spider):
        self.multi_insert()
        self.db.close()

class NovelPipeline(object):
    novel_list = []
    db = Db()

    def process_item(self, item, spider):
        self.novel_list.append([
            item['classify_id'],
            item['author_name'],
            item['book_name'],
            item['book_url'],
        ])
        self.max_count = 20
        if len(self.novel_list) == self.max_count:
            self.multi_insert()
            del self.novel_list[:]
        return item

    def multi_insert(self):
        sql = "insert into gysw_novel " + \
            "(`classify_id`, `author_name`, `book_name`, `book_url`, `last_update_at`) " + \
            "values(%s, %s, %s, %s, now())"
        try:
            self.db.executemany(sql, self.novel_list)
            self.db.commit()
        except Exception as e:
            print(e)
            self.db.rollback()

    def open_spider(self, spider):
        try:
            self.db.execute('truncate table gysw_novel')
            self.db.commit()
        except Exception as e:
            print(e)
            self.db.rollback()

    def close_spider(self, spider):
        self.multi_insert()
        self.db.close()

class HtmlPipeline(object):
    def process_item(self, item, spider):
        return item