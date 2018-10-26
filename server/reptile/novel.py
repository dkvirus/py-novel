import requests
from lxml import etree
from db import Db

def novel():
    db = Db()
    classifies = db.selectAll('select * from gysw_classify')

    for classify in classifies:
        target_url = 'https://www.biquge5200.cc/' + classify['path']
        try:
            r = requests.get(target_url)
            root = etree.HTML(r.text)

            novel_list = root.xpath('//div[@class="r"]//li')

            arr = []
            for novel in novel_list:
                url = novel.xpath('span[@class="s2"]/a/@href')[0]
                book_name = novel.xpath('span[@class="s2"]/a/text()')[0]
                author_name = novel.xpath('span[@class="s5"]/text()')[0]
                classify_id = classify['id']
                arr.append((url, book_name, author_name, classify_id))

            print('开始保存数据....')
            db.insertMany('insert into gysw_novel (`url`, `book_name`, `author_name`, `classify_id`) values (%s, %s, %s, %s)', tuple(arr))
            db.close()
        except Exception as e:
            print(e)

    print('操作结束')
    db.close()

def reptileNovelByClassify(classify):
    db = Db() 
    target_url = 'https://www.biquge5200.cc/' + classify['path']
    
    try:
        r = requests.get(target_url)
        root = etree.HTML(r.text)

        novel_list = root.xpath('//div[@class="r"]//li')

        arr = []
        for novel in novel_list:
            url = novel.xpath('span[@class="s2"]/a/@href')[0]
            book_name = novel.xpath('span[@class="s2"]/a/text()')[0]
            author_name = novel.xpath('span[@class="s5"]/text()')[0]
            classify_id = classify['id']
            arr.append((url, book_name, author_name, classify_id))
            print('抓取 %s' % book_name)

        print('开始保存数据....')
        db.insertMany('insert into gysw_novel (`url`, `book_name`, `author_name`, `classify_id`) values (%s, %s, %s, %s)', tuple(arr))
    except Exception as e:
        print(e)

    print('操作结束')
    db.close()

if __name__ == '__main__':
    novel()
    # reptileNovelByClassify({ 'path': 'junshixiaoshuo', 'id': 9 })