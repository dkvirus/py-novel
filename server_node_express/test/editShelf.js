const request = require('request');

function editShelf () {
    request({
        url: 'http://localhost:3000/api/test/gysw/shelf/39',
        method: 'put',
        json: true,
        body: {
            "recent_chapter_url": "https://www.biquge5200.cc/0_9/3365.html",
        }
    }, function (e, r, body) {
        console.log(body);
    })
}

editShelf();

/**
 * { code: '0000',
  message: '操作成功',
  data:
   { fieldCount: 0,
     affectedRows: 1,
     insertId: 0,
     serverStatus: 2,
     warningCount: 0,
     message: '(Rows matched: 1  Changed: 1  Warnings: 0',
     protocol41: true,
     changedRows: 1 } }
 */