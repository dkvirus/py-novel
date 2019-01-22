import 'package:flutter/material.dart';
import 'dart:async';
import '../components/ToastDialog.dart';
import '../components/LoadingDialog.dart';

class DialogUtils {

  /// 显示文字对话框
  static showToastDialog (context, { text, duration }) {
    showDialog<Null>(
      context: context,   // BuildContext对象
      barrierDismissible: false,
      builder: (BuildContext context) {
        return ToastDialog( // 调用对话框
          text: text ?? '操作成功',
        );
    });
    // 定时器关闭对话框
    new Timer(new Duration(milliseconds: duration ?? 1500), () {
      closeLoadingDialog(context);
    });
  }

  // 显示加载对话框
  static showLoadingDialog (context, { text }) {
    showDialog<Null>(
        context: context,   // BuildContext对象
        barrierDismissible: false,
        builder: (BuildContext context) {
          return LoadingDialog( // 调用对话框
              text: text ?? '加载中...',
          );
      });
  }

  // 关闭加载对话框
  static closeLoadingDialog (context) {
    Navigator.pop(context);
  }

}