const request = require('request');

function editUser () {
    request({
        url: 'http://localhost:3000/api/test/gysw/user/info/9',
        method: 'put',
        json: true,
        body: {
            "nickname": "大橙子",
            "avatar_url": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL2JDCLUlC2zgicSGdDxWGQ3U2icjdXwiaUep2nl88eOyViarVlZba3HJwld3L1dSJcQXP2rsBHLRy89Q/132",
            "gender": "男性",
            "address": "China、Anhui、MOS",
        }
    }, function (e, r, body) {
        console.log(body);
    })
}

editUser();