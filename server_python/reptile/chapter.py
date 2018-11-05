import requests
from lxml import etree
from db import Db

'''
根据分类查询小说列表
'''
def getNovelsByClassifyId(classifyId):
    try:
        db = Db() 
        result = db.selectAll('select * from gysw_novel where `classify_id` = %s' % classifyId)
        db.close()
        print('Success: 根据分类id查询小说列表成功，分类id: %s' % classifyId)
        return result  
    except:
        print('Exception: 根据分类id查询小说列表成功，分类id: %s' % classifyId)



'''
查询小说章节数据并存库
'''
def getChapters(novel):
    try:
        r = requests.get(novel['url'])
        root = etree.HTML(r.text)
        chapters = root.xpath('//dd[position()>9]')

        result = []
        for chapter in chapters:
            url = chapter.xpath('a/@href')[0]
            name = chapter.xpath('a/text()')[0]
            novel_id = novel['id']
            result.append((url, name, novel_id))

        db = Db() 
        db.insertMany('insert into gysw_chapter (`url`, `name`, `novel_id`) values (%s, %s, %s)', tuple(result))
        db.close()
        print('书本 %s，插入章节成功，共 %i 章' % (novel['book_name'], len(result)))
    except Exception as e:
        print(e)
        print('书本 %s，插入章节失败' % (novel['book_name'],))

# 章节批量存库操作
if __name__ == '__main__':
    list = getNovelsByClassifyId(1)
    for novel in list:
        getChapters(novel)
