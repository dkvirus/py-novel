var api = require('../../utils/api.js')
var { request } = require('../../utils/request.js')

wx.cloud.init({ traceUser: true })
var db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    novelUrl: 'https://www.biquge5200.cc/98_98081/',
    isLoading: false,         // 蒙版状态值
    isShowChapter: false,     // 目录莫泰是否显示
    scrollTopChap: 0,         // 目录滚动条位置
    novel: {
      bookName: '兵者',
      authorName: '七品',
      classifyName: '军事小说',
      lastUpdateAt: '2018-05-14',
      bookDesc: '忘记自己是谁，忘记格斗技巧，失去战斗本能，流落到孤岛之上，带着一群柔弱的女人陷入绝境。原始雨林、极地冰原、高山雪域、死亡沙漠……不断的求生，不断的拼凑记忆碎片，只为王者觉醒，风暴回归！（文出七品，必属精品。）',
      bookCoverUrl: 'https://novel.dkvirus.top/images/cover.png',
      recentChapterUrl: 'https://www.biquge5200.cc/67_67351/143657521.html',
    },
    chapter: {
      order: 'asc',
      id: '',
      list: [],               // 展示列表，一次只展示 100 条数据
      page: [],               // 分页处理数据
      all: [],                // 所有列表
      isShowPage: false,      // 是否显示分页
      defaultPage: {},        // 默认列表
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var { novelUrl = 'https://www.biquge5200.cc/67_67351/' } = options
    this.setData({ novelUrl, isLoading: true })
    this.handleSearchNovelDetail(novelUrl)
    this.handleSearchChapter(novelUrl)
  },

  /**
   * 请求小说详情
   */
  handleSearchNovelDetail: function (url) {
    var that = this
    request({
      url: api.GET_NOVEL_INTRO,
      data: { url }
    }).then(function (res) {
      if (!res.recent_chapter_url) {
        wx.showToast({
          title: '网络波动',
        })
        that.handleSearchNovelDetail(url)
        return
      }

      that.setData({
        'novel.bookName': res.book_name,
        'novel.authorName': res.author_name,
        'novel.classifyName': res.classify_name,
        'novel.lastUpdateAt': res.last_update_at,
        'novel.bookDesc': res.book_desc,
        'novel.recentChapterUrl': res.recent_chapter_url,
        isLoading: false,
      })
    }).catch(function (err) {
      that.setData({ isLoading: false })
    })
  },

  /**
   * 请求目录结构
   */
  handleSearchChapter: function (url) {
    var that = this
    request({
      url: api.GET_CHAPTER,
      data: { url }
    }).then(function (res) {
      // 拼接分页数据  288 => 2、88,,,,2880 => 28、80
      var integer = Math.floor(res.length / 100)        // 整数部分
      var remainder = res.length % 100                  // 余数
      var page = []
      for (var i = 1; i <= integer; i++) {
        var obj = {}
        obj.id = String(i)
        obj.start = (i - 1) * 100
        obj.end = i * 100
        obj.desc = `${(i - 1) * 100 + 1}-${i * 100}`
        page.push(obj)
      }
      page.push({
        id: String(integer + 1),
        desc: `${integer * 100 + 1}-${integer * 100 + remainder}`,
        start: integer * 100,
        end: integer * 100 + remainder,
      })

      that.setData({
        'chapter.list': res.slice(0, 100),
        'chapter.page': page,
        'chapter.all': res,
        'chapter.defaultPage': page[0],
      })
    })  
  },

  /**
   * 处理加入书架
   */
  handleJoinShelf: function () {
    var that = this
    var userId = wx.getStorageSync('user_id')
    var { novel } = this.data

    request({
      url: api.GET_SHELF,
      data: {
        user_id: userId,
        book_name: novel.bookName,
        author_name: novel.authorName,
      }
    }).then(function (res) {
      if (res.length > 0) {
        wx.showToast({
          title: '已加入书架',
        })
        return  
      }

      request({
        url: api.ADD_SHELF,
        method: 'POST',
        data: {
          user_id: userId,
          book_name: novel.bookName,
          author_name: novel.authorName,
          book_desc: novel.bookDesc,
          book_cover_url: novel.bookCoverUrl,
          recent_chapter_url: novel.recentChapterUrl,
        }
      }).then(function (res2) {
        wx.showToast({
          title: '加入书架成功',
        })
        wx.switchTab({
          url: '../index/index' 
        })
      })
    })
  },

  handleBack: function () {
    wx.navigateBack()
  },

  /**
   * 切换分页
   */
  handleSwitchPage: function () {
    var isShowPage = this.data.chapter.isShowPage
    this.setData({ 'chapter.isShowPage': !isShowPage })
  },

  /**
   * 修改小说章节排序
   */
  handleChangeOrder: function () {
    var { order, list } = this.data.chapter
    if (order === 'asc') {
      order = 'desc'
    } else {
      order = 'asc'
    }
    list = list.reverse();
    this.setData({ 'chapter.list': list, 'chapter.order': order, scrollTopChap: 0 })
  },

  /**
   * 大翻页处理
   */
  handleBigPage: function (e) {
    var { start, end, id } = e.currentTarget.dataset
    var { all, isShowPage, page } = this.data.chapter

    var list = all.slice(start, end)
    this.setData({
      'chapter.list': list,
      'chapter.isShowPage': !isShowPage,
      'chapter.defaultPage': page.find(item => item.id === id)
    })
  },

  /**
   * 隐藏目录侧边框
   */
  handleHideChapter: function () {
    this.setData({ isShowChapter: false })
  },

  /**
   * 显示目录侧边框
   */
  handleShowChapter: function () {
    this.setData({ isShowChapter: true })
  },
})