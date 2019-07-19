var api = require('../../utils/api.js')
var { request } = require('../../utils/request.js')

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleGetHotList()
    this.handleGetHistList()
  },

  /**
   * 查询热门搜索
   */
  handleGetHotList: function () {
    request({
      url: api.GET_SEARCH_HOT,
    }).then(res => {
      this.setData({ hotList: res })      
    })
  },

  /**
   * 查询历史搜索
   */
  handleGetHistList: function () {
    var userId = wx.getStorageSync('userId')
    if (!userId) return

    request({
      url: api.GET_SEARCH_HIST,
      data: { user_id: userId },
    }).then(res => {
      this.setData({ histList: res })
    })
  },

  /**
   * 文本框值变化监听函数
   */
  handleInputChange: function (e) {
    var value = e.detail.value
    if (!value) {
      this.setData({ novelList: [], inputValue: '' })
    } else {
      this.setData({ inputValue: value })
    }
  },

  /**
   * 查询小说列表
   */
  handleGetNovelList: function () {
    var inputValue = this.data.inputValue
    var userId = wx.getStorageSync('userId')
    if (!inputValue) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
      })
      return
    }

    request({
      url: api.GET_SEARCH_NOVEL,
      data: { keyword: inputValue },
    }).then(res => {
      if (res && res.length === 0) {
        wx.showToast({
          title: '没有找到小说！',
          icon: 'none',
        })
        return
      }
      this.setData({ novelList: res })

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
  handleClickKeyword: function (e) {
    var { keyword } = e.currentTarget.dataset
    this.setData({ inputValue: keyword })
    this.handleGetNovelList()
  },

  /**
   * 跳转小说介绍页面
   */
  handleGoIntroPage: function (e) {
    var { url } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../intro/intro?novelUrl=${url}`,
    })
  },

  /**
   * 返回上一个页面
   */
  handleBack: function () {
    wx.navigateBack()
  },
})