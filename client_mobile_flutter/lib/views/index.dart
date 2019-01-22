import 'package:flutter/material.dart';
import './shelf.dart';
import './classify.dart';
import './feedback.dart';

class Index extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return new IndexState();
  }
}

class IndexState extends State with SingleTickerProviderStateMixin {
  TabController controller;

  @override
  void initState() {
    controller = new TabController(length: 3, vsync: this);
    super.initState();
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
          children: [new ShelfPage(), new Classify(), new Feedbacks()]),
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
