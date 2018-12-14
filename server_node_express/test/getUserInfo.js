const request = require('request');

function getUserInfo () {
    request({
        url: 'http://localhost:3000/api/test/gysw/user/info?username=18056891357&password=dkvirus2&client_type=MOBILE',
        method: 'get',
    }, function (e, r, body) {
        console.log(body);
    })
}

// {"code":"0000","message":"操作成功","data":[{"id":19,"nickname":""}]}

getUserInfo()