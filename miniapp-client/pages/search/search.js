var api = require('../../utils/api.js')
var { request } = require('../../utils/request.js')

wx.cloud.init({ traceUser: true })
var db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    novelList: [],
    recomList: [
      {
        url: 'https://www.biquge5200.cc/98_98081/',
        book_name: '兵者',
        author_name: '七品',
      },
      {
        url: 'https://www.biquge5200.cc/84_84888/',
        book_name: '超品巫师',
        author_name: '九灯和善',
      },
      {
        url: 'https://www.biquge5200.cc/92_92627/',
        book_name: '都市阴阳师',
        author_name: '巫九',
      },
      {
        url: 'https://www.biquge5200.cc/63_63758/',
        book_name: '黑客无间道',
        author_name: '我不是黑客',
      },
    ],  
    histList: [   // 搜索历史
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 页面出现加载数据
   */
  onShow: function () {
    var that = this
    var openId = wx.getStorageSync('openId')
    if (!openId) return
    // this.dbGetHist(openId, function (data) {

    //   data = data.map(item => item.value)  // 处理数组数据结构
    //   data = [...new Set(data)]     // 数组去重
    //   data = data.slice(0, 5)      // 截取前10条
    //   that.setData({ histList: data })
    // })
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
    var that = this
    var inputValue = this.data.inputValue
    if (!inputValue) {
      wx.showToast({
        title: '请输入内容',
      })
      return
    }

    request({
      url: api.GET_NOVEL,
      data: { keyword: inputValue },
    }).then(function (res) {
      that.setData({ novelList: res })
    })

    // 存入历史表
    // this.dbInsertHist({ value: inputValue })
  },

  /**
   * 搜索历史
   */
  handleSearchHist: function (e) {
    var value = e.currentTarget.dataset.value
    this.setData({ inputValue: value })
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