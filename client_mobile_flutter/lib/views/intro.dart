import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:async';
import '../utils/HttpUtils.dart';
import '../utils/ApiUtils.dart';
import '../utils/DialogUtils.dart';

/// {book_name: 大主宰, 
/// author_name: 天蚕土豆, 
/// classify_name: 玄幻小说, 
/// last_update_at: 2017-07-08, 
/// book_desc: 其实接下来的新书，在斗破完结时便已经是有了构想，只不过却并未立即开始写，因为那个世界太过的宏伟浩大，所以，我再写了一本武动，来作为其基石。斗破大结局时，萧炎所去的新世界，与林动最终去往的神秘世界，是相同的，因为那个神秘的大世界，便是我们新书开始的地方。当初并不太认为自己有驾驭那个世界的能力，而现在，终归是可以开始了。, 
/// recent_chapter_url: https://www.biquge5200.cc/0_7/2046.html}
class IntroPage extends StatefulWidget {
  final String url;
  IntroPage({this.url});

  @override
  _IntroState createState() => _IntroState(url);
}

class _IntroState extends State<IntroPage> {
  String url;       // 要查询的小说地址
  _IntroState(this.url);

  var novel;     // 小说详情
  String errorMsg = '查询中....';

  @override
  void initState() {
    Future.delayed(Duration(milliseconds: 100)).then((_) {
      _handleGetDetail(context);
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    if (novel == null) {
      return Scaffold(
        body: Column(
          children: <Widget>[
            SizedBox(
              height: kToolbarHeight,
            ),
            Center(
              child: Text(
                errorMsg,
                style: TextStyle(
                  fontSize: 22.0,
                ),
              ),
            )
          ],
        ),  
      );
    }

    return Scaffold(
      body: Container(
        padding: EdgeInsets.only(top: 40.0),
        child: Column(
          children: <Widget>[
            Expanded(
                flex: 9,
                child: Column(
                  children: <Widget>[
                    _buildBookAndAuthor(context),
                    Container(
                      color: Color.fromRGBO(239, 239, 239, 1.0),
                      margin: EdgeInsets.only(bottom: 10.0, top: 20.0),
                      padding: EdgeInsets.symmetric(vertical: 10.0),
                      child: _buildTimeAndClassify(context),
                    ),
                    Container(
                      color: Color.fromRGBO(239, 239, 239, 1.0),
                      margin: EdgeInsets.only(bottom: 10.0),
                      padding: EdgeInsets.only(bottom: 10.0),
                      child: _buildBookDesc(context),
                    ),
                  ],
                )),
            Expanded(
              flex: 1,
              child: _buildJoinShelf(context),
            )
          ],
        ),
      ),
    );
  }

  /*
   * 第一行：小说名称和作者名称 
   */
  Widget _buildBookAndAuthor (BuildContext context) {
    return SizedBox(
      width: 200.0,
      height: 300.0,
      child: Center(
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
                    novel['book_name'],
                    style: TextStyle(fontSize: 18.0, color: Colors.grey),
                  ),
                ),
                new Align(
                  alignment: Alignment(0.4, 0.0),
                  child: new Text(
                    '(' + novel['author_name'] + ')',
                    style: TextStyle(fontSize: 14.0, color: Colors.grey),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  /*
   * 第二行：更新时间和分类 
   */
  Widget _buildTimeAndClassify (BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: <Widget>[
        Text('更新时间：' + novel['last_update_at']),
        Text('分类：' + novel['classify_name'])
      ],
    );
  }

  /*
   * 第三行：小说简介 
   */
  Widget _buildBookDesc (BuildContext context) {
    return Column(
      children: <Widget>[
        Container(
          padding: EdgeInsets.only(top: 20.0, bottom: 10.0),
          child: Text(
            '简介',
            style: TextStyle(
              fontSize: 18.0,
              fontWeight: FontWeight.w400,
            ),),
        ),
        Container(
          padding: EdgeInsets.only(left: 15.0, right: 15.0),
          child: Text(
            novel['book_desc'],
            softWrap: true,
            maxLines: 6,
            overflow: TextOverflow.ellipsis,
          ),
        )
      ],
    );
  }

  /*
   * 加入书架按钮
   */
  Widget _buildJoinShelf (BuildContext context) {
    return Center(
      child: RaisedButton(
        onPressed: () {
          _handleJoinShelf(context);
        },
        child: Text('加入书架'),
      ),
    );
  }

  /*
   * 查询小说详情
   */
  _handleGetDetail (BuildContext context) async {
    var detailResult = await HttpUtils.request(
      ApiUtils.GET_NOVEL_INTRO, 
      context,
      data: {
        'url': url, 
      },
    );

    if (detailResult['data']['recent_chapter_url'] == null) {
      DialogUtils.showToastDialog(context, text: '查询失败，请重新尝试或联系管理员');
      setState(() {
        errorMsg = '查询出错，请联系管理员！me@dkvirus.com';           
      });
      return;
    }

    setState(() {
      novel = detailResult['data'];
    });
  }

  /*
   * 加入书架 
   */
  _handleJoinShelf (BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    int userId = prefs.getInt('userId') ?? -1;   // 取

    if (userId == -1) {
      // 跳转登录页面
      Navigator.of(context).pushNamedAndRemoveUntil('/signin', ModalRoute.withName('/signin'));
      return;
    }

    // 添加小说到书架
    var result = await HttpUtils.request(
      ApiUtils.ADD_SHELF, 
      context,
      method: HttpUtils.POST,
      data: {
        'user_id': userId,
        'author_name': novel['author_name'],
        'book_name': novel['book_name'],
        'book_desc': novel['book_desc'],
        'book_cover_url': 'https://novel.dkvirus.top/images/cover.png',
        'recent_chapter_url': novel['recent_chapter_url'],
      }
    );

    if (result['code'] != '0000') {
      DialogUtils.showToastDialog(context, text: result['message']);
      return;
    }

    // 跳转到首页
    Navigator.of(context).pushNamedAndRemoveUntil('/index', ModalRoute.withName('/index'));
  }
}
