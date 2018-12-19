const request = require('request');

function testSendFeedbackMail () {
    request({
        url: 'http://localhost:3000/api/test/gysw/email/feedback',
        method: 'post',
        json: true,
        body: {
            "title": "测试反馈头内容",
            "content": "测试反馈体内容",
            "userId": 9,
        }
    }, function (e, r, body) {
        console.log(body);
    })
}

testSendFeedbackMail()

