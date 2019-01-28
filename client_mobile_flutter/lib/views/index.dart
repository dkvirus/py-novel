import 'package:flutter/material.dart';
import './shelf.dart';
import './classify.dart';
import './feedback.dart';

class Index extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return IndexState();
  }
}

class IndexState extends State with SingleTickerProviderStateMixin {
  TabController controller;

  @override
  void initState() {
    controller = TabController(length: 3, vsync: this);
    super.initState();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: TabBarView(
        controller: controller,
        children: [ShelfPage(), ClassifyPage(), FeedbackPage()]
      ),
      bottomNavigationBar: Material(
        color: Colors.grey,
        child: TabBar(controller: controller, tabs: [
          Tab(
            icon: Icon(Icons.home),
          ),
          Tab(
            icon: Icon(Icons.notifications),
          ),
          Tab(
            icon: Icon(Icons.cloud),
          )
        ]),
      ),
    );
  }
}
