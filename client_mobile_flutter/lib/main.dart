import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import './views/index.dart';
import './views/search.dart';
import './views/intro.dart';
import './views/signin.dart';
import './views/signup.dart';

void main() => runApp(new MyApp());

// 入口
class MyApp extends StatelessWidget {
  
  var userId;

  getUserId () async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    userId = prefs.getInt('userId');		// 取
  }

  @override
  Widget build(BuildContext context) {
    getUserId();
    print(userId);
    Widget entry = new Index();
    if (userId == null) {
      entry = new SigninPage();
    }

    return new MaterialApp(
      title: '公羊阅读',
      theme: new ThemeData(
        primarySwatch: Colors.blue,
      ),
      // home: new MyHomePage(title: 'Flutter Demo Home Page'),
      home: new Index(),
      routes: <String, WidgetBuilder> {
        // 这里可以定义静态路由，不能传递参数
        '/index': (_) => new Index(),
        '/search': (_) => new SearchPage(),
        '/intro': (_) => new IntroPage(),
        '/signin': (_) => new SigninPage(),
        '/signup': (_) => new SignupPage(),
      },
    );
  }
}
