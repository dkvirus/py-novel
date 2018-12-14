var api = require('../../utils/api.js')
var { request } = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,         // 蒙版状态值
    classifyList: [],
    selectedClassify: '',
    novelList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ isLoading: true })
    this.handleSearchClassify()
  },

  /**
   * 查询小说分类
   */
  handleSearchClassify: function () {
    var that = this
    // 查询数据
    request({
      url: api.GET_CLASSIFY,
    }).then(function (res) {
      that.setData({ classifyList: res })
      that.handleSearchNovelByClassify(res[0].id)
    })
  },

  /**
   * 根据小说分类查询
   */
  handleSearchNovelByClassify: function (id) {
    var that = this
    // 查询数据
    request({
      url: api.GET_SEARCH_NOVEL,
      data: { classify_id: id },
    }).then(function (res) {
      that.setData({ novelList: res, selectedClassify: id, isLoading: false })
    }).catch(function (err) {
      that.setData({ isLoading: false })
    })
  },

  /**
   * 切换小说分类
   */
  handleSwitchClassify: function (e) {
    var id = e.currentTarget.dataset.id
    this.setData({ isLoading: true })
    this.handleSearchNovelByClassify(id)
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
})