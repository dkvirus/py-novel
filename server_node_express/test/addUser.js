const request = require('request');

function testSendMail () {
    request({
        url: 'http://localhost:3000/api/test/gysw/user/info',
        method: 'post',
        json: true,
        body: {
            "client_type": "MOBILE",
            "username": "18056891357",
            "password": "dkvirus",
        }
    }, function (e, r, body) {
        console.log(body);
    })
}

testSendMail()