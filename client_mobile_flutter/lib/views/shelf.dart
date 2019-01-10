import 'package:flutter/material.dart';

class Shelf extends StatefulWidget {
  @override
  State createState() {
    return new ShelfState();
  }
}

class ShelfState extends State<Shelf> {
  /**
   * 头部 ui
   */
  Widget _getHeader() {
    return new Container(
      height: 100.0,
      padding: EdgeInsets.only(top: 20.0, bottom: 20.0),
      decoration: new BoxDecoration(
        gradient: new LinearGradient(
          begin: const Alignment(0.0, -1.0),
          end: const Alignment(0.0, 0.6),
          colors: <Color>[
            const Color.fromRGBO(207, 217, 223, 1.0),
            const Color.fromRGBO(226, 235, 240, 1.0),
          ],
        ),
      ),
      child: new Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: <Widget>[
          new Row(
            children: <Widget>[
              new SizedBox(
                height: 60.0,
                width: 60.0,
                child: new CircleAvatar(
                  backgroundImage: new AssetImage('images/wocao.png'),
                ),
              ),
              new Padding(
                padding: EdgeInsets.only(left: 10.0),
                child: new Text(
                  '下午好！大橙子',
                  style: TextStyle(fontSize: 22.0),
                ),
              )
            ],
          ),
          new Row(
            children: <Widget>[
              new IconButton(
                  icon: new Icon(Icons.add),
                  onPressed: () {
                    Navigator.of(context).pushNamed('/search');
                  }),
            ],
          )
        ],
      ),
    );
  }

  /**
   * 单个列表项
   */
  Widget _getListItem(data, index) {
    return new Center(
        child: new Container(
      width: 140.0,
      height: 200.0,
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

  /**
   * 书架 ui
   */
  Widget _getShelfList(data) {
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
            return _getListItem(data, index);
          }),
        ));
  }

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
    ];

    return new Scaffold(
        body: new ListView(
      children: <Widget>[_getHeader(), _getShelfList(data)],
    ));
  }
}
