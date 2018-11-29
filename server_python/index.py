from flask import Flask, jsonify, request
from flask_cors import CORS
from reptile.db import Db
from lxml import etree
import requests
import re
import config
import time
import uuid

app = Flask(__name__)
# 加载配置文件
app.config.from_object(config)
CORS(app, supports_credentials=True)

'''
首页：测试页面
'''
@app.route('/')
def index ():
    return 'WelCome to Index Page!'

'''
根据条件查询小说列表
@param keyword 关键字，小说名/作者名
@param classify_id 小说分类 id
'''
@app.route('/api/gysw/novel')
def getNovel():
    keyword = request.args.get('keyword', '')
    classify_id = request.args.get('classify_id', '')
    open_id = request.args.get('open_id', '')

    # 小说表中模糊查询
    if classify_id == '' and keyword == '' and open_id == '':
        return jsonify({ 'code': '0000', 'message': '需要传参进行查询', 'data': [] })
    if classify_id != '':
        sql = 'select * from gysw_novel where classify_id = %s' % classify_id
    if keyword != '':
        sql = 'select * from gysw_novel where book_name like "%%%%%s%%%%" or author_name like "%%%%%s%%%%"' % (keyword, keyword)
    if open_id != '':
        sql = 'select * from gysw_shelf where open_id = "%s"' % (open_id,)

    try:
        db = Db() 
        result = db.selectAll(sql)
        db.close()
        
        if len(result) == 0:
            # 根据 url 去笔趣阁查找小说
            target_url = 'https://www.biquge5200.cc/modules/article/search.php?searchkey=' + keyword
            r = requests.get(target_url)
            root = etree.HTML(r.text)
            novels = root.xpath('//tr[position()>1]')

            result = []
            for novel in novels:
                author_name = novel.xpath('td[position()=3]/text()')[0]
                book_name = novel.xpath('td[position()=1]/a/text()')[0]
                url = novel.xpath('td[position()=1]/a/@href')[0]
                print(author_name)
                print(book_name)
                print(url)
                result.append({ 'author_name': author_name, 'book_name': book_name, 'url': url })

        return jsonify({ 'code': '0000', 'message': '请求数据成功', 'data': result })
    except:
        return jsonify({ 'code': '9999', 'message': '请求数据失败' })

'''
查询小说分类
'''
@app.route('/api/gysw/classify')
def getClassify():
    try:
        db = Db() 
        result = db.selectAll('SELECT * FROM gysw_classify')
        db.close()
        return jsonify({ 'code': '0000', 'message': '请求数据成功', 'data': result })
    except:
        return jsonify({ 'code': '9999', 'message': '请求数据失败' })

'''
查询小说目录
'''
@app.route('/api/gysw/chapter/<path:url>')
def getChapter(url):
    try:
        if 'https:/www' in url:
            url = url.replace('https:/www', 'https://www')
            
        r = requests.get(url)
        root = etree.HTML(r.text)
        chapters = root.xpath('//dd[position()>9]')

        # 查询小说分类
        # classify_path = str(root.xpath('//div[@class="con_top"]/a[2]/@href')[0]).replace('/', '')
        # classify_desc = str(root.xpath('//div[@class="con_top"]/a[2]/text()')[0])
        
        # db = Db()
        # classify = db.selectAll('select * from gysw_classify where `path` = "%s" and `desc` = "%s"' % (classify_path, classify_desc))

        # if len(classify) == 0:
        #     db.insertOne('insert into gysw_classify (`path`, `desc`) values ("%s", "%s")' % (classify_path, classify_desc))
        #     db.close()

        result = []
        for chapter in chapters:
            url = chapter.xpath('a/@href')[0]
            name = chapter.xpath('a/text()')[0]
            _id = 'dkvirus%s' % uuid.uuid4()
            result.append({ 'id': _id, 'url': url, 'name': name })

        return jsonify({ 'code': '0000', 'message': '请求数据成功', 'data': result })
    except:
        return jsonify({ 'code': '9999', 'message': '请求数据失败' })

'''
查询小说内容
'''
@app.route('/api/gysw/content/<path:url>')
def getContent(url):
    try:
        if 'https:/www' in url:
            url = url.replace('https:/www', 'https://www')
        
        r = requests.get(url)
        root = etree.HTML(r.text)

        # re 解析获取内容，包含html元素
        reg = r'<div id="content">(.*?)</div>'
        content = re.findall(reg, r.text, re.S)[0]

        # xpath 解析获取标题，上一章、下一章url
        title = root.xpath('//div[@class="bookname"]/h1/text()')[0]
        prev_url = root.xpath('//div[@class="bottem1"]/a[2]/@href')[0]
        next_url = root.xpath('//div[@class="bottem1"]/a[4]/@href')[0]
        
        result = { 'title': title, 'content': content, 'prev_url': prev_url, 'next_url': next_url }
        return jsonify({ 'code': '0000', 'message': '请求数据成功', 'data': result })
    except:
        return jsonify({ 'code': '9999', 'message': '请求数据失败' })

