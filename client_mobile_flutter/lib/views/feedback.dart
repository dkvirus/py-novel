import 'package:flutter/material.dart';

class Feedbacks extends StatefulWidget {
  @override
  State createState() {
    return new FeedbacksState();
  }
}

class FeedbacksState extends State<Feedbacks> {
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: new AppBar(
          title: new Text("书架"),
        ),
        body: new Container(
          child: new Text("书架页面"),
        ));
  }
}
