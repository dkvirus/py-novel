import 'package:flutter/material.dart';
import 'dart:async';
import 'package:flutter_html/flutter_html.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/HttpUtils.dart';
import '../utils/ApiUtils.dart';
import '../utils/DialogUtils.dart';

/// {title: 'xxx',
/// content: 'xxxx',
/// prev_url: 'xxx',
/// next_url: 'xxx'}
class ReadPage extends StatefulWidget {
  final String url;
  final String bookName;
  final int id;
  ReadPage({this.url, this.bookName, this.id});

  @override
  _ReadState createState () => _ReadState(url, bookName, id);
}

class _ReadState extends State<ReadPage> {
  String _url = '';
  String _bookName = '';
  int _id;
  _ReadState(this._url, this._bookName, this._id);

  // 目录用到的变量
  String _order = 'asc';
  List _all = [];               // 所有章节
  List _list = [];              // 100章节
  List _page = [];              
  bool _isShowPage = false;
  Map _defalutPage = {};

  Map _detail;

  @override
  void initState() {
    Future.delayed(Duration(milliseconds: 100)).then((_) {
      _handleGetDetail(context, _url, false);
      _handleGetChapter(context);
    });
    super.initState();
  }

  @override
  Widget build (BuildContext context) {
    if (_detail == null) {
      return Scaffold(
        body: Container(),
      );
    }

    return Scaffold(
      body: Column(
        children: <Widget>[
          SizedBox(height: 25.0,),
          _buildContent(context),
          Container(height: 1.0, color: Colors.grey,),
          _buildFooter(context),
        ],
      ),
      drawer: _buildChapterDrawer(context), 
    );
  }

  /*
   * 构件目录抽屉 
   */
  _buildChapterDrawer (BuildContext context) {
    return Drawer(
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 15.0, vertical: 10.0),
        child: Column(
          children: <Widget>[
            SizedBox(height: 20.0,),
            _buildChapterTotal(context),
            _buildChapterPageBtn(context),
            Container(
              padding: EdgeInsets.symmetric(vertical: 5.0),
              height: 1.0,
              color: Colors.grey,
            ),
            _buildChapterList(context),
          ],
        ),
      ),
    );
  }

  /*
   * 构建抽屉头部：小说名字、共多少章
   */
  Widget _buildChapterTotal (BuildContext context) {
    return SizedBox(
      child: Row(
        children: <Widget>[
          Text(_bookName + '（共' + _all.length.toString() + '章）',
            style: TextStyle(
              fontSize: 20.0,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  /*
   * 构建抽屉中间部分：选择分页按钮、倒序按钮 
   */
  Widget _buildChapterPageBtn (BuildContext context) {
    Widget icon;
    if (_order == 'asc') {
      icon = Icon(Icons.arrow_upward);
    } else {
      icon = Icon(Icons.arrow_downward);
    }

    return SizedBox(
      height: 50.0,
      child: Row( 
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Text('目录(${_defalutPage['desc'] ?? ""})',
            style: TextStyle(
              fontSize: 16.0,
            ),
          ),
          FlatButton(
            onPressed: () {
              setState(() {
                _isShowPage = !_isShowPage;
              });
            },
            child: Text('切换翻页',
              style: TextStyle(
                fontSize: 16.0,
              ),
            ),
          ),
          IconButton(
            onPressed: () {
              var newList = _list.reversed;
              String order = '';
              if (_order == 'asc') {
                order = 'desc';
              } else {
                order = 'asc';
              }
              setState(() {
                _list = newList.toList();
                _order = order;
              });
            },
            iconSize: 30.0,
            icon: icon,
          )
        ],
      ),
    );
  }

  /*
   * 构建抽屉目录列表 
   */
  /// name: 第一章 朝气蓬勃, 
  /// url: https://www.biquge5200.cc/0_9/3366.html, 
  /// uuid: dk5d78eeea-4af3-4a01-b63f-306f1169c425
  Widget _buildChapterList (BuildContext context) {
    if (_list.length == 0) {
      return Center(
        child: Text('目录查询中...'),
      );
    }

    if (_isShowPage) {      
      // 大分页
      return Expanded(
        child: ListView(
          children: List.generate(_page.length, (index) {
            return GestureDetector(
              onTap: () {
                int start = _page[index]['start'];
                int end = _page[index]['end'];
                List list = _all.sublist(start, end);
                setState(() {
                  _isShowPage = false;
                  _list = list;
                  _defalutPage = _page[index];
                });
              },
              child: Container(
                margin: EdgeInsets.symmetric(vertical: 5.0),
                padding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 15.0),
                child: Text(_page[index]['desc'],
                  style: TextStyle(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ),
            );
          }),
        )
      );
    }

    // 小分页
    return Expanded(
      child: ListView(
        children: List.generate(_list.length, (index) {
          return GestureDetector(
            onTap: () {
              Navigator.of(context).pop();
              _handleGetDetail(context, _list[index]['url'], true);
            },
            child: Padding(
              padding: EdgeInsets.symmetric(vertical: 8.0, horizontal: 15.0),
              child: Text(_list[index]['name']),
            ),
          );
        })
      )
    );
  }

  /*
   * 构建内容区域 
   */
  Widget _buildContent (BuildContext context) {
    return Expanded(
      child: ListView(
        children: <Widget>[
          Html(
            data: _detail['content'],
            padding: EdgeInsets.all(8.0),
          ),
        ],
      ),
    );
  }

  /*
   * 构建底部 
   */
  Widget _buildFooter (BuildContext context) {
    return SizedBox(
      height: 40.0,
      child: Row(
        children: <Widget>[
          Expanded(
            flex: 1,
            child: Text(_detail['title']),
          ),
          Expanded(
            flex: 1,
            child: FlatButton(
              onPressed: () {
                if (_detail['prev_url'] == null || _detail['prev_url'] == '') {
                  DialogUtils.showToastDialog(context, text: '当前是第一章了哦~');
                  return;
                }
                _handleGetDetail(context, _detail['prev_url'], true);
              },
              child: Text('上一章'),
            ),
          ),
          Expanded(
            flex: 1,
            child: FlatButton(
              onPressed: () {
                if (_detail['next_url'] == null || _detail['next_url'] == '') {
                  DialogUtils.showToastDialog(context, text: '已经是最新章节了哦~');
                  return;
                }
                _handleGetDetail(context, _detail['next_url'], true);
              },
              child: Text('下一章'),
            ),
          ),
        ],
      ),
    );
  }

  /*
   * 查询小说阅读章节详情 
   */
  _handleGetDetail (BuildContext context, String url, bool isUpdated) async {
    if (url != null || url != '') {
      _url = url;
    }
    
    var result = await HttpUtils.request(
      ApiUtils.GET_NOVEL_CONTENT, 
      context,
      data: {
        'url': _url,
      }
    );

    if (result['code'] != '0000') {
      DialogUtils.showToastDialog(context, text: result['message']);
      return;
    }

    if (!mounted) {
      return;
    }

    setState(() {
      _detail = result['data'];
    });

    if (!isUpdated) {
      return;
    }

    // 保存最新阅读章节
    await HttpUtils.request(
      ApiUtils.EDIT_SHELF, 
      context,
      method: HttpUtils.PUT,
      data: {
        'id': _id,
        'recent_chapter_url': _url,
      }
    );
    
  }

  /*
   * 获取目录信息 
   */
  _handleGetChapter (BuildContext context) async {
    // 处理url获取目录url
    String url = _url.substring(0, _url.lastIndexOf('/'));

    // 请求目录列表数据
    var result = await HttpUtils.request(
      ApiUtils.GET_NOVEL_CHAPTER, 
      context,
      data: {
        'url': url,
      },
    );

    if (result['code'] != '0000') {
      DialogUtils.showToastDialog(context, text: result['message']);
      return;
    }

    if (result['data'].length == 0) {
      _handleGetChapter(context);
    }

    if (!mounted) {
      return;
    }

    List chapterList = result['data'] ?? [];
    if (chapterList.length == 0) {
      return;
    }

    /// 拼接分页数据，一页先展示 100 条数据
    /// 288 条数据，除以 100，得 2 余 88
    /// 2880 条数据，除以 100，得 28 余 80
    int integer = (chapterList.length / 100).floor();   // 整数部分
    int remainder = chapterList.length % 100;     // 小数部分
    List page = [];
    for (var i = 1; i <= integer; i++) {
      var obj = {};
      // 0-99     100-199
      // 0-100    100-200
      obj['start'] = (i - 1) * 100;
      obj['end'] = i * 100;
      obj['desc'] = ((i-1)*100+1).toString() + '-' + (i*100).toString();
      page.add(obj);
    }
    page.add({ 
      // 200-288   201-
      'desc': (integer*100+1).toString() + '-' + (integer*100+remainder).toString(),
      'start': integer*100,
      'end': integer * 100 + remainder,
    });

    List list = [];
    if (chapterList.length < 100) {
      list = chapterList;
    } else {
      list = chapterList.sublist(0 , 100);
    }

    setState(() {
      _all = chapterList;
      _page = page;
      _defalutPage = page.first;
      _list = list;
    });
  }
}