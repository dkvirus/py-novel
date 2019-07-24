# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy

class ClassifyItem(scrapy.Item):
    path = scrapy.Field()
    desc = scrapy.Field()

class NovelItem(scrapy.Item):
    classify_id = scrapy.Field()
    author_name = scrapy.Field()
    book_name = scrapy.Field()
    book_desc = scrapy.Field()
    book_cover_url = scrapy.Field()
    book_url = scrapy.Field()