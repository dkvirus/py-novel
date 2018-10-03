var api = require('../../utils/api.js')
var { request } = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    chapterList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = options.url
    console.log(url)
    this.setData({ url })
  },

  /**
   * 页面显示加载方法
   */
  onShow: function () {
    var url = this.data.url || ''
    if (!url) return
    this.handleGetChapter(url)
  },

  /**
   * 获取目录
   */
  handleGetChapter: function (url) {
    var that = this
    request({
      url: api.CHAPTER,
      data: { novelUrl: url }
    }).then(function (res) {
      that.setData({ chapterList: res })
    })  
  },

  /**
   * 跳转阅读页面
   */
  handleRedirectRead: function (e) {
    var chapterUrl = e.currentTarget.dataset.url

    wx.redirectTo({
      url: `../read/read?chapterUrl=${chapterUrl}`,
    })
  },
})