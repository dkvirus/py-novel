const request = require('request');

function testSendMobileSms () {
    request({
        url: 'http://localhost:3000/api/v2/gysw/mobile/code',
        method: 'post',
        json: true,
        body: {
            "mobile": 18056891357,
            "userId": 3,
        }
    }, function (e, r, body) {
        console.log(body);
    })
}

testSendMobileSms()

