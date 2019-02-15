var api = require('./api.js')

/**
 * edit by dkvirus:
 * 封装 wx 原生请求方法，统一打印响应日志
 */
function request(opts) {
  // 判断 token 是否存在
  var token = wx.getStorageSync('token')
  if (!token) {
    // 请求 token 先
    var username = wx.getStorageSync('openId')
    wx.request({
      url: api.GET_TOKEN,
      method: 'POST',
      data: {
        client_type: 'OPENID',
        username,
      },
      success(res) {
        var token = res.data.data.token
        wx.setStorageSync('token', token)
        request(opts)
      },
    })
  } 
  if (!opts.url) return;
  var { method = 'GET' } = opts
  var { url, data = {} } = handleParam(opts)

  wx.showNavigationBarLoading()
  wx.showLoading()

  return new Promise(function (resolve, reject) {
    wx.request({
      url,
      data,
      method,
      header: {
        Authorization: `Bearer ${token}`,
      },
      success: function (res) {
        console.log(`请求【${method} ${url}】成功，响应数据：%o`, res)
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.code === '0000') {
          resolve(res.data.data)
        } else if (res.data.code === '9999' && res.data.message.indexOf('认证') !== -1) {
          wx.setStorageSync('token', '')
          request(opts).then(function (res2) {
            if (res2.data.code === '0000') {
              resolve(res2.data.data)
            }
          })
        } else {
          reject(res)
        }
      },
      fail: function (res) {
        console.log(`请求【${opts.method} ${url}】失败，响应数据：%o`, res)
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        reject(res)
      },
    })
  })
}

/**
 * edit by dkvirus:
 * 处理 restful 接口，示例：/user/:id/stop/:xx       参数为 { id: '1': xx: '2' }
 * 处理之后返回值    /user/1/stop/2
 */
function handleParam(opts) {
  var { url, data = {} } = opts
  var urlArr = url.split('/')
  var dataCopy = JSON.parse(JSON.stringify(data))
  urlArr = urlArr.map(item => {
    if (item.charAt(0) === ':') {
      var field = String(item).substring(1)
      item = encodeURIComponent(dataCopy[field])
      delete dataCopy[field]
    }
    return item
  })

  url = urlArr.join('/');
  return { url, data: dataCopy };
}

module.exports = {
  request,
}