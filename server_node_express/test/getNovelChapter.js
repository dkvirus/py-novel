const request = require('request');

function getNovelChapter () {
    request({
        url: 'http://localhost:3000/api/test/gysw/novel/chapter?url=https://www.biquge5200.cc/98_98081',
        method: 'get',
    }, function (e, r, body) {
        console.log(body);
    })
}

getNovelChapter()