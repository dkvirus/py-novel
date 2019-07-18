# PY-NOVEL

看小说。

## 起源

为什么整这个项目？

工作中经常会学习一些新技术，通常情况下，没有实践过，过一段时间就会忘记，徒增学习成本。

dk 本人很喜欢看小说，so，开了这个工程，将遇到的感兴趣的技术、框架都怼一遍实践项目。古代将军练兵讲究以战养兵，进步神速，dk 效仿之。

## 技术栈

- [x] Python【Python3+Flask+Mariadb】：转换数据接口。笔趣阁广告多、排版也很简陋，http请求返回的响应是 html 字符串，通过 Python 做中间层处理，正则表达式匹配 Html 字符串中有用的数据：小说名称、作者、内容等信息，提供统一的数据接口，为 Web 端和移动端提供数据来源；[python服务端详情](./server_python)
- [x] Node【Node+Express+Mariadb】：为了适用多端，重构服务端接口，不改动之前 Python 实现版本，使用 node 实现 `/api/v2` 的接口；[node服务端详情](./server_node_express)
- [x] Vue：Web 端展示选用 Vue 框架，UI 选用 iview 框架，已适配手机浏览器阅读；[浏览器客户端详情+图示](./client_web_spa_vue)
- [x] 微信小程序：看小说大多数情况还是在手机上看的，移动客户端再开发一个微信小程序端；[小程序客户端详情+图示](./client_mobile_miniapp)
- [x] 移动端：Android 原生-Java；[安卓原生Java端详情+图示](./client_mobile_android)
- [x] 移动端：Flutter。[移动端混合开发Flutter详情+图示](./client_mobile_flutter)
- [x] 移动端：Taro。[移动端混合开发Taro详情+图示](./client_mobile_taro)
- [ ] 移动端：React-native。
- [ ] 移动端：Weex。
- [ ] 移动端：Android 原生-Kotlin。
- [ ] 移动端：IOS 原生-swift。

## 更新日志

latest: 开发完 Taro 版公羊阅读。

[更新日志](./CHANGELOG.md)

## 目录结构

```
|-- py-novel
    |-- client_mobile_flutter       # 移动端开发，flutter 框架
    |-- client_mobile_miniapp       # 移动端开发，微信小程序
    |-- client_mobile_rn            # 移动端开发，react-native 框架
    |-- client_mobile_taro          # 移动端开发，Taro 框架
    |-- client_web_spa_vue          # web端，vue单页应用
    |-- server_node_express         # node 提供数据接口 /api/v2
    |-- server_python               # python 提供数据接口 /api/v1
```

## 部署

本地写的 shell 脚本，一键部署。有几点需要说明：

- python 服务单独在云主机(centos7)运行 `$ python3 index.py`，当退出 shell 时服务也会断开。解决方法为将 index.py 做成系统服务，使用 `systemctl` 统一管理；[《自定义系统服务》](https://blog.dkvirus.top/%E8%BF%90%E7%BB%B4/%E7%A5%9E%E5%A5%87%E7%9A%84%E6%9C%8D%E5%8A%A1%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7%20Systemd/)
- 一键部署包括将本地文件传输到云主机，使用的是 ssh 协议，但前提要设置免密登录。[《设置 ssh 免密登录》](https://blog.dkvirus.top/Linux/%E8%BF%9C%E7%A8%8B%E8%BF%9E%E6%8E%A5%E6%9C%8D%E5%8A%A1%E4%B9%8B%20SSH/)

