from flask import Flask, jsonify
import requests
import re
import config

app = Flask(__name__)
# 加载配置文件
app.config.from_object(config)

'''
首页：测试页面
'''
@app.route('/')
def index ():
    return 'WelCome to Index Page!'

'''
根据关键字查询小说名/作者名
'''
@app.route('/novel/search/<name>')
def search (name):
    target_url = 'https://www.biquge5200.com/modules/article/search.php?searchkey=' + name
    try:
        r = requests.get(target_url)
        novel_source = r.text
        reg = r'<td class="odd"><a href="(.*?)">(.*?)</a></td>.*?<td class="odd">(.*?)</td>'
        # 所有搜索到的结果（包括小说网址、名称、作者姓名）
        novel_list = re.findall(reg, novel_source, re.S)
        
        # 判断是否有结果返回
        if len(novel_list) == 0:
            return jsonify({ 'code': '9999', 'message': '你要找的小说不存在，请检查后重新输入', 'data': [] })
        else:
            return jsonify({ 'code': '0000', 'message': '请求数据成功', 'data': novel_list })
    except Exception as e:
        print(e)
        return jsonify({ 'code': '9999', 'message': '网络错误，请重试', 'data': [] })

'''
根据小说url地址查询章节目录
'''
@app.route('/novel/chapter/<path:url>')
def chapter (url):
    try:
        chapter_source = requests.get(url).text
        reg = r'<dd><a href="(.*?)">(.*?)</a></dd>'
        chapter_list = re.findall(reg, chapter_source)
        return jsonify({ 'code': '0000', 'message': '请求数据成功', 'data': chapter_list })
    except Exception as e:
        print(e)
        jsonify({ 'code': '9999', 'message': '网络错误，请重试', 'data': [] })

'''
点击某一章节，返回章节内容
'''
@app.route('/novel/content/<path:url>')
def content (url):
    try:
        content_source = requests.get(url).text
        reg = r'<div id="content">(.*?)</div>.*?</a>.*?<a href="(.*?)">上一章</a>.*?章节目录</a>.*?<a href="(.*?)">下一章</a>'
        detail = re.findall(reg, content_source, re.S)[0]
        return jsonify({ 'code': '0000', 'message': '请求数据成功', 'data': detail })
    except Exception as e:
        print(e)
        jsonify({ 'code': '9999', 'message': '网络错误，请重试', 'data': [] })

if __name__ == '__main__':
    app.run(host='0.0.0.0')