const request = require('request');

function testSendMail () {
    request({
        url: 'http://localhost:3000/api/v2/gysw/email/code',
        method: 'post',
        json: true,
        body: {
            "email": "me@dkvirus.com",
            "userId": 1,
        }
    }, function (e, r, body) {
        console.log(body);
    })
}

testSendMail()

