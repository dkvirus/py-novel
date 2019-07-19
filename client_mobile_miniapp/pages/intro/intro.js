var api = require('../../utils/api.js')
var { request } = require('../../utils/request.js')

wx.cloud.init({ traceUser: true })

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookName: '',
    authorName: '',
    classifyName: '',
    lastUpdateAt: '',
    bookDesc: '',
    bookCoverUrl: 'https://novel.dkvirus.top/images/cover.png',
    recentChapterUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var { novelUrl = '' } = options
    this.handleGetNovelDetail(novelUrl)
  },

  /**
   * 请求小说详情
   */
  handleGetNovelDetail: function (url) {
    var that = this
    request({
      url: api.GET_NOVEL_INTRO,
      data: { url }
    }).then(res => {
      if (!res.recent_chapter_url) {
        wx.showToast({
          title: '网络波动',
          icon: 'none',
        })
        this.handleGetNovelDetail(url)
        return
      }

      this.setData({
        bookName: res.book_name,
        authorName: res.author_name,
        classifyName: res.classify_name,
        lastUpdateAt: res.last_update_at,
        bookDesc: res.book_desc,
        recentChapterUrl: res.recent_chapter_url,
      })
    })
  },

  /**
   * 处理加入书架
   */
  handleJoinShelf: function () {
    var userId = wx.getStorageSync('userId')
    const { bookName, authorName, bookDesc, bookCoverUrl, recentChapterUrl } = this.data

    request({
      url: api.GET_SHELF,
      data: {
        user_id: userId,
        book_name: bookName,
        author_name: authorName,
      }
    }).then(res => {
      if (res.length > 0) {
        wx.showToast({
          title: '已加入书架',
          icon: 'none',
        })
        return  
      }

      request({
        url: api.ADD_SHELF,
        method: 'POST',
        data: {
          user_id: userId,
          book_name: bookName,
          author_name: authorName,
          book_desc: bookDesc,
          book_cover_url: bookCoverUrl,
          recent_chapter_url: recentChapterUrl,
        }
      }).then(res => {
        wx.switchTab({
          url: '../index/index' 
        })
      })
    })
  },

  /**
   * 返回上一个页面
   */
  handleBack: function () {
    wx.navigateBack()
  },
})