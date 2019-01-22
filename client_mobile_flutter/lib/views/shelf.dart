import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ShelfPage extends StatefulWidget {
  @override
  State createState() => _ShelfState();
}

class _ShelfState extends State<ShelfPage> {
  
  @override 
  Widget build(BuildContext context) {
    var data = [
      {
        "id": 22,
        "user_id": 9,
        "author_name": "七品",
        "book_name": "兵者",
        "book_desc": "",
        "book_cover_url": "https://novel.dkvirus.top/images/cover.png",
        "recent_chapter_url":
            "https://www.biquge5200.cc/98_98081/161850582.html",
        "last_update_at": "2019-01-09T04:13:44.000Z"
      },
      {
        "id": 23,
        "user_id": 9,
        "author_name": "九灯和善",
        "book_name": "超品巫师",
        "book_desc": "",
        "book_cover_url": "https://novel.dkvirus.top/images/cover.png",
        "recent_chapter_url":
            "https://www.biquge5200.cc/84_84888/161857956.html",
        "last_update_at": "2019-01-09T03:57:43.000Z"
      },
      {
        "id": 24,
        "user_id": 9,
        "author_name": "巫九",
        "book_name": "都市阴阳师",
        "book_desc": "",
        "book_cover_url": "https://novel.dkvirus.top/images/cover.png",
        "recent_chapter_url":
            "https://www.biquge5200.cc/92_92627/161863549.html",
        "last_update_at": "2019-01-09T03:48:00.000Z"
      },
      {
        "id": 22,
        "user_id": 9,
        "author_name": "七品",
        "book_name": "兵者",
        "book_desc": "",
        "book_cover_url": "https://novel.dkvirus.top/images/cover.png",
        "recent_chapter_url":
            "https://www.biquge5200.cc/98_98081/161850582.html",
        "last_update_at": "2019-01-09T04:13:44.000Z"
      },
      {
        "id": 23,
        "user_id": 9,
        "author_name": "九灯和善",
        "book_name": "超品巫师",
        "book_desc": "",
        "book_cover_url": "https://novel.dkvirus.top/images/cover.png",
        "recent_chapter_url":
            "https://www.biquge5200.cc/84_84888/161857956.html",
        "last_update_at": "2019-01-09T03:57:43.000Z"
      },
      {
        "id": 24,
        "user_id": 9,
        "author_name": "巫九",
        "book_name": "都市阴阳师",
        "book_desc": "",
        "book_cover_url": "https://novel.dkvirus.top/images/cover.png",
        "recent_chapter_url":
            "https://www.biquge5200.cc/92_92627/161863549.html",
        "last_update_at": "2019-01-09T03:48:00.000Z"
      },
      {
        "id": 23,
        "user_id": 9,
        "author_name": "九灯和善",
        "book_name": "超品巫师",
        "book_desc": "",
        "book_cover_url": "https://novel.dkvirus.top/images/cover.png",
        "recent_chapter_url":
            "https://www.biquge5200.cc/84_84888/161857956.html",
        "last_update_at": "2019-01-09T03:57:43.000Z"
      },
      {
        "id": 24,
        "user_id": 9,
        "author_name": "巫九",
        "book_name": "都市阴阳师",
        "book_desc": "",
        "book_cover_url": "https://novel.dkvirus.top/images/cover.png",
        "recent_chapter_url":
            "https://www.biquge5200.cc/92_92627/161863549.html",
        "last_update_at": "2019-01-09T03:48:00.000Z"
      },
    ];

    return new DefaultTabController(
      length: 3,
      child: new Scaffold(
      appBar: _buildAppBar(context),    // 标题栏
      body: new ListView(
        children: <Widget>[_buildShelfList(data)],
    )),
    );
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
    return new Container(
      margin: EdgeInsets.only(top: 10.0),
      child: new GridView.count(
        shrinkWrap: true,
        physics: new NeverScrollableScrollPhysics(),
        crossAxisCount: 2,
        mainAxisSpacing: 10.0,
        crossAxisSpacing: 2.0,
        padding: EdgeInsets.only(left: 20.0, right: 20.0),
        children: new List.generate(data.length, (index) {
          return _buildShelfItem(data, index);
        }),
      ));
  }

  /*
   * 单个列表项
   */
  Widget _buildShelfItem(data, index) {
    return new Center(
      child: new Container(
      width: 140.0,
      height: 260.0,
      decoration: new BoxDecoration(
        image: new DecorationImage(
          image: new AssetImage("images/cover.png"),
          fit: BoxFit.cover,
        ),
      ),
      margin: EdgeInsets.only(bottom: 10.0),
      child: new Column(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: <Widget>[
          new Align(
            alignment: Alignment(-0.6, 0.0),
            child: new Text(
              data[index]['book_name'],
              style: TextStyle(fontSize: 24.0),
            ),
          ),
          new Align(
            alignment: Alignment(0.4, 0.0),
            child: new Text(
              data[index]['author_name'],
              style: TextStyle(fontSize: 18.0),
            ),
          ),
        ],
      ),
    ));
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
    }
  }
}
