import 'package:flutter/material.dart';
import './views/shelf.dart';
import './views/classify.dart';
import './views/feedback.dart';

void main() => runApp(new MyApp());

// 入口
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: '公羊阅读',
      theme: new ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: new MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage>
    with SingleTickerProviderStateMixin {
  TabController controller;

  @override
  void initState() {
    controller = new TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      body: new TabBarView(
          controller: controller,
          children: [new Shelf(), new Classify(), new Feedbacks()]),
      bottomNavigationBar: new Material(
        color: Colors.grey,
        child: new TabBar(controller: controller, tabs: [
          new Tab(
            text: '书架',
            icon: new Icon(Icons.home),
          ),
          new Tab(
            text: '书屋',
            icon: new Icon(Icons.notifications),
          ),
          new Tab(
            text: '反馈',
            icon: new Icon(Icons.cloud),
          )
        ]),
      ),
    );
  }
}