'''
查询书架中的小说
'''
@app.route('/api/gysw/shelf')
def getShelf():
    open_id = request.args.get('open_id', '')
    book_name = request.args.get('book_name', '')
    author_name = request.args.get('author_name', '')

    if not open_id:
        return jsonify({ 'code': '9999', 'message': '查询数据失败：open_id不能为空' })

    sql = 'select * from gysw_shelf where `open_id` = "%s"' % open_id
    if book_name:
        sql += ' and `book_name` = "%s"' % book_name
    if author_name:
        sql += ' and `author_name` = "%s"' % author_name

    try:
        db = Db() 
        result = db.selectAll(sql)
        db.close()
        return jsonify({ 'code': '0000', 'message': '查询数据成功', 'data': result })
    except:
        return jsonify({ 'code': '9999', 'message': '查询数据失败' })

'''
删除书架中小说
'''
@app.route('/api/gysw/shelf/<id>', methods=['DELETE'])
def delShelf(id):
    try:
        db = Db()
        db.removeOne('delete from gysw_shelf where id = %s' % id)
        db.close()
        return jsonify({ 'code': '0000', 'message': '删除数据成功' })
    except:
        return jsonify({ 'code': '9999', 'message': '删除数据失败' })

'''
更新书架中小说
'''
@app.route('/api/gysw/shelf/<int:id>', methods=['PUT'])
def editShelf(id):
    chapter_url = request.json['chapter_url']
    try:
        db = Db() 
        db.updateOne('update gysw_shelf set chapter_url = "%s" where id = %s' % (chapter_url, id))
        db.close()
        return jsonify({ 'code': '0000', 'message': '修改数据成功' })
    except:
        return jsonify({ 'code': '9999', 'message': '修改数据失败' })

'''
往书架中添加小说
'''
@app.route('/api/gysw/shelf', methods=['POST'])
def addShelf():
    try:
        open_id = request.json['open_id']
        author_name = request.json['author_name']
        book_name = request.json['book_name']
        chapter_url = request.json['chapter_url']
        if not open_id and not author_name and not book_name and not chapter_url:
            return jsonify({ 'code': '9999', 'message': '新增数据失败：参数值不能为空' })

        db = Db()
        sql = 'insert into gysw_shelf (`open_id`, `author_name`, `book_name`, `chapter_url`) values (%s, %s, %s, %s)'
        db.insertOne(sql, (open_id, author_name, book_name, chapter_url))
        db.close()
        return jsonify({ 'code': '0000', 'message': '新增数据成功' })
    except:
        return jsonify({ 'code': '9999', 'message': '新增数据失败' })

'''
查询搜索历史
'''
@app.route('/api/gysw/search/hist/<open_id>')
def getSearchSelf(open_id):
    try:
        db = Db() 
        result = db.selectAll('select keyword from gysw_search where open_id = "%s" order by last_update_at desc limit 5' % open_id)
        db.close() 
        return jsonify({ 'code': '0000', 'message': '查询数据成功', 'data': result })
    except Exception as e:
        print(e)
        return jsonify({ 'code': '9999', 'message': '查询数据失败' })

'''
查询热门搜索
'''
@app.route('/api/gysw/search/hot')
def getSearchHot():
    try:
        db = Db() 
        result = db.selectAll('select keyword, convert(sum(times), int) as times from gysw_search group by keyword order by times desc limit 6')
        db.close()
        print(result)
        return jsonify({ 'code': '0000', 'message': '查询数据成功', 'data': result })
    except Exception as e:
        print(e) 
        return jsonify({ 'code': '9999', 'message': '查询数据失败' })

'''
添加搜索历史
'''
@app.route('/api/gysw/search/hist', methods=['POST'])
def addSearch():
    try:
        open_id = request.json['open_id']
        keyword = request.json['keyword']
        if not open_id and not keyword:
            return jsonify({ 'code': '9999', 'message': '新增数据失败：参数值不能为空' })
        db = Db()
        # 取数据
        result = db.selectAll('select * from gysw_search where keyword = "%s" and open_id = "%s"' % (keyword, open_id))
        if not result or len(result) == 0:
            print('新增...')
            # 没有，新增
            sql = 'insert into gysw_search (`open_id`, `keyword`, `last_update_at`) values (%s, %s, %s)'
            localtime = time.localtime(time.time())
            db.insertOne(sql, (open_id, keyword, localtime))
        else:
            print('修改...')
            # 修改，次数 +1
            current = result[0]
            times = current['times'] + 1
            db.updateOne('update gysw_search set times = %d where open_id = "%s" and keyword = "%s"' % (times, open_id, keyword))

        db.close()
        return jsonify({ 'code': '0000', 'message': '新增数据成功' })
    except Exception as e:
        print(e)
        return jsonify({ 'code': '9999', 'message': '新增数据失败' })

if __name__ == '__main__':
    app.run(host='0.0.0.0')