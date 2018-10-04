var api = require('../../utils/api.js')
var { request } = require('../../utils/request.js')

wx.cloud.init({ traceUser: true })
var db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chapterUrl: '',
    novelUrl: '',
    detail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var chapterUrl = options.chapterUrl
    var novelUrl = chapterUrl.split('/').slice(0, 4).join('/')
    this.setData({ chapterUrl, novelUrl })
    this.dbUpdateShelf(chapterUrl)
  },

  /**
   * 离开页面时触发事件
   */
  onUnload: function () {
    wx.reLaunch({
      url: '../index/index',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var chapterUrl = this.data.chapterUrl
    this.handleGetDetail(chapterUrl)
  },

  /**
   * 查询小说章节详细内容
   */
  handleGetDetail: function (chapterUrl) {
    var that = this
    request({
      url: api.CONTENT,
      data: { chapterUrl },
    }).then(function (res) {
      that.setData({ detail: res, chapterUrl })
      wx.pageScrollTo({ scrollTop: 0 })
    })
  },

  /**
   * 翻页：上一章、下一章
   */
  handlePage: function (e) {
    var chapterUrl = e.currentTarget.dataset.url
    this.handleGetDetail(chapterUrl)
    this.dbUpdateShelf(chapterUrl)
  },

  /**
   * 跳转到目录页面
   */
  handleRedirectChapter: function () {
    var chapterUrl = this.data.chapterUrl
    var arr = chapterUrl.split('/')
    arr = arr.slice(0, arr.length - 1)
    var url = arr.join('/')
    wx.navigateTo({
      url: `../chapter/chapter?url=${url}`,
    })
  },

  /**
   * 返回首页
   */
  handleRedirectIndex: function () {
    wx.reLaunch({
      url: '../index/index',
    })
  },

  /**
   * 更新阅读章节
   */
  dbUpdateShelf: function (chapterUrl) {
    var novelUrl = this.data.novelUrl
    var novelList = wx.getStorageSync('novelList')
    var novel = novelList.find(item => item.chapterUrl.indexOf(novelUrl) !== '-1')

    db.collection('shelf')
      .doc(novel._id).update({
        data: { chapterUrl },
        success: function (res) {
          console.log(res.data)
        }
      })
  },

})