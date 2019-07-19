var api = require('../../utils/api.js')
var { request } = require('../../utils/request.js')

wx.cloud.init({ traceUser: true })
var db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    novelId: '',          // 书架中小说id，用于更新小说章节
    bookName: '',         // 书名 
    title: '',            // 章节标题
    content: '',          // 章节内容
    prevUrl: '',          // 上一章节地址
    nextUrl: '',          // 下一章节地址

    all: [],        // 所有列表信息
    page: [],       // 大分页 1-100、101-200、201-300
    list: [],       // 小分页展示的数据 
    isShowPage: false,          // 是否显示大分页
    chapterVisible: false,      // 左侧章节抽屉是否可见
    order: 'asc',

    menuVisible: false,         // 菜单抽屉是否可见。'目录' | '设置' | '白天/黑夜'
    isDark: false,              // 白天还是黑夜

    settingVisible: false,      // 设置抽屉是否可见。字体大小、背景颜色、亮度
    bgColor: '#fff',
    font: 32,
    bgs: [
      '#fff',
      'rgb(158, 151, 167)',
      'rgb(177, 160, 132)',
      'rgb(165, 168, 185)',
      'rgb(187, 157, 171)',
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ novelId = 1, bookName = '兵者', chapterUrl = 'https://www.biquge5200.cc/98_98081/155305426.html' }) {
    var novelUrl = chapterUrl.split('/').slice(0, 4).join('/')   // 用于查询目录
    this.setData({ bookName, novelId })
    this.handleGetNovelContent(chapterUrl)  
    this.handleGetChapterList(novelUrl)  
  },
  
  /**
   * 跳转到上一个页面
   */
  handleBack: function () {
    wx.navigateBack()
  },

  /**
   * 查询章节列表
   */
  handleGetChapterList: function (url) {
    request({
      url: api.GET_CHAPTER,
      data: { url },
    }).then(res => {
      // 拼接分页数据  288 => 2、88,,,,2880 => 28、80
      const integer = Math.floor(res.length / 100)        // 整数部分
      const remainder = res.length % 100                  // 小数部分

      const page = []

      /**
       * start、end  下标从 0 开始
       * page    0-99、100-199、200-299
       */
      for (let i = 0; i <= integer; i++) {
        const obj = Object.create(null)
        obj.id = String(i)
        obj.start = i * 100

        if (integer === 0) {   // 只有一页，0 - 88
          obj.end = remainder - 1
        } else if (i === integer) {  // 最后一页
          obj.end = i * 100 + remainder - 1
        } else {
          obj.end = (i + 1) * 100 - 1
        }

        obj.desc = `${obj.start + 1} - ${obj.end + 1}`

        page.push(obj)
      }

      this.setData({
        all: res,
        page,
        list: res.slice(0, 100),
      })
    })
  },

  /**
   * 查询章节内容
   */
  handleGetNovelContent (url) {
    const { novelId } = this.data

    request({
      url: api.GET_CONTENT,
      data: { url },
    }).then(res => {
      const { title, content, prev_url, next_url } = res
      this.setData({
        title,
        content,
        prevUrl: prev_url,
        nextUrl: next_url,
        settingVisible: false,
        menuVisible: false,
        chapterVisible: false,
      })

      request({
        url: api.EDIT_SHELF,
        method: 'PUT',
        data: {
          recent_chapter_url: url,
          id: novelId,
        }
      })
    })
  },

  /**
   * 翻页。上一页 | 下一页
   */
  handleTurnPage (e) {
    var { url, info } = e.currentTarget.dataset
    if (url.indexOf('.html') === -1) {
      if (info === 'prev') {
        wx.showToast({
          title: '已经是第一章了',
          icon: 'none',
        })
      } else if (info === 'next') {
        wx.showToast({
          title: '已经是最新章节了',
          icon: 'none',
        })
      }
      return
    }

    this.handleGetNovelContent(url)
  },

  /**
   * 修改设置面板中的亮度：白天/黑夜
   */
  handleSwitchTheme: function (e) {
    this.handleHideMenuModal()
    var isDark = e.currentTarget.dataset.theme
    if (isDark) {  // true 表示切换为黑夜
      this.setData({ bgColor: '#fff', isDark: !isDark })
    } else {
      this.setData({ bgColor: 'rgb(0, 0, 0)', isDark: !isDark })
    }
  },

  /**
   * 修改设置面板中的字体
   */
  handleChangeFont: function (e) {
    var target = e.currentTarget.dataset.target
    var font = this.data.font
    if (target === 'sub') {
      this.setData({ font: font - 4 })
    } else if (target === 'add') {
      this.setData({ font: font + 4 })
    } else {
      this.setData({ font: 32 })
    }
  },

  /**
   * 修改设置面板中的背景颜色
   */
  handleChangeBg: function (e) {
    var bg = e.currentTarget.dataset.bg
    this.setData({ bgColor: bg })
  },

  /**
   * 切换分页
   */
  handleSwitchPage: function () {
    var isShowPage = this.data.isShowPage
    this.setData({ isShowPage: !isShowPage })
  },

  /**
   * 点击章节
   */
  handleClickChapter: function (e) {
    var { url } = e.currentTarget.dataset
    this.handleGetNovelContent(url)
    this.handleHideChapterModal()
  },

  /**
   * 修改小说章节排序
   */
  handleChangeOrder: function () {
    var { order, list } = this.data
    if (order === 'asc') {
      order = 'desc'
    } else {
      order = 'asc'
    }
    list = list.reverse();
    this.setData({ list, order })
  },

  /**
   * 大翻页处理
   */
  handleBigPage: function (e) {
    var { start, end, id } = e.currentTarget.dataset
    var { all, isShowPage, page } = this.data

    var list = all.slice(start, end)
    this.setData({
      list,
      isShowPage: !isShowPage,
    })
  },

  /**
   * 显示菜单模态框
   */
  handleShowMenuModal: function () {
    this.setData({ menuVisible: true })
  },

  /**
   * 隐藏菜单模态框
   */
  handleHideMenuModal: function () {
    this.setData({ 
      menuVisible: false,
      chapterVisible: false,
      settingVisible: false,
    })
  },

  /**
   * 显示设置模态框
   */
  handleShowSettingModal: function () {
    this.setData({ settingVisible: true })
  },

  /**
   * 隐藏设置模态框
   */
  handleHideSettingModal: function () {
    this.setData({  
      menuVisible: false,
      chapterVisible: false,
      settingVisible: false,
    })
  },

  /**
   * 显示目录模态框
   */
  handleShowChapterModal: function () {
    this.setData({ chapterVisible: true })
  },

  /**
   * 隐藏目录模态框
   */
  handleHideChapterModal: function () {
    this.setData({ 
      menuVisible: false,
      chapterVisible: false,
      settingVisible: false,
    })
  },
})