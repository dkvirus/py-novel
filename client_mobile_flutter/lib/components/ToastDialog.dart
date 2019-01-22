import 'package:flutter/material.dart';

// ignore: must_be_immutable
class ToastDialog extends Dialog {
  String text;

  ToastDialog({Key key, @required this.text}) : super(key: key);

  @override
  Widget build (BuildContext context) {
    return new Material(
      type: MaterialType.transparency,
      child: Align(
        alignment: Alignment(0.0, 0.8),
        child: Container(
          decoration: ShapeDecoration(
            color: Color(0xffffffff),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.all(
                Radius.circular(8.0),
              ),
            ),
          ),
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
            child: new Text(
              text,
              style: new TextStyle(fontSize: 12.0),
            ),
          ),
        ),
      ),
    );
  }
}