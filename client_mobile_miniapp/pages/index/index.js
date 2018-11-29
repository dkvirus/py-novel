var api = require('../../utils/api.js')
var { request } = require('../../utils/request.js')

wx.cloud.init({ traceUser: true })

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    novelList: [],
    settingEnable: false,
    isLoading: false, // 蒙版状态值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取 openid，继而获取 user_id，通过 user_id 查询书架列表
    this.setData({ isLoading: true })
    var that = this
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        wx.setStorageSync('openId', res.result)

        // 根据 openid 查询 userId
        that.handleSearchUserInfo(res.result)

        // wx.setStorageSync('user_id', 0)
        // that.handleSearchShelf(res.result)
      }
    })
  },

  onShow: function () {
    var userId = wx.getStorageSync('user_id')
    if (!userId) return
    this.handleSearchShelf(userId)
  },

  /**
   * 查询用户信息
   */
  handleSearchUserInfo: function (openId) {
    var that = this
    request({
      url: api.GET_USER_INFO,
      data: { client_type: 'OPENID', username: openId },
    }).then(function (res) {
      if (res.length > 0) {
        wx.setStorageSync('user_id', res[0].id)
        that.handleSearchShelf(res[0].id)
        return;
      }

      // 没有查到用户信息，新增一条用户
      request({
        url: api.ADD_USER_INFO,
        method: 'POST',
        data: { client_type: 'OPENID', username: openId }
      }).then(function (res2) {
        wx.setStorageSync('user_id', res2.insertId)
        that.handleSearchShelf(res2.insertId)
      })
    })
  },

  /**
   * 查询书架里小说
   */
  handleSearchShelf: function (userId) {
    var that = this
    request({
      url: api.GET_SHELF,
      data: { user_id: userId }
    }).then(function (res) {
      that.setData({ novelList: res, isLoading: false, settingEnable: false })
    }).catch(function (err) {
      that.setData({ isLoading: false })
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
    var bookName = e.currentTarget.dataset.bookname
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../read/read?chapterUrl=${chapterUrl}&bookName=${bookName}&novelId=${id}`,
    })
  },

  /**
   * 删除首页书架里的小说
   */
  handleRemoveNovel: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    request({
      url: api.DEL_SHELF,
      method: 'DELETE',
      data: { id },
    }).then(function (res) {
      var userId = wx.getStorageSync('user_id')
      that.handleSearchShelf(userId)
    })
  },

  /**
   * 设置
   */
  handleSetting: function () {
    this.setData({ settingEnable: !this.data.settingEnable })
  },

})