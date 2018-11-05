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
    bookName: '兵者',
    authorName: '七品',
    chapterList: [],
    chapterUrl: '',
    isLoading: false,     // 蒙版状态值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var { novelUrl, bookName, authorName } = options
    this.setData({ novelUrl, bookName, authorName, isLoading: true })
    this.handleSearchChapter(novelUrl)
  },

  /**
   * 请求目录结构
   */
  handleSearchChapter: function (url) {
    var that = this
    request({
      url: api.GET_CHAPTER,
      data: { url }
    }).then(function (res) {
      that.setData({ chapterList: res, chapterUrl: res[0].url, isLoading: false })
    })  
  },

  /**
   * 处理加入书架
   */
  handleJoinShelf: function () {
    var that = this
    var openId = wx.getStorageSync('openId')
    if (!openId) return
    var { novelUrl, bookName, authorName, chapterUrl } = this.data

    request({
      url: api.GET_SHELF,
      data: {
        open_id: openId,
        book_name: bookName,
        author_name: authorName,
      }
    }).then(function (res) {
      console.log('res is %o', res)
      if (res.length > 0) {
        wx.showToast({
          title: '已加入书架',
        })
        return  
      }

      request({
        url: api.ADD_SHELF,
        method: 'POST',
        data: {
          open_id: openId,
          book_name: bookName,
          author_name: authorName,
          chapter_url: chapterUrl,
        }
      }).then(function (res2) {
        wx.showToast({
          title: '加入书架成功',
        })
        wx.switchTab({
          url: '../index/index' 
        })
      })
    })
  },

  handleBack: function () {
    wx.navigateBack()
  },
})