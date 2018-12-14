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
    greeting: '早上好',    // 问候语
    isLoading: false,     // 蒙版状态值
    userInfo: {           // 用户信息
      id: 0,
      nickname: '',
      avatar_url: '',
      gender: '',
      address: '',
    },     
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
      }
    })
    this.handleGreeting()
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
      console.log(res)
      if (res.id) {
        wx.setStorageSync('user_id', res.id)
        that.setData({ userInfo: res })
        that.handleSearchShelf(res.id)
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
   * 获取用户信息
   */
  handleUpdateUserInfo: function (e) {
    var { avatarUrl, city, country, gender, nickName, province } = e.detail.userInfo
    var address = `${country}、${province}、${city}`
    if (gender === 1) {
      gender = '男性'
    } else if (gender === 2) {
      gender = '女性'
    } else {
      gender = '未知'
    }
    this.setData({ 
      'userInfo.nickname': nickName,
      'userInfo.avatar_url': avatarUrl,
      'userInfo.gender': gender,
      'userInfo.address': address,   
    })

    var userId = wx.getStorageSync('user_id')
    if (!userId) return
    var userInfo = this.data.userInfo

    request({
      url: api.EDIT_USER_INFO,
      method: 'put',
      data: { user_id: userId, ...userInfo },
    }).then(function (res) {
      console.log(res)
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

  /**
   * 自动处理问候语
   */
  handleGreeting: function () {
    var hour = new Date().getHours()
    var greeting = ''
    
    if (hour < 6) { greeting = '凌晨好！' }
    else if (hour < 9) { greeting = '早上好！' }
    else if (hour < 12) { greeting = '上午好！' }
    else if (hour < 14) { greeting = '中午好！' }
    else if (hour < 17) { greeting = '下午好！' }
    else if (hour < 19) { greeting = '傍晚好！' }
    else if (hour < 22) { greeting = '晚上好！' }
    else { greeting = '夜里好！' }

    this.setData({ greeting }) 
  },

})