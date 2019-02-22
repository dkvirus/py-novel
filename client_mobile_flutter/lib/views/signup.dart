import 'package:flutter/material.dart';
import 'dart:async';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/ApiUtils.dart';
import '../utils/DialogUtils.dart';
import '../utils/HttpUtils.dart';

class SignupPage extends StatefulWidget {

  @override
  _SignupState createState() => _SignupState();

}

class _SignupState extends State<SignupPage> {
  final _formKey = GlobalKey<FormState>();

  String _mobile, _password, _code;

  /*
   * 密码文本框后面有个小眼睛图标，点击是否显示明文密码
   */
  bool _isObscure = true;   // 标识是否点击了图标
  Color _eyeColor;

  /*
   * 倒计时相关
   */
  final int _initSecond = 60;       // 倒计时开始时时间
  int _seconds = 0;     // 倒计时时间
  String _verifyStr = '获取验证码';     // 验证码文本   60s  50s  40s
  Timer _timer;     // 计时器

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
    _cancelTimer();
  }

  /*
   * 倒计时开始
   */
  _startTimer() {
    _seconds = _initSecond;

    _timer = new Timer.periodic(new Duration(seconds: 1), (timer) {
      if (_seconds == 0) {
        _cancelTimer();
        return;
      }

      _seconds--;
      _verifyStr = '$_seconds(s)重新获取';
      setState(() {});
      if (_seconds == 0) {
        _verifyStr = '重新发送';
      }
    });
  }

  /*
   * 取消计时器
   */
  _cancelTimer() {
    _timer?.cancel();
  }

  @override
  Widget build (BuildContext context) {
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
            _buildMobileTextField(context),        // 手机号文本框
            SizedBox(height: 20.0),
            _buildCheckCodeTextField(context),     // 手机验证码文本框
            SizedBox(height: 20.0),
            _buildPasswordTextField(context),      // 密码文本框
            SizedBox(height: 50.0),
            _buildSignupButton(context),           // 注册按钮
            SizedBox(height: 30.0),
            _buildSigninText(context),             // 登录页面
          ],
        ),
      )
    );
  }

  /*
   * Signup 标题
   */
  Widget _buildTitle() {
    return Padding(
      padding: EdgeInsets.all(8.0),
      child: Text(
        '注册',
        style: TextStyle(fontSize: 42.0),
      ),
    );
  }

  /*
   * Signup 标题下面那一条小黑线 
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
  Widget _buildMobileTextField(BuildContext context) {
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
   * 手机校验码文本框
   */
  Widget _buildCheckCodeTextField (BuildContext context) {
    /**
     * 发送验证码
     */
    Future _handleSendCode () async {
      var emailReg = RegExp(
        '^((13[0-9])|(15[^4])|(166)|(17[0-8])|(18[0-9])|(19[8-9])|(147,145))\\d{8}\$'
      );
      if (!emailReg.hasMatch(_mobile)) {
        DialogUtils.showToastDialog(context, text: '请输入正确的手机号码');
        return;
      }

      var result = await HttpUtils.request(
        ApiUtils.GET_MOBILE_CODE, 
        context, 
        data: {
          'mobile': _mobile, 
        },
        method: HttpUtils.POST
      );

      if (result['code'] == '0000') {
        DialogUtils.showToastDialog(context, text: result['message']);
      }
    }

    /**
     * 验证码文本框
     */
    Widget _buildVerifyCodeTextField () {
      return TextFormField(
        decoration: InputDecoration(
          labelText: '验证码',
        ),
        validator: (String value) {
          _formKey.currentState.save();
          if (_mobile == null) {
            return '手机号不能为空';
          }
          print(value);
          if (value == '') {
            return '验证码不能为空';
          }
        },
        onSaved: (String value) => _code = value,
      );
    }

    /**
     * 发送验证码按钮
     */
    Widget _buildVerifyCodeBtn () { 
      return 
        InkWell(
          onTap: (_seconds == 0)
            ? () {
              _formKey.currentState.save();
              if (_mobile == null) {
                print(_mobile);
                return;
              }
              setState(() {
                _startTimer();
              });
              _handleSendCode();
            } : null,
          child: new Container(
            alignment: Alignment.center,
            width: 100.0,
            height: 36.0,
            decoration: new BoxDecoration(
              border: new Border.all(
                width: 1.0,
                color: Colors.blue,
              ),
            ),
            child: new Text(
              '$_verifyStr',
              style: new TextStyle(fontSize: 14.0),
            ),
          ),
        );
    }

    return new Stack(
      alignment: Alignment.centerRight,
      children: <Widget>[
        _buildVerifyCodeTextField(),
        _buildVerifyCodeBtn(),
        
      ],
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
   * 注册按钮
   */
  Widget _buildSignupButton (BuildContext context) {
    
    /// 注册按钮点击事件
    Future _handleRegisterBtn () async {
      // 先校验是否已注册过，不能重复注册同一个手机号码
      var getUserResult = await HttpUtils.request(
        ApiUtils.GET_USER_INFO, 
        context, 
        data: { 
          'username': _mobile, 
          'password': _password, 
          'client_type': 'MOBILE'
        },
        method: HttpUtils.GET,
      );

      if (getUserResult['code'] == '0000' || (getUserResult['code'] != '0000' && getUserResult['message'] != '请先注册')) {
        DialogUtils.showToastDialog(context, text: '您已注册过，请直接登录');
        return;
      }

      // 先校验手机验证码是否正确
      var mobileCodeResult = await HttpUtils.request(
        ApiUtils.VALIDATE_MOBILE_CODE, 
        context,
        data: {
          'mobile': _mobile,
          'code': _code,
        },
        method: HttpUtils.POST
      );

      if (mobileCodeResult['code'] != '0000') {
        DialogUtils.showToastDialog(context, text: mobileCodeResult['message']);
        return;
      }

      // 正确再新增用户
      var addUserResult = await HttpUtils.request(
        ApiUtils.POST_USER_INFO, 
        context,
        data: {
          'username': _mobile,
          'password': _password,
          'client_type': 'MOBILE',
        },
        method: HttpUtils.POST,
      );

      if (addUserResult['code'] != '0000') {
        DialogUtils.showToastDialog(context, text: addUserResult['message']);
        return;
      }

      // 获取 token
      var tokenResult = await HttpUtils.request(ApiUtils.GET_TOKEN, context,
        data: {
          'username': _mobile, 
          'password': _password, 
          'client_type': 'MOBILE'
        },
        method: HttpUtils.POST,
      );

      DialogUtils.showToastDialog(context, text: '注册成功，即将跳转到首页');

      // 本地保存用户 userId、username 和 password
      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setInt('userId', addUserResult['data']['id']);   // 存
      await prefs.setString('username', _mobile);
      await prefs.setString('password', _password);
      await prefs.setString('token', tokenResult['data']['token']);

      // 跳转首页
      Navigator.of(context).pushNamedAndRemoveUntil('/index', ModalRoute.withName('/index'));

    }

    return Align(
      child: SizedBox(
        height: 45.0,
        width: 270.0,
        child: RaisedButton(
          child: Text(
            '去注册',
            style: Theme.of(context).primaryTextTheme.headline,
          ),
          color: Colors.black,
          onPressed: () {
            if (_formKey.currentState.validate()) {
              ///只有输入的内容符合要求通过才会到达此处
              _formKey.currentState.save();

              _handleRegisterBtn();
            }
          },
          shape: StadiumBorder(side: BorderSide()),
        ),
      ),
    );
  }

  /*
   * 已有账户，去登录按钮
   */
  Widget _buildSigninText (BuildContext context) {
    return Align(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Text('已有账户？'),
          GestureDetector(
            child: Text(
              '点击登录',
              style: TextStyle(color: Colors.green),
            ),
            onTap: () {
              Navigator.of(context).pushNamedAndRemoveUntil('/signin', ModalRoute.withName('/signin'));
            },
          )
        ],
      ))
    ;
  }
}
