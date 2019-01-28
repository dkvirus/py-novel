import 'package:flutter/material.dart';
import 'dart:async';
import '../utils/HttpUtils.dart';
import '../utils/ApiUtils.dart';
import './intro.dart';

/// [{id: 1, path: xuanhuanxiaoshuo, desc: 玄幻小说}]
class ClassifyPage extends StatefulWidget {
  @override
  _ClassifyState createState() => _ClassifyState();
}

class _ClassifyState extends State<ClassifyPage> {

  List classifyList = [];
  List novelList = [];
  int selectedClassifyId = 1;

  @override
  void initState () {
    Future.delayed(Duration(milliseconds: 100)).then((_) {
      _handleGetClassify(context);
    });
    super.initState();
  }

  @override
  Widget build (BuildContext context) {
    if (classifyList.length == 0) {
      return Container(
        child: Text('加载中'),
      );
    }

    return Scaffold(
      body: Row(
        children: [
          _buildClassifyList(context),
          _buildNovelList(context),
        ]
      ),
    );
  }

  /*
   * 生成左侧小说分类列表
   */
  Widget _buildClassifyList (BuildContext context) {
    var selectedClassifyStyle = TextStyle(
      color: Color.fromRGBO(44, 131, 245, 1.0),
    );

    return Expanded( 
      flex: 1,
      child: Container(
        color: Color.fromRGBO(239, 239, 239, 1.0),
        child: ListView(
          children: List.generate(classifyList.length, (index) {
            return Container(
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(
                  width: 1.0, 
                  color: Colors.white,
                ))
              ),
              child: Center(
                child: FlatButton(
                  onPressed: () {
                    _handleGetNovel(context, classifyList[index]['id']);
                  },
                  child: Text(
                    classifyList[index]['desc'],
                    style: selectedClassifyId == classifyList[index]['id'] ? selectedClassifyStyle : TextStyle(),
                  ),
                ),
              )
            );
          })
        ),
      ),
    );
  }

  /*
   * 生成右侧小说列表 
   */
  Widget _buildNovelList (BuildContext context) {
    return Expanded( 
      flex: 3,
      child: Container(
        margin: EdgeInsets.only(top: 20.0),
        child: GridView.count(
          crossAxisCount: 2,
          mainAxisSpacing: 10.0,
          crossAxisSpacing: 10.0,
          childAspectRatio: 0.7,    // 宽 / 高 = 0.7
          padding: EdgeInsets.all(5.0),
          children: List.generate(novelList.length, (index) {
            return _buildNovelItem(novelList, index);
          }),
        ),
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
   * 查询分类列表 
   */
  _handleGetClassify (BuildContext context) async {
    // 这是我封装的工具类，加载框在这个类中做的处理
    var classifyResult = await HttpUtils.request(
      ApiUtils.GET_CLASSIFY_LIST,
      context,
    );

    if (!mounted) {
      return;
    }

    setState(() {
      classifyList = classifyResult['data'];
    });

    var firstClassify = classifyResult['data'][0];

    _handleGetNovel(context, firstClassify['id']);
  }

  /*
   * 根据分类 id 查询小说列表
   */
  _handleGetNovel (BuildContext context, id) async {
    if (id == null) {
      return;
    }

    if (!mounted) {
      return;
    }

    var novelResult = await HttpUtils.request(
      ApiUtils.GET_NOVEL_BY_CLASSIFY_ID, 
      context,
      data: {
        'classify_id': id,
      }
    );

    setState(() {
      novelList = novelResult['data'];     
      selectedClassifyId = id; 
    });
  }

}
