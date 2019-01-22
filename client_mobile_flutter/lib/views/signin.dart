import 'package:flutter/material.dart';
// import 'package:groovin_material_icons/groovin_material_icons.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/HttpUtils.dart';
import '../utils/ApiUtils.dart';
import '../utils/DialogUtils.dart';

/*
 * 登录页来源：https://blog.csdn.net/u011272795/article/details/83043932 
 */

class SigninPage extends StatefulWidget {
  @override
  _SigninPageState createState() => _SigninPageState();
}

class _SigninPageState extends State<SigninPage> {
  final _formKey = GlobalKey<FormState>();
  
  // 表单元素：手机号、密码
  String _mobile, _password;
  
  // 密码文本框后面有个小眼睛图标，点击是否显示明文密码
  bool _isObscure = true;   // 标识是否点击了图标
  Color _eyeColor;
  
  // 其它登录方式
  // List _SigninMethod = [
  //   {
  //     "title": "qq",
  //     "icon": GroovinMaterialIcons.qqchat,
  //   },
  //   {
  //     "title": "微信",
  //     "icon": GroovinMaterialIcons.wechat,
  //   }
  // ];

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
            _buildTitle(),                         // 标题
            _buildTitleLine(),                     // 标题下面横线
            SizedBox(height: 70.0),
            _buildMobileTextField(),               // 手机号文本框
            SizedBox(height: 30.0),
            _buildPasswordTextField(context),      // 密码文本框
            _buildForgetPasswordText(context),     // 忘记密码按钮
            SizedBox(height: 60.0),
            _buildSigninButton(context),           // 登录按钮
            SizedBox(height: 30.0),
            // _buildOtherSigninText(),               // 其它登录文本
            // _buildOtherMethod(context),            // 其它登录方法
            _buildRegisterText(context),           // 去注册按钮
          ],
        )
      )
    );
  }

  /*
   * Signin 标题
   */
  Widget _buildTitle() {
    return Padding(
      padding: EdgeInsets.all(8.0),
      child: Text(
        '登录',
        style: TextStyle(fontSize: 42.0),
      ),
    );
  }

  /*
   * Signin 标题下面那一条小黑线 
   */
  Widget _buildTitleLine() {
    return Padding(
      padding: EdgeInsets.only(left: 12.0, top: 4.0),
      child: Align(
        alignment: Alignment.bottomLeft,
        child: Container(
          color: Colors.black,
          width: 40.0,
          height: 2.0,
        ),
      ),
    );
  }

  /*
   * 手机号文本框
   */
  Widget _buildMobileTextField() {
    return TextFormField(
      decoration: InputDecoration(
        labelText: '手机号',
      ),
      validator: (String value) {
        var emailReg = RegExp(
          '^((13[0-9])|(15[^4])|(166)|(17[0-8])|(18[0-9])|(19[8-9])|(147,145))\\d{8}\$'
        );
        if (!emailReg.hasMatch(value)) {
          return '请输入正确的手机号码';
        }
      },
      onSaved: (String value) => _mobile = value,
    );
  }

  /*
   * 密码文本框
   */
  Widget _buildPasswordTextField(BuildContext context) {
    return TextFormField(
      onSaved: (String value) => _password = value,
      obscureText: _isObscure,    // obscure 是模糊，看不清的意思，这里表示密文
      validator: (String value) {
        if (value.isEmpty) {
          return '请输入密码';
        }
      },
      decoration: InputDecoration(
          labelText: '密码',
          suffixIcon: IconButton(
              icon: Icon(
                Icons.remove_red_eye,
                color: _eyeColor,
              ),
              onPressed: () {
                setState(() {
                  _isObscure = !_isObscure;
                  _eyeColor = _isObscure
                      ? Colors.grey
                      : Theme.of(context).iconTheme.color;
                });
              })),
    );
  }

  /*
   * 忘记密码
   */
  Widget _buildForgetPasswordText(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 8.0),
      child: Align(
        alignment: Alignment.centerRight,
        child: FlatButton(
          child: Text(
            '忘记密码？',
            style: TextStyle(fontSize: 14.0, color: Colors.grey),
          ),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
    );
  }

  /*
   * 构建登录按钮
   */
  Widget _buildSigninButton(BuildContext context) {
    return Align(
      child: SizedBox(
        height: 45.0,
        width: 270.0,
        child: RaisedButton(
          child: Text(
            '去登录',
            style: Theme.of(context).primaryTextTheme.headline,
          ),
          color: Colors.black,
          onPressed: () {
            if (_formKey.currentState.validate()) {
              ///只有输入的内容符合要求通过才会到达此处
              _formKey.currentState.save();
              _handleSignin(context);
            }
          },
          shape: StadiumBorder(side: BorderSide()),
        ),
      ),
    );
  }

  /*
   * 其它方式登录文本 
   */
  // Align _buildOtherSigninText() {
  //   return Align(
  //       alignment: Alignment.center,
  //       child: Text(
  //         '其他账号登录',
  //         style: TextStyle(color: Colors.grey, fontSize: 14.0),
  //       ));
  // }

  /*
   * 其它方式登录方法
   */
  // ButtonBar _buildOtherMethod(BuildContext context) {
  //   return ButtonBar(
  //     alignment: MainAxisAlignment.center,
  //     children: _SigninMethod
  //         .map((item) => Builder(
  //               builder: (context) {
  //                 return IconButton(
  //                     icon: Icon(item['icon'],
  //                         color: Theme.of(context).iconTheme.color),
  //                     onPressed: () {
  //                       //TODO : 第三方登录方法
  //                       Scaffold.of(context).showSnackBar(new SnackBar(
  //                         content: new Text("${item['title']}登录"),
  //                         action: new SnackBarAction(
  //                           label: "取消",
  //                           onPressed: () {},
  //                         ),
  //                       ));
  //                     });
  //               },
  //             ))
  //         .toList(),
  //   );
  // }

  /*
   * 去注册按钮
   */
  Widget _buildRegisterText(BuildContext context) {
    return Align(
      alignment: Alignment.center,
      child: Padding(
        padding: EdgeInsets.only(top: 10.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text('没有账号？'),
            GestureDetector(
              child: Text(
                '点击注册',
                style: TextStyle(color: Colors.green),
              ),
              onTap: () {
                Navigator.of(context).pushNamedAndRemoveUntil('/signup', ModalRoute.withName('/signup'));
              },
            ),
          ],
        ),
      ),
    );
  }

  /*
   * 处理登录逻辑，登录成功跳转到首页
   */
  _handleSignin (BuildContext context) async {
    var result = await HttpUtils.request(ApiUtils.GET_USER_INFO, context, 
      data: { 
        'username': _mobile, 
        'password': _password, 
        'client_type': 'MOBILE'
      },
      method: HttpUtils.GET,
    );

    if (result['code'] != '0000') {
      DialogUtils.showToastDialog(context, text: result['message'], duration: 1500);
      return;
    }

    // 登录成功，保存 userId、username 和 password
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setInt('userId', result['data']['id']);   // 存
    await prefs.setString('username', _mobile);
    await prefs.setString('password', _password);

    // 跳转首页
    Navigator.of(context).pushNamedAndRemoveUntil('/index', ModalRoute.withName('/index'));

  }
}