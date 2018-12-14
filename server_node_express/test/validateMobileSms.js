const request = require('request');

function testValidateMobileSmsCode () {
    request({
        url: 'http://localhost:3000/api/test/gysw/mobile/validate',
        method: 'post',
        json: true,
        body: {
            "code": "483453",
            "userId": 3,
        }
    }, function (e, r, body) {
        console.log(body);
    })
}

testValidateMobileSmsCode();