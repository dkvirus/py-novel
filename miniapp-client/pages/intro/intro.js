var api = require('../../utils/api.js')
var { request } = require('../../utils/request.js')

wx.cloud.init({ traceUser: true })
var db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    novelUrl: 'https://www.biquge5200.cc/98_98081/',
    novelName: '兵者',
    authorName: '七品',
    chapterList: [],
    chapterUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var { novelUrl, novelName, authorName } = options
    this.setData({ novelUrl, novelName, authorName })
  },

  /**
   * 页面出现加载方法
   */
  onShow: function () {
    var novelUrl = this.data.novelUrl
    this.handleGetChapter(novelUrl)
  },

  /**
   * 请求目录结构
   */
  handleGetChapter: function (url) {
    var that = this
    request({
      url: api.CHAPTER,
      data: { novelUrl: url }
    }).then(function (res) {
      that.setData({ chapterList: res, chapterUrl: res[0][0] })
    })  
  },

  /**
   * 处理加入书架
   */
  handleJoinShelf: function () {
    var that = this
    var openId = wx.getStorageSync('openId')
    if (!openId) return
    var { novelUrl, novelName, authorName, chapterUrl } = this.data

    this.dbGetShelf(openId, function (novelList) {
      novelList = novelList.filter(item => {
        return item.novelName === novelName && item.authorName === authorName
      })
      if (novelList.length > 0) {
        wx.showToast({
          title: '已加入书架',
        })
        return
      }

      that.dbInsertShelf({ novelUrl, novelName, authorName, chapterUrl, openId })
    })
  },

  /**
   * 插入数据都书架表
   */
  dbInsertShelf: function (options) {
    db.collection('shelf')
      .add({
        data: options
      })
      .then(res => {
        wx.showToast({
          title: '加入书架成功',
        })
        wx.navigateTo({
          url: '../index/index',
        })
      })
  },

  /**
   * 查询书架内容
   */
  dbGetShelf: function (openId, cb) {
    var that = this
    db.collection('shelf').where({
      _openid: openId,
    })
      .get({
        success: function (res) {
          cb(res.data)
        }
      })
  }
})