var api = require('../../utils/api.js')
var { request } = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyList: [],
    selectedClassify: '',
    novelList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 页面出现加载事件
   */
  onShow: function () {
    this.handleSearchClassify()
  },

  /**
   * 查询小说分类
   */
  handleSearchClassify: function () {
    var that = this
    // 查询数据
    request({
      url: api.CLASSIFY,
    }).then(function (res) {
      that.setData({ classifyList: res })
      that.handleSearchNovelByClassify(res[0].path)
    })
  },

  /**
   * 根据小说分类查询
   */
  handleSearchNovelByClassify: function (path) {
    console.log(path)
    var that = this
    // 查询数据
    request({
      url: api.novelByClassify,
      data: { path: path },
    }).then(function (res) {
      that.setData({ novelList: res, selectedClassify: path })
    })
  },

  /**
   * 切换小说分类
   */
  handleSwitchClassify: function (e) {
    var path = e.currentTarget.dataset.path
    this.handleSearchNovelByClassify(path)
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