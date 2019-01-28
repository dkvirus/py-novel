import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:async';
import '../utils/HttpUtils.dart';
import '../utils/ApiUtils.dart';
import '../utils/DialogUtils.dart';
import './intro.dart';

class SearchPage extends StatefulWidget {
  @override
  _SearchState createState() => _SearchState();
}

class _SearchState extends State<SearchPage> {

  final _formKey = GlobalKey<FormState>();
  List _hotList = [];
  List _historyList = [];
  List _novelList = [];
  String _keyword;

  @override
  void initState () {
    Future.delayed(Duration(milliseconds: 100)).then((_) {
      _handleGetHotList(context);
      _handleGetHistoryList(context);
    });
    super.initState();
  }


  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: _buildAppBar(context),
      body: ListView(
        children: <Widget>[
          _buildNovelText(context),
          _buildNovelList(context),
          _buildHotText(context),
          _buildHotList(context),
          _buildGreyLine(context),
          _buildHistoryText(context),
          _buildHistoryList(context),
        ],
      ),
    );
  }

  /*
   * 构建 appbar 标题栏 
   */
  Widget _buildAppBar (BuildContext context) {
    return AppBar(
      title: Form(
        key: _formKey,
        child: Container(
          padding: EdgeInsets.only(top: 5.0),
          child: TextFormField(
            decoration: InputDecoration(
              fillColor: Colors.blue.shade100, 
              filled: true,
              contentPadding: EdgeInsets.only(left: 10.0),
              hintText: '输入作者名/小说名',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10.0),
              ),
            ),
            onSaved: (String value) => _keyword = value,
          ),
        ),
      ),
      actions: <Widget>[
        Padding(
          padding: EdgeInsets.only(right: 20.0),
          child: IconButton(
            icon: Icon(Icons.search),
            onPressed: () {
              _handleGetNovelByKeyword(context, null);
            },
          ),
        ),
      ],
    );
  }

  /*
   * 构建查询小说标题 
   */
  Widget _buildNovelText (BuildContext context) {
    if (_novelList.length == 0) {
      return Container();
    }

    return Padding(
      padding: EdgeInsets.only(top: 20.0),
      child: Center(
        child: FlatButton(
          onPressed: () {
            setState(() {
              _novelList = [];
            });
          },
          child: Text('为您找到如下小说，点我清空',
            style: TextStyle(
              fontSize: 20.0,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }

  /*
   * 构建查询小说列表 
   */
  Widget _buildNovelList (BuildContext context) {
    if (_novelList.length == 0) {
      return Container();
    }

    return Container(
      margin: EdgeInsets.only(top: 20.0),
      child: GridView.count(
        shrinkWrap: true,
        physics: NeverScrollableScrollPhysics(),
        crossAxisCount: 2,
        mainAxisSpacing: 10.0,
        crossAxisSpacing: 10.0,
        childAspectRatio: 0.7,    // 宽 / 高 = 0.7
        padding: EdgeInsets.all(5.0),
        children: List.generate(_novelList.length, (index) {
          return _buildNovelItem(_novelList, index);
        }),
      ),
    );
  }

  /*
   * 单个列表项
   */
  Widget _buildNovelItem(data, index) {
    return GestureDetector(
      onTap: () {
        String bookUrl = data[index]['book_url'];
        Navigator.of(context).push(new MaterialPageRoute(builder: (_) {
          return new IntroPage(url: bookUrl);
        }));
      },
      child: Card(
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
                  style: TextStyle(fontSize: 18.0, color: Colors.grey),
                ),
              ),
              new Align(
                alignment: Alignment(0.4, 0.0),
                child: new Text(
                  '(' + data[index]['author_name'] + ')',
                  style: TextStyle(fontSize: 14.0, color: Colors.grey),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /*
   * 热门搜索文字 
   */
  Widget _buildHotText (BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(left: 20.0, top: 20.0),
      child: Text(
        '热门搜索',
        style: TextStyle(
          fontSize: 20.0, 
          fontWeight: FontWeight.bold
        ),
      ),
    );
  }

  /*
   * 热门搜索列表 
   */
  Widget _buildHotList (BuildContext context) {
    return GridView.count(
      padding: const EdgeInsets.all(10.0),
      crossAxisCount: 2,
      crossAxisSpacing: 5.0,
      mainAxisSpacing: 5.0,
      childAspectRatio: 5 / 1,
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      children: List.generate(_hotList.length, (index) {
        return GestureDetector(
          onTap: () {
            _handleGetNovelByKeyword(context, _hotList[index]['keyword']);
          },
          child: Container(
            color: Color.fromRGBO(239, 239, 239, 1.0),
            child: Center(
              child: Text(
                _hotList[index]['keyword'],
                style: TextStyle(
                  color: Color.fromRGBO(16, 30, 194, 1.0),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        );
      }),
    );
  }

  /*
   * 灰色横线，分隔作用 
   */
  Widget _buildGreyLine (BuildContext context) {
    return Container(
      height: 1.0,
      color: Colors.grey,
    );
  }

  /*
   * 搜索历史文字 
   */
  Widget _buildHistoryText (BuildContext context) {
    return Padding(
      child: Text(
        '搜索历史',
        style: TextStyle(
          fontSize: 20.0, 
          fontWeight: FontWeight.bold
        ),
      ),
      padding: EdgeInsets.only(left: 20.0, top: 20.0),
    );
  }

  /*
   * 搜索历史列表 
   */
  Widget _buildHistoryList (BuildContext context) {
    if (_historyList.length == 0) {
      return Padding(
        padding: EdgeInsets.only(top: 30.0),
        child: Center(
          child: Text('快去搜索你的第一本小说吧~'),
        ),
      );
    }

    return Container(
      padding: EdgeInsets.only(left: 20.0, top: 10.0),
      child: Column(
        children: List.generate(_historyList.length, (index) {
          return Row(
            children: <Widget>[
              Icon(Icons.search),
              GestureDetector(
                onTap: () {
                  _handleGetNovelByKeyword(context, _historyList[index]['keyword']);
                },
                child: Padding(
                  padding: EdgeInsets.only(left: 15.0),
                  child: Text(
                    _historyList[index]['keyword'],
                    style: TextStyle(
                      fontSize: 18.0,
                    ),
                  ),
                ),
              ),
            ],
          );
        }),
      ),
    );
  }

  /*
   * 查询热门搜索 
   */
  _handleGetHotList (BuildContext context) async {
    var result = await HttpUtils.request(
      ApiUtils.GET_NOVEL_HOT_LIST, 
      context,
    );

    if (result['code'] != '0000') {
      DialogUtils.showToastDialog(context, text: result['message']);
    }

    List hotList = result['data'];
    hotList = hotList.sublist(0, 6);

    if (!mounted) {
      return;
    }

    setState(() {
      _hotList = hotList;
    });
  }

  /*
   * 查询历史记录 
   */
  _handleGetHistoryList (BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    int userId = prefs.getInt('userId') ?? -1;   // 取

    if (userId == -1) {
      // 跳转登录页面
      Navigator.of(context).pushNamedAndRemoveUntil('/signin', ModalRoute.withName('/signin'));
      return;
    }

    var result = await HttpUtils.request(
      ApiUtils.GET_NOVEL_HISTORY_LIST, 
      context,
      data: {
        'user_id': userId,
      },
    );

    if (result['code'] != '0000') {
      DialogUtils.showToastDialog(context, text: result['message']);
    }

    if (result['data'].length == 0) {
      return;
    }

    if (!mounted) {
      return;
    }

    List historyList = result['data'];

    if (result['data'].length < 6) {
      setState(() {
        _historyList = historyList.sublist(0);
      });
      return;
    }

    historyList = historyList.sublist(0, 6);

    setState(() {
      _historyList = historyList;
    });
  }

  /*
   * 根据关键词查询小说 
   */
  _handleGetNovelByKeyword (BuildContext context, String keyword) async {
    _formKey.currentState.save();

    if (keyword != '' || keyword != null) {
      _keyword = keyword;
    }

    if (_keyword == '' ||_keyword == null) {
      DialogUtils.showToastDialog(context, text: '查询关键字不能为空');
      return;   
    }

    var result = await HttpUtils.request(
      ApiUtils.GET_NOVEL_BY_KEYWORD, 
      context,
      data: {
        'keyword': _keyword,
      },
    );

    if (result['code'] != '0000') {
      DialogUtils.showToastDialog(context, text: result['message']);
      return;
    }

    if (result['data'].length == 0) {
      DialogUtils.showToastDialog(context, text: '小说没找到');
      setState(() {
        _novelList = [];
      });
      return;
    }

    if (!mounted) {
      return;
    }

    setState(() {
      _novelList = result['data'];
    });

    SharedPreferences prefs = await SharedPreferences.getInstance();
    int userId = prefs.getInt('userId') ?? -1;   // 取

    if (userId == -1) {
      // 跳转登录页面
      Navigator.of(context).pushNamedAndRemoveUntil('/signin', ModalRoute.withName('/signin'));
      return;
    }

    // 找到小说，保存搜索关键字
    await HttpUtils.request(
      ApiUtils.ADD_NOVEL_HISTORY, 
      context,
      method: HttpUtils.POST,
      data: {
        'keyword': _keyword,
        'user_id': userId,
      },
    );
  }

}
