# PY-NOVEL

看小说。

## 技术栈

Python+Vue+iview+微信小程序。

- [x] Python：转换数据接口。笔趣阁广告多、排版也很简陋，http请求返回的响应是 html 字符串，通过 Python 做中间层处理，正则表达式匹配 Html 字符串中有用的数据：小说名称、作者、内容等信息，提供统一的数据接口，为 Web 端和移动端提供数据来源；[python服务端详情](./server)
- [x] Vue：Web 端展示选用 Vue 框架，UI 选用 iview 框架，已适配手机浏览器阅读；[浏览器客户端详情+图示](./web-client)
- [x] 微信小程序：看小说大多数情况还是在手机上看的，移动客户端再开发一个微信小程序端；[小程序客户端详情+图示](./miniapp-client)

截止 2018年10月03日 基本功能已经全部完成，下一阶段任务：

- [ ] 页面美化；
- [ ] 前面只是一本一本爬取，后面爬取笔趣阁上所有完载的小说，保存在本地txt或者存数据库，这涉及到ip代理和多线程。

## 目录结构

```
|-- py-novel
    |-- server              # python 提供数据接口
    |-- web-client          # web 客户端
    |-- miniapp-clent       # 微信小程序客户端
```

## 部署

本地写的 shell 脚本，一键部署。有几点需要说明：

- python 服务单独在云主机(centos7)运行 `$ python3 index.py`，当退出 shell 时服务也会断开。解决方法为将 index.py 做成系统服务，使用 `systemctl` 统一管理；[《自定义系统服务》](https://blog.dkvirus.top/%E8%BF%90%E7%BB%B4/%E7%A5%9E%E5%A5%87%E7%9A%84%E6%9C%8D%E5%8A%A1%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7%20Systemd/)
- 一键部署包括将本地文件传输到云主机，使用的是 ssh 协议，但前提要设置免密登录。[《设置 ssh 免密登录》](https://blog.dkvirus.top/Linux/%E8%BF%9C%E7%A8%8B%E8%BF%9E%E6%8E%A5%E6%9C%8D%E5%8A%A1%E4%B9%8B%20SSH/)
- 脚本示例如下，可供参考。

```
#!/bin/sh

# 传输 web-client 
cd /Users/dkvirus/Documents/github/py-novel/web-client  && rm -rf dist  && npm run build &&  tar czv dist | ssh novel@dkvirus.top 'cd ~ && rm -rf dist && tar xz'

# 传输 server
cd /Users/dkvirus/Documents/github/py-novel && tar czv server | ssh novel@dkvirus.top 'cd ~ && rm -rf server && tar xz'
```