import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/HttpUtils.dart';
import '../utils/ApiUtils.dart';
import '../utils/DialogUtils.dart';

class FeedbackPage extends StatefulWidget {
  @override
  _FeedbackState createState() => _FeedbackState();
}

class _FeedbackState extends State<FeedbackPage> {
  final _formKey = GlobalKey<FormState>();

  String _title, _content;   // 反馈标题、内容

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Form(
          key: _formKey,
          child: ListView(
            padding: EdgeInsets.symmetric(horizontal: 22.0),
            children: <Widget>[
              SizedBox(
                height: kToolbarHeight, // appbar 高度
              ),
              _buildWelText(context),
              SizedBox(height: 30.0),
              _buildTitleTextField(context),               // 手机号文本框
              SizedBox(height: 10.0),
              _buildContentTextField(context),      // 密码文本框
              SizedBox(height: 40.0),
              _buildSendButton(context),           // 登录按钮
            ],
          ),
        ),
    );
  }

  /* 
   * 欢迎文字
   */
  Widget _buildWelText (BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(15.0),
      child: Text('亲爱的用户您好，感谢您的反馈：',
      style: TextStyle(
        fontSize: 22.0,
        fontWeight: FontWeight.bold,
      ),),
    );
  }

  /*
   * 标题文本框 
   */
  Widget _buildTitleTextField (BuildContext context) {
    return Container(
      padding: EdgeInsets.all(15.0),
      child: TextFormField(
        decoration: InputDecoration(
          labelText: '标题',
          hintText: '哪个页面体验有瑕疵',
          fillColor: Colors.blue.shade100, 
          filled: true,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(15.0),
          )
        ),
        validator: (String value) {
          if (value == '' || value == null) {
            return '标题不能为空';
          }
        },
        onSaved: (String value) => _title = value,
      ),
    );
  }

  /*
   * 内容文本框 
   */
  Widget _buildContentTextField (BuildContext context) {
    return Container(
      padding: EdgeInsets.all(15.0),
      child: TextFormField(
        maxLines: 8,
        decoration: InputDecoration(
          labelText: '内容',
          hintText: '描述具体内容',
          fillColor: Colors.blue.shade100, 
          filled: true,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(15.0),
          )
        ),
        validator: (String value) {
          if (value == '' || value == null) {
            return '内容不能为空';
          }
        },
        onSaved: (String value) => _content = value,
      ),
    );
  }

  /*
   * 发送按钮 
   */
  Widget _buildSendButton (BuildContext context) {
    return Center(
      child: RaisedButton(
        child: Text('发送邮件'),
        onPressed: () {
          if (_formKey.currentState.validate()) {
              ///只有输入的内容符合要求通过才会到达此处
              _formKey.currentState.save();
              _handleSendFeedback(context);
            }
        },
      ),
    );
  } 

  /*
   * 处理返送按钮 
   */
  _handleSendFeedback (BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    int userId = prefs.getInt('userId') ?? -1;   // 取

    if (userId == -1) {
      // 跳转登录页面
      Navigator.of(context).pushNamedAndRemoveUntil('/signin', ModalRoute.withName('/signin'));
      return;
    }

    var result = await HttpUtils.request(
      ApiUtils.SEND_FEEDBACK, 
      context,
      method: HttpUtils.POST,
      data: {
        'userId': userId,
        'title': _title,
        'content': _content,
      },
    );

    if (result['code'] == '0000') {
      DialogUtils.showToastDialog(context, text: result['message']);
    }
  }
}
