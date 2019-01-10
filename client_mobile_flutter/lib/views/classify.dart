import 'package:flutter/material.dart';
import './intro.dart';

class Classify extends StatefulWidget {
  @override
  State createState() {
    return new ClassifyState();
  }
}

class ClassifyState extends State<Classify> {
  Widget build(BuildContext context) {
    var classify = [
      {
        "id": 1,
        "path": "xuanhuanxiaoshuo",
        "desc": "玄幻小说"
    }, {
        "id": 2,
        "path": "xiuzhenxiaoshuo",
        "desc": "修真小说"
    }, {
        "id": 3,
        "path": "dushixiaoshuo",
        "desc": "都市小说"
    }, {
        "id": 4,
        "path": "chuanyuexiaoshuo",
        "desc": "穿越小说"
    }, {
        "id": 5,
        "path": "wangyouxiaoshuo",
        "desc": "网游小说"
    }, {
        "id": 6,
        "path": "kehuanxiaoshuo",
        "desc": "科幻小说"
    }, {
        "id": 7,
        "path": "yanqingxiaoshuo",
        "desc": "言情小说"
    }, {
        "id": 8,
        "path": "tongrenxiaoshuo",
        "desc": "同人小说"
    }, {
        "id": 9,
        "path": "junshixiaoshuo",
        "desc": "军事小说"
    }];

    var novel = [
      {
        "id": 51,
        "classify_id": 1,
        "author_name": "天蚕土豆",
        "book_name": "大主宰",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/0_7/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 52,
        "classify_id": 1,
        "author_name": "我吃西红柿",
        "book_name": "雪鹰领主",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/2_2598/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 53,
        "classify_id": 1,
        "author_name": "宅猪",
        "book_name": "人道至尊",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/2_2379/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 54,
        "classify_id": 1,
        "author_name": "辰东",
        "book_name": "完美世界",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/0_9/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 55,
        "classify_id": 1,
        "author_name": "莫默",
        "book_name": "武炼巅峰",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/0_111/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 56,
        "classify_id": 1,
        "author_name": "汉宝",
        "book_name": "移动藏经阁",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/0_172/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 57,
        "classify_id": 1,
        "author_name": "叶之凡",
        "book_name": "七界武神",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/1_1387/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 58,
        "classify_id": 1,
        "author_name": "发飙的蜗牛",
        "book_name": "妖神记",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/2_2740/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 59,
        "classify_id": 1,
        "author_name": "善良的蜜蜂",
        "book_name": "修罗武神",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/1_1003/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 60,
        "classify_id": 1,
        "author_name": "蚕茧里的牛",
        "book_name": "武极天下",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/0_87/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 61,
        "classify_id": 1,
        "author_name": "傅啸尘",
        "book_name": "武神空间",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/0_48/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 62,
        "classify_id": 1,
        "author_name": "净无痕",
        "book_name": "太古神王",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/2_2157/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 63,
        "classify_id": 1,
        "author_name": "纯情犀利哥",
        "book_name": "邪御天娇",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/0_448/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 64,
        "classify_id": 1,
        "author_name": "苍天白鹤",
        "book_name": "棋祖",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/2_2951/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 65,
        "classify_id": 1,
        "author_name": "猫腻",
        "book_name": "择天记",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/0_584/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 66,
        "classify_id": 1,
        "author_name": "小刀锋利",
        "book_name": "傲剑天穹",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/0_973/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 67,
        "classify_id": 1,
        "author_name": "风凌天下",
        "book_name": "天域苍穹",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/1_1478/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 68,
        "classify_id": 1,
        "author_name": "虾米XL",
        "book_name": "诸天万界",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/1_1282/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 69,
        "classify_id": 1,
        "author_name": "横扫天涯",
        "book_name": "无尽丹田",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/0_238/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 70,
        "classify_id": 1,
        "author_name": "辰东",
        "book_name": "圣墟",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/52_52542/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 71,
        "classify_id": 1,
        "author_name": "永恒之火",
        "book_name": "儒道至圣",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/0_49/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 72,
        "classify_id": 1,
        "author_name": "乱(书坊)",
        "book_name": "全职法师",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/2_2599/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 73,
        "classify_id": 1,
        "author_name": "天蚕土豆",
        "book_name": "元尊",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/79_79883/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 74,
        "classify_id": 1,
        "author_name": "风青阳",
        "book_name": "龙血战神",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/0_350/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 75,
        "classify_id": 1,
        "author_name": "蚕茧里的牛",
        "book_name": "真武世界",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/5_5405/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 76,
        "classify_id": 1,
        "author_name": "厌笔萧生",
        "book_name": "帝霸",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/0_916/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 77,
        "classify_id": 1,
        "author_name": "烟雨江南",
        "book_name": "永夜君王",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/0_97/",
        "last_update_at": "0000-00-00"
    }, {
        "id": 78,
        "classify_id": 1,
        "author_name": "唐家三少",
        "book_name": "龙王传说",
        "book_desc": "",
        "book_cover_url": "",
        "book_url": "https://www.biquge5200.cc/23_23934/",
        "last_update_at": "0000-00-00"
    }
    ];

    return new Scaffold(
      body: new Row(
        children: <Widget>[
          Expanded(
            flex: 2, // 20%
            child: new ListView(
              children: new List.generate(classify.length, (index) {
                return new Column(
                  children: <Widget>[
                    new Padding(
                      padding: EdgeInsets.only(top: 20.0, bottom: 20.0),
                      child: new Text(classify[index]['desc']),
                    ),
                    new Container(
                      height: 1.0,
                      color: Colors.grey,
                    )
                  ],
                );
              })
            ),
          ),
          Expanded(
            flex: 8, // 60%
            child: new GridView.count(
              crossAxisCount: 2,
              children: new List.generate(novel.length, (index) {
                return new Center(
                  child: new GestureDetector(
                    onTap: () {
                      Navigator.of(context).push(new MaterialPageRoute(builder: (_) {
                        return new Intro(url: novel[index]['book_url']);
                      }));
                    },
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
                              novel[index]['book_name'],
                              style: TextStyle(fontSize: 24.0),
                            ),
                          ),
                          new Align(
                            alignment: Alignment(0.4, 0.0),
                            child: new Text(
                              novel[index]['author_name'],
                              style: TextStyle(fontSize: 18.0),
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                );
              }),
            ),
          ),
        ],
      )
    );
  }
}
