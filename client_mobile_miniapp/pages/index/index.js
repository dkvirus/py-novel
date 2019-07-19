var api = require('../../utils/api.js')
var { request } = require('../../utils/request.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    novelList: [],        // 书架小说列表
    settingEnable: false, // 是否编辑状态
    greeting: '',         // 问候语
    userInfo: {},         // 用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.login({
      success (res) {
        if (res.code) {
          request({
            url: api.GET_USER_WXINFO,
            data: { code: res.code },
          }).then(res => {
            var { nickName = '', avatarUrl = '' } = res
            that.setData({ 
              'userInfo.nickName': nickName,
              'userInfo.avatarUrl': avatarUrl,
            })
            wx.setStorageSync('userId', res.userId)
            wx.setStorageSync('openId', res.openId)
            that.handleGetShelfList()
          })
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'none',
          })
        }
      }
    })

    this.handleGreeting()
  },

  /**
   * 页面出现时执行该方法
   * intro 页面点击 "加入书架" 按钮，加入成功之后跳转至 "书架页面"，
   * 此时需要刷新下页面内容
   */
  onShow: function () {
    var userId = wx.getStorageSync('userId')
    if (!userId) return
    this.handleGetShelfList()
  },

  /**
   * 更新用户信息，添加头像和昵称
   */
  handleUpdateUserInfo: function (e) {
    var { avatarUrl, city, country, gender, nickName, province } = e.detail.userInfo
    var address = `${country}、${province}、${city}`
    var genderObj = {
      1: '男性',
      2: '女性',
    }
    gender = genderObj[gender] || '未知'

    // 保存到 data 中
    this.setData({
      'userInfo.nickName': nickName,
      'userInfo.avatarUrl': avatarUrl,
    })

    // 更新到库中
    var userId = wx.getStorageSync('userId')
    if (!userId) return

    request({
      url: api.EDIT_USER_INFO,
      method: 'put',
      data: { 
        user_id: userId,
        nickname: nickName,
        avatar_url: avatarUrl,
        gender,
        address,
      },
    }).then(res => {
      console.log(res)
    })
  },

  /**
   * 查询书架里小说
   */
  handleGetShelfList: function () {
    const userId = wx.getStorageSync('userId')
    if (!userId) return

    request({
      url: api.GET_SHELF,
      data: { user_id: userId }
    }).then(res => {
      this.setData({ novelList: res, settingEnable: false })
    })
  },

  /**
   * 删除首页书架里的小说
   */
  handleRemoveNovel: function (e) {
    var id = e.currentTarget.dataset.id
    request({
      url: api.DEL_SHELF,
      method: 'DELETE',
      data: { id },
    }).then(res => {
      this.handleGetShelfList()
    })
  },

  /**
   * 跳转阅读页面 
   */
  handleGoReadPage: function (e) {
    var { url, bookname, id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../read/read?chapterUrl=${url}&bookName=${bookname}&novelId=${id}`,
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