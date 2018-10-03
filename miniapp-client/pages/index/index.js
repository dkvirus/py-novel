wx.cloud.init({ traceUser: true })
var db = wx.cloud.database()

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    novelList: [
      [
        "https://www.biquge5200.cc/98_98081/",
        "兵者",
        "七品"
      ],
      [
        "https://www.biquge5200.cc/2_2041/",
        "兵者为王",
        "七品"
      ],
      [
        "https://www.biquge5200.cc/54_54758/",
        "兵者伐谋",
        "秀发拂钢枪"
      ],
      [
        "https://www.biquge5200.cc/80_80740/",
        "兵者之王",
        "血色弹头"
      ]
    ],
    openId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        that.setData({ 'openId': res.result })
        wx.setStorage({ key: 'openId', data: res.result })
      }
    })
  },

  /**
   * 页面出现加载方法
   */
  onShow: function () {
    var openId = this.data.openId
    this.dbGetShelf(openId)
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
})