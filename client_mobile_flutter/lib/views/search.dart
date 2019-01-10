import 'package:flutter/material.dart';

class Search extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return new SearchState();
  }
}

class SearchState extends State<Search> {
  @override
  Widget build(BuildContext context) {
    var hot = [
      {"keyword": "七品", "times": 21},
      {"keyword": "都市阴阳师", "times": 20},
      {"keyword": "西红柿", "times": 9},
      {"keyword": "流氓天尊", "times": 7},
      {"keyword": "紫血圣皇", "times": 4},
      {"keyword": "天道图书馆", "times": 4}
    ];

    var history = [
      {"keyword": "琅琊榜"},
      {"keyword": "知否"},
      {"keyword": "天道图书馆"},
      {"keyword": "紫血圣皇"},
      {"keyword": "巫师"}
    ];

    final controller = TextEditingController();

    return new Scaffold(
      appBar: new AppBar(
        title: new Container(
            padding: EdgeInsets.only(top: 5.0),
            child: new TextField(
              controller: controller,
              decoration: // 显示 Placeholder
                  InputDecoration(
                    contentPadding: EdgeInsets.only(left: 10.0),
                    hintText: '输入作者名/小说名',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(30.0),
                    )),
            )),
        actions: <Widget>[
          new Padding(
            padding: EdgeInsets.only(right: 20.0),
            child: new IconButton(
              icon: new Icon(Icons.search),
              onPressed: () {
                print(controller.text);
              },
            ),
          ),
        ],
      ),
      body: new ListView(
        children: <Widget>[
          new Row(
            children: <Widget>[
              new Padding(
                child: new Text(
                  '热门搜索',
                  style: new TextStyle(
                      fontSize: 20.0, fontWeight: FontWeight.bold),
                ),
                padding: EdgeInsets.only(left: 20.0, top: 20.0),
              )
            ],
          ),
          new GridView.count(
            padding: const EdgeInsets.all(10.0),
            crossAxisCount: 2,
            crossAxisSpacing: 5.0,
            mainAxisSpacing: 5.0,
            childAspectRatio: 5 / 1,
            shrinkWrap: true,
            physics: new NeverScrollableScrollPhysics(),
            children: new List.generate(hot.length, (index) {
              return new Container(
                  // color: Colors.grey,
                  color: Color.fromRGBO(230, 230, 230, 1.0),
                  child: new Center(
                      child: new Text(
                    hot[index]['keyword'],
                    style: TextStyle(
                        color: Color.fromRGBO(16, 30, 194, 1.0),
                        fontWeight: FontWeight.bold),
                  )));
            }),
          ),
          new Container(
            height: 1.0,
            color: Colors.grey,
          ),
          new Row(
            children: <Widget>[
              new Padding(
                child: new Text(
                  '搜索历史',
                  style: new TextStyle(
                      fontSize: 20.0, fontWeight: FontWeight.bold),
                ),
                padding: EdgeInsets.only(left: 20.0, top: 20.0),
              )
            ],
          ),
          new Container(
              padding: EdgeInsets.only(left: 20.0, top: 10.0),
              child: new Column(
                children: new List.generate(history.length, (index) {
                  return new Row(
                    children: <Widget>[
                      new Icon(Icons.search),
                      new Padding(
                        padding: EdgeInsets.only(left: 15.0),
                        child: new Text(
                          history[index]['keyword'],
                          style: TextStyle(
                            fontSize: 18.0,
                          ),
                        ),
                      )
                    ],
                  );
                }),
              ))
        ],
      ),
    );
  }
}
