import 'package:flutter/material.dart';

class Classify extends StatefulWidget {
  @override
  State createState() {
    return new ClassifyState();
  }
}

class ClassifyState extends State<Classify> {
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: new AppBar(
          title: new Text("分类"),
        ),
        body: new Container(
          child: new Text("分类页面"),
        ));
  }
}
