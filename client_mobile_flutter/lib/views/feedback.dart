import 'package:flutter/material.dart';

class Feedbacks extends StatefulWidget {
  @override
  State createState() {
    return new FeedbacksState();
  }
}

class FeedbacksState extends State<Feedbacks> {
  Widget build(BuildContext context) {
    final pageController = new TextEditingController();
    final quesController = new TextEditingController();

    return new Scaffold(
        body: new ListView(
          children: <Widget>[
            new Row(
              children: <Widget>[
                new Padding(
                  padding: EdgeInsets.all(15.0),
                  child: new Text('亲爱的用户您好，感谢您的反馈：',
                  style: TextStyle(
                    fontSize: 22.0,
                    fontWeight: FontWeight.bold,
                  ),),
                )
              ],
            ),

            new Container(
              padding: EdgeInsets.all(15.0),
              child: new TextField(
                controller: pageController,
                decoration: new InputDecoration(
                  labelText: '页面',
                  hintText: '哪个页面体验有瑕疵',
                  contentPadding: EdgeInsets.all(10.0),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10.0),
                  )
                ),
              ),
            ),

            new Container(
              padding: EdgeInsets.all(15.0),
              child: new TextField(
                maxLines: 8,
                controller: pageController,
                decoration: new InputDecoration(
                  labelText: '描述',
                  hintText: '描述具体内容',
                  contentPadding: EdgeInsets.all(10.0),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10.0),
                  )
                ),
              ),
            )
          ],
        )
    );
  }
}
