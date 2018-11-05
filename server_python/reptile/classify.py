import requests
from lxml import etree
from db import Db

class Classify(object):
    '''
    爬取首页分类数据
    '''
    def reptileIndexClassify(self):
        print('爬取首页分类数据:开始:(classify/reptileIndexClassify)...')
        target_url = 'https://www.biquge5200.com/modules/article/search.php'
        try:
            # r = requests.get(target_url)
            # root = etree.HTML(r.text)
            # classifies = root.xpath('//div[@class="nav"]//li[position()>2]')

            # arr1 = []
            # for classify in classifies:
            #     path = classify.xpath('a/@href')[0].split('/')[-2]
            #     desc = classify.xpath('a/text()')[0]
            #     arr1.append(( path, desc ))
                

            db = Db()
            # db.insertMany('insert ignore into gysw_classify (`path`, `desc`) values (%s, %s)', tuple(arr1))
            db.insertOne('insert ignore into gysw_classify(`path`, `desc`) values ("xxx2", "yyy2")')
            db.close()
            print('爬取首页分类数据:成功:(classify/reptileIndexClassify)...')
        except Exception as e:
            print('爬取首页分类数据:失败:(classify/reptileIndexClassify)...')
            print(e)

# def classify():
#     target_url = 'https://www.biquge5200.com/modules/article/search.php'
#     try:
#         r = requests.get(target_url)
#         root = etree.HTML(r.text)
#         classifies = root.xpath('//div[@class="nav"]//li[position()>2]')

#         arr1 = []
#         for classify in classifies:
#             path = classify.xpath('a/@href')[0].split('/')[-2]
#             desc = classify.xpath('a/text()')[0]
#             arr1.append({ 'path': path, 'desc': desc })

#         # 存库
#         db = Db()
#         arr2 = db.selectAll('select `path`, `desc` from gysw_classify')

#         # 求交集
#         arr3 = [i for i in arr1 if i not in arr2]
#         arr4 = []
#         for item in arr3:
#             arr4.append(tuple(item.values()))
#         db.insertMany('insert into gysw_classify (`path`, `desc`) values (%s, %s)', tuple(arr4))
#         db.close()
#         print('操作成功')
#     except Exception as e:
#         print(e)
#         print('操作失败')

if __name__ == '__main__':
    classify = Classify()
    classify.reptileIndexClassify()