import 'package:flutter/material.dart';

class Index extends StatelessWidget {
  Index(){

  }

  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: '书架',
      theme: new ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: new Text("书架页面"),
    );
  }
}