import scrapy
from scrapyNovel.db import Db
from scrapyNovel.items import NovelItem

def get_classify_list():
    db = Db()
    db.cursor.execute('select * from gysw_classify')
    result = db.cursor.fetchall()
    db.close()
    return result

class NovelSpider(scrapy.Spider):

    name = "novel"

    custom_settings = {
        'ITEM_PIPELINES': { 
            'scrapyNovel.pipelines.NovelPipeline': 300 
        },
    }

    def start_requests(self):
        classify_list = get_classify_list()
        for classify in classify_list:
            yield scrapy.Request(classify[1], callback=self.parse_list, meta={'classify_id': classify[0]})

    def parse_list(self, response):
        lis = response.css('div.r li')
        item = NovelItem()

        for li in lis:
            item['classify_id'] = response.meta['classify_id']
            item['author_name'] = li.css('span.s5::text').extract_first()
            item['book_name'] = li.css('span.s2 a::text').extract_first()
            url = li.css('span.s2 a::attr(href)').extract_first()
            item['book_url'] = url
            yield item