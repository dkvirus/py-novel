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
    openId: '',
    isLoading: false, // 蒙版状态值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ isLoading: true })
    var that = this
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        console.log(res.result)
        that.setData({ openId: res.result })
        wx.setStorageSync('openId', res.result)
        that.handleSearchShelf(res.result)
      }
    })
  },

  onShow: function () {
    var openId = wx.getStorageSync('openId')
    if (!openId) return
    this.handleSearchShelf(openId)
  },

  /**
   * 查询书架里小说
   */
  handleSearchShelf: function (openId) {
    var that = this
    request({
      url: api.GET_SHELF,
      data: { open_id: openId }
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
      that.handleSearchShelf(that.data.openId)
    })
  },

  /**
   * 设置
   */
  handleSetting: function () {
    this.setData({ settingEnable: !this.data.settingEnable })
  },

})