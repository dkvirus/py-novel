import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:async';
import '../utils/HttpUtils.dart';
import '../utils/ApiUtils.dart';

/// 数据结构：
/// {
/// id: 40, 
/// user_id: 27, 
/// author_name: 我吃西红柿, 
/// book_name: 雪鹰领主, 
/// book_desc: 在帝国的安阳行省，有一个很小很不起眼的贵族领地，叫——雪鹰领！故事，就从这里开始！, 
/// book_cover_url: , 
/// recent_chapter_url: https://www.biquge5200.cc/2_2598/1847694.html, 
/// last_update_at: 0000-00-00 00:00:00
/// }
class ShelfPage extends StatefulWidget {
  @override
  State createState() => _ShelfState();
}

class _ShelfState extends State<ShelfPage> {
  
  // 书架列表，用来接收服务端返回的数据
  var _shelfList;

  // 是否删除
  bool _isDelete = false;

  @override
  void initState() {
    super.initState();
    Future.delayed(Duration(milliseconds: 100)).then((_) {
      _handleGetShelf(context);
    });
  }

  @override 
  Widget build(BuildContext context) {
    

    if (_shelfList == null) {
      return Container();
    }

    return Scaffold(
      appBar: _buildAppBar(context),    // 标题栏
      body: ListView(
        children: <Widget>[_buildShelfList(_shelfList)],
    ));
  }

  /*
   * 标题栏
   */
  Widget _buildAppBar (BuildContext context) {
    return AppBar(
      actions: <Widget>[
        new IconButton(
          icon: new Icon(Icons.search),
          onPressed: () {
            print('跳转到搜索页面');
          },
        ),
        new PopupMenuButton(
          onSelected: _handlePopMenu,
          itemBuilder: (BuildContext context) => <PopupMenuItem<String>>[
            new PopupMenuItem<String>(
              value: 'delete',
              child: new Text('删除')
            ),
            new PopupMenuItem<String>(
              value: 'signup',
              child: new Text('退出登录')
            )
          ]
        )
      ],        
    );
  }

  /*
   * 书架 ui
   */
  Widget _buildShelfList(data) {
    return Card(
      margin: EdgeInsets.all(10.0),
      elevation: 10.0,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 10.0, vertical: 10.0),
        child: GridView.count(
          shrinkWrap: true,
          physics: NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          mainAxisSpacing: 10.0,
          crossAxisSpacing: 10.0,
          childAspectRatio: 0.7,    // 宽 / 高 = 0.7
          padding: EdgeInsets.all(5.0),
          children: List.generate(data.length, (index) {
            return _buildShelfItem(data, index);
          }),
        )),
    );
  }

  /*
   * 单个列表项
   */
  Widget _buildShelfItem(data, index) {
    return Stack(
      alignment: Alignment(1.1, -1.05),
      children: <Widget>[
        Card(
          elevation: 5.0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
          clipBehavior: Clip.antiAlias,
          child: Container(
            decoration: new BoxDecoration(
              image: new DecorationImage(
                image: new AssetImage("images/cover.png"),
                fit: BoxFit.cover,
              ),
            ),
            child: new Column(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: <Widget>[
                new Align(
                  alignment: Alignment(-0.6, 0.0),
                  child: new Text(
                    data[index]['book_name'],
                    style: TextStyle(fontSize: 22.0, color: Colors.grey),
                  ),
                ),
                new Align(
                  alignment: Alignment(0.4, 0.0),
                  child: new Text(
                    '(' + data[index]['author_name'] + ')',
                    style: TextStyle(fontSize: 16.0, color: Colors.grey),
                  ),
                ),
              ],
            ),
          ),
        ),
        _isDelete ? IconButton(
          icon: Icon(Icons.delete),
          onPressed: () {
            _handleDelShelf(data[index]['id']);
          },
        ) : Text(''),
      ],
    );
  }

  /*
   * 获取书架列表数据 
   */
  _handleGetShelf (BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    int userId = prefs.getInt('userId') ?? -1;   // 取

    if (userId == -1) {
      // 跳转登录页面
      Navigator.of(context).pushNamedAndRemoveUntil('/signin', ModalRoute.withName('/signin'));
      return;
    }

    var result = await HttpUtils.request(
      ApiUtils.GET_SHELF_LIST, 
      context,
      method: HttpUtils.GET,
      data: {
        'user_id': userId,
      }
    );

    if (!mounted) {
      return;
    }

    if (result != null && result['code'] == '0000') {
      setState(() {
        _shelfList = result['data'];
      });
    }
  }

  /*
   * 删除书架中书籍 
   */
  _handleDelShelf (id) async {
    
  }

  /*
   * 处理三个点菜单组
   */
  void _handlePopMenu (value) async {
    if (value == 'signup') {      // 退出登录
      // 清除本地登录状态
      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setInt('userId', null);   // 存
      
      // 跳转到登录页面
      Navigator.of(context).pushNamedAndRemoveUntil('/signin', ModalRoute.withName('/signin'));
    } else if (value == 'delete') {
      if (!mounted) {
        return;
      }

      // 删除小说
      setState(() {
        _isDelete = true;
      });
    }
  }
}
