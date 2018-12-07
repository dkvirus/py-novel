const request = require('request');

function testValidateCode () {
    request({
        url: 'http://localhost:3000/api/v2/gysw/email/validate',
        method: 'post',
        json: true,
        body: {
            "code": "413302",
            "userId": 3,
        }
    }, function (e, r, body) {
        console.log(body);
    })
}

testValidateCode();