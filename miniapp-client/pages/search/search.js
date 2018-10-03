var api = require('../../utils/api.js')
var { request } = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    novelList: [],
    recomList: [
      ['https://www.biquge5200.cc/98_98081/', '兵者', '七品']
    ],  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
})