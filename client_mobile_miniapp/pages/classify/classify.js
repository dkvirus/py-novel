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
    this.handleGetClassifyList()
  },

  /**
   * 查询小说分类
   */
  handleGetClassifyList: function () {
    request({
      url: api.GET_CLASSIFY,
    }).then(res => {
      this.setData({ classifyList: res })
      this.handleGetNovelList(res[0].id)
    })
  },

  /**
   * 根据小说分类查询
   */
  handleGetNovelList: function (id) {
    request({
      url: api.GET_SEARCH_NOVEL,
      data: { classify_id: id },
    }).then(res => {
      this.setData({ novelList: res, selectedClassify: id })
    })
  },

  /**
   * 切换小说分类
   */
  handleClickClassify: function (e) {
    var id = e.currentTarget.dataset.id
    this.handleGetNovelList(id)
  },

  /**
   * 跳转小说介绍页面
   */
  handleGoIntroPage: function (e) {
    var { url } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../intro/intro?novelUrl=${url}`,
    })
  },

  /**
   * 跳转到搜索页面
   */
  handleGoSearchPage: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  },
})