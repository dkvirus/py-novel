var api = require('../../utils/api.js')
var { request } = require('../../utils/request.js')

wx.cloud.init({ traceUser: true })
var db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',       // 搜索框值
    novelList: [],        // 搜索结果
    hotList: [
      {
        "keyword": "都市阴阳师",
        "times": 5
      },
      {
        "keyword": "西红柿",
        "times": 6
      },
      {
        "keyword": "巫九",
        "times": 1
      },
      {
        "keyword": "兵者",
        "times": 1
      },
      {
        "keyword": "七品",
        "times": 1
      }
    ],          // 热门搜索  
    histList: [
      {
        "keyword": "西红柿"
      },
      {
        "keyword": "巫九"
      },
      {
        "keyword": "七品"
      },
      {
        "keyword": "兵者"
      }
    ],         // 搜索历史
    isLoading: false,      // 蒙版状态值 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleSearchHot()
    this.handleSearchHist()
  },

  /**
   * 查询热门搜索
   */
  handleSearchHot: function () {
    this.setData({ isLoading: true })
    var that = this
    request({
      url: api.GET_SEARCH_HOT,
    }).then(function (res) {
      if (res.data && res.data.length === 0) {
        return wx.showToast({
          title: '没有找到小说！',
        })
      }
      that.setData({ hotList: res, isLoading: false })      
    })
  },

  /**
   * 查询历史搜索
   */
  handleSearchHist: function () {
    var that = this
    var userId = wx.getStorageSync('user_id')
    request({
      url: api.GET_SEARCH_HIST,
      data: { user_id: userId },
    }).then(function (res) {
      that.setData({ histList: res })
    })
  },

  /**
   * 处理文本框值变化
   */
  handleInputChange: function (e) {
    var value = e.detail.value
    this.setData({ inputValue: value })
  },

  /**
   * 查询小说
   */
  handleSearchNovel: function () {
    this.setData({ isLoading: true })
    var that = this
    var inputValue = this.data.inputValue
    var userId = wx.getStorageSync('user_id')
    if (!inputValue) {
      wx.showToast({
        title: '请输入内容',
      })
      return
    }

    request({
      url: api.GET_SEARCH_NOVEL,
      data: { keyword: inputValue },
    }).then(function (res) {
      if (res && res.length === 0) {
        that.setData({ isLoading: false })
        return wx.showToast({
          title: '没有找到小说！',
        })
      }
      that.setData({ novelList: res, isLoading: false })

      request({
        url: api.ADD_SEARCH_HIST,
        method: 'POST',
        data: { user_id: userId, keyword: inputValue }
      })
    })
  },

  /**
   * 关键字查询
   */
  handleSearchKeyword: function (e) {
    var keyword = e.currentTarget.dataset.keyword
    this.setData({ inputValue: keyword })
    this.handleSearchNovel()
  },

  /**
   * 跳转小说介绍页面
   */
  handleRedirectIntro: function (e) {
    var novelUrl = e.currentTarget.dataset.url
    var bookName = e.currentTarget.dataset.bookname
    var authorName = e.currentTarget.dataset.authorname
    wx.navigateTo({
      url: `../intro/intro?novelUrl=${novelUrl}&bookName=${bookName}&authorName=${authorName}`,
    })
  },

  /**
   * 返回查询页首页
   */
  handleBackSearch: function () {
    this.setData({ novelList: [], inputValue: '' })
  },

  /**
   * 返回我的书架页面
   */
  handleBackShelf: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
})