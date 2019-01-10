import 'package:flutter/material.dart';

class Read extends StatefulWidget {
  @override
    State<StatefulWidget> createState() {
      return new ReadState();
    }
}

class ReadState extends State {
  @override
  Widget build (BuildContext context) {
    return new Container(
      child: new Text('阅读页面'),
    );
  }
}