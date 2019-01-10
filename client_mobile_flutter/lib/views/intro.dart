import 'package:flutter/material.dart';

class Intro extends StatefulWidget {
  final String url;
  Intro({this.url});

  @override
  State<StatefulWidget> createState() {
    return new IntroState(url);
  }
}

class IntroState extends State<Intro> {
  final String url;
  IntroState(this.url);

  Widget build(BuildContext context) {
    var novel = {
      "book_name": "妖神记",
      "author_name": "发飙的蜗牛",
      "classify_name": "玄幻小说",
      "last_update_at": "2019-01-06",
      "book_desc":
          "　　妖神一出，谁与争锋。最强妖灵师聂离因为一本神秘的时空妖灵之书重生年少时代，修炼最强功法、最强的妖灵之力，踏足武道巅峰！前世的仇人，全部清算。既然重生，这一世我便是主宰一切的众神之王，让一切都在我脚下蛰伏颤抖吧。~~《妖神记》是蜗牛精心雕琢的一部玄幻作品，将会是一部与众不同的玄幻故事，另外《妖神记》的漫画也在腾讯动漫同时发布，画风非常精美，请大家多多支持。~~",
      "recent_chapter_url": "https://www.biquge5200.cc/2_2740/1937488.html"
    };

    print(url);
    return new Scaffold(
        body: new Container(
      padding: EdgeInsets.only(top: 40.0),
      child: new Column(
        children: <Widget>[
          new Expanded(
              flex: 9,
              child: new Column(
                children: <Widget>[
                  new Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: <Widget>[
                      new Image.asset(
                        'images/cover.png',
                        height: 120.0,
                        width: 60.0,
                      ),
                      new Text(novel['book_name']),
                      new Text(novel['author_name'])
                    ],
                  ),
                  new Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: <Widget>[
                      new Text('更新时间：' + novel['last_update_at']),
                      new Text('分类：' + novel['classify_name'])
                    ],
                  ),
                  new Column(
                    children: <Widget>[
                      new Container(
                        padding: EdgeInsets.only(top: 20.0, bottom: 10.0),
                        child: new Text('简介'),
                      ),
                      new Container(
                        padding: EdgeInsets.only(left: 15.0, right: 15.0),
                        child: new Text(
                          novel['book_desc'],
                          softWrap: true,
                          maxLines: 10,
                        ),
                      )
                    ],
                  )
                ],
              )),
          new Expanded(
            flex: 1,
            child: new SizedBox(
              child: new Text('加入书架'),
            ),
          )
        ],
      ),
    ));
  }
}
