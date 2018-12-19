var api = require('../../utils/api.js')
var { request } = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
  },

  /**
   * 监听标题变化
   */
  handleChangeTitle: function (e) {
    this.setData({ title: e.detail.value })
  },

  /**
   * 监听内容变化
   */
  handleChangeContent: function (e) {
    this.setData({ content: e.detail.value })
  },

  /**
   * 提交
   */
  handleSubmit: function () {
    var that = this
    var { title, content } = this.data
    var userId = wx.getStorageSync('user_id') || '-1'
 
    if (!title || !content) {
      return wx.showToast({
        title: '标题和内容不能为空',
      })
    }

    request({
      url: api.SEND_FEEDBACK_EMAIL,
      method: 'POST',
      data: { title, content, userId }
    }).then(function (res) {
      that.setData({ title: '', content: '' })
      wx.showToast({
        title: '提交成功',
      })
      wx.switchTab({
        url: '../index/index',
      })
    })
  },

})