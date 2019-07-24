import scrapy
from scrapyNovel.items import ClassifyItem

class ClassifySpider(scrapy.Spider):

    name = "classify"

    start_urls = ["https://www.biquge5200.cc"]

    custom_settings = {
        'ITEM_PIPELINES': { 
            'scrapyNovel.pipelines.ClassifyPipeline': 300 
        },
    }

    def parse(self, response):
        lis = response.css('div.nav li')[2:]
        item = ClassifyItem()

        for li in lis:
            item['path'] = response.urljoin(li.css('a::attr(href)').extract_first())
            item['desc'] = li.css('a::text').extract_first()
            yield item