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
      ['https://www.biquge5200.cc/98_98081/', '兵者', '七品'],
      ['https://www.biquge5200.cc/84_84888/', '超品巫师', '九灯和善'],
      ['https://www.biquge5200.cc/92_92627/', '都市阴阳师', '巫九'],
      ['https://www.biquge5200.cc/63_63758/', '黑客无间道', '我不是黑客'],
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
    this.dbGetHist(openId, function (data) {

      data = data.map(item => item.value)  // 处理数组数据结构
      data = [...new Set(data)]     // 数组去重
      data = data.slice(0, 5)      // 截取前10条
      that.setData({ histList: data })
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
    var that = this
    var inputValue = this.data.inputValue
    request({
      url: api.NOVEL,
      data: { inputValue },
    }).then(function (res) {
      that.setData({ novelList: res })
    })

    // 存入历史表
    this.dbInsertHist({ value: inputValue })
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
    var novelName = e.currentTarget.dataset.novelname
    var authorName = e.currentTarget.dataset.authorname
    wx.navigateTo({
      url: `../intro/intro?novelUrl=${novelUrl}&novelName=${novelName}&authorName=${authorName}`,
    })
  },

  /**
   * 返回查询页首页
   */
  handleBack: function () {
    this.setData({ novelList: [], inputValue: '' })
  },

  /**
   * 清空搜索历史
   */
  handleEmpty: function () {
    var openId = wx.getStorageSync('openId')
    if (!openId) return
    
  },

  /**
   * 插入历史表
   */
  dbInsertHist: function (options) {
    db.collection('hist')
      .add({
        data: options
      })
      .then(res => {
      })
  },

  /**
   * 获取搜索历史
   */
  dbGetHist: function (openId, cb) {
    var that = this
    db.collection('hist')
      .where({
        _openid: openId,
      })
      .get({
        success: function (res) {
          if (typeof cb === 'function') cb(res.data)
        }
      })
  },
})