/**
 * edit by dkvirus:
 * 封装 wx 原生请求方法，统一打印响应日志
 */
function request(opts) {
  wx.showNavigationBarLoading()
  wx.showLoading()
  if (!opts.url) return;
  opts.method = opts.method || 'GET'
  opts.data = opts.data || {}
  var { url, data } = handleParam(opts)

  return new Promise(function (resolve, reject) {
    wx.request({
      url,
      data,
      method: opts.method,
      success: function (res) {
        console.log(`请求【${opts.method} ${url}】成功，响应数据：%o`, res)
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.code === '0000') {
          resolve(res.data.data)
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
  var urlArr = opts.url.split('/')
  var data = JSON.parse(JSON.stringify(opts.data))
  urlArr = urlArr.map(item => {
    if (item.charAt(0) === ':') {
      var field = String(item).substring(1)
      item = encodeURIComponent(data[field])
      delete data[field]
    }
    return item
  })

  var url = urlArr.join('/');
  return { url, data };
}

module.exports = {
  request,
}