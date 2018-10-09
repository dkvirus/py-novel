wx.cloud.init({ traceUser: true })
var db = wx.cloud.database()

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    novelList: [],
    openId: '',
    settingEnable: false,
    userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 页面出现加载方法
   */
  onShow: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        that.setData({ 'openId': res.result })
        that.dbGetShelf(res.result)
        that.handleSearchUserinfo(res.result)
        wx.setStorageSync('openId', res.result)
      }
    })
  },

  /**
   * 根据 openId 查询用户信息
   */
  handleSearchUserinfo: function (openId) {
    var that = this
    db.collection('user')
      .where({
        _openid: openId,
      })
      .get({
        success: function (res) {
          var userInfo = res.data[0]
          that.setData({ userInfo: userInfo })
        }
      })
  },

  /**
   * 跳转查询页面 
   */
  handleRedirectSearch: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  },

  /**
   * 跳转阅读页面 
   */
  handleRedirectRead: function (e) {
    var chapterUrl = e.currentTarget.dataset.url

    wx.navigateTo({
      url: `../read/read?chapterUrl=${chapterUrl}`,
    })
  },

  /**
   * 删除首页书架里的小说
   */
  handleRemoveNovel: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    this.dbRemoveShelf(id, function () {
      wx.showToast({
        title: '小说删除成功',
      })
      var openId = that.data.openId
      that.handleSetting()
      that.dbGetShelf(openId)
    })
  },

  /**
   * 设置
   */
  handleSetting: function () {
    this.setData({ settingEnable: !this.data.settingEnable })
  },

  /**
   * 保存用户信息
   */
  handleUserinfo: function (res) {
    var userInfo = res.detail.userInfo
    this.setData({ userInfo })
    userInfo.openId = this.data.openId
    // 保存数据库
    db.collection('user')
      .add({
        data: userInfo
      })
      .then(res => {
      })
  },

  /**
   * 查询书架信息
   */
  dbGetShelf: function (openId) {
    var that = this
    db.collection('shelf')
      .where({
        _openid: openId,
      })
      .get({
        success: function (res) {
          var shelf = res.data
          that.setData({ novelList: shelf })
          wx.setStorageSync('novelList', shelf)
        }
      })
  },

  /**
   * 删除小说
   */
  dbRemoveShelf: function (id, cb) {
    db.collection('shelf').doc(id).remove({
      success: function (res) {
        if (typeof cb === 'function') cb(res) 
      }
    })
  },
})