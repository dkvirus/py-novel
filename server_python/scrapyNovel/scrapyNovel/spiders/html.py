import scrapy

class HtmlSpider(scrapy.Spider):

    name = "html"

    custom_settings = {
        'ITEM_PIPELINES': { 
            'scrapyNovel.pipelines.HtmlPipeline': 300 
        },
    }

    def start_requests(self):
        url = getattr(self, 'url', None)
        if url is not None:
            yield scrapy.Request(url, callback=self.parse)

    def parse(self, response):
        content = response.css('html').extract_first()
        with open('source.html', 'w') as f:
            f.write(content)

