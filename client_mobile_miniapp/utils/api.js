var apiPrefix = 'https://novel.dkvirus.top/api'
// var apiPrefix = 'http://localhost:5000/api'

module.exports = {
  GET_NOVEL: `${apiPrefix}/gysw/novel`,                 // 根据关键字查询
  GET_CLASSIFY: `${apiPrefix}/gysw/classify`,           // 查询小说分类
  GET_CHAPTER: `${apiPrefix}/gysw/chapter/:url`,        // 根据小说url查章节
  GET_CONTENT: `${apiPrefix}/gysw/content/:url`,        // 根据章节url查内容
  DEL_SHELF: `${apiPrefix}/gysw/shelf/:id`,             // 删除书架中小说
  GET_SHELF: `${apiPrefix}/gysw/shelf`,                 // 查询书架中小说列表
  ADD_SHELF: `${apiPrefix}/gysw/shelf`,                 // 添加小说到书架中
  EDIT_SHELF: `${apiPrefix}/gysw/shelf/:id`,            // 更新小说
  ADD_SEARCH_HIST: `${apiPrefix}/gysw/search/hist`,     // 添加搜索历史
  GET_SEARCH_HIST: `${apiPrefix}/gysw/search/hist/:open_id`,// 查询搜索历史
  GET_SEARCH_HOT: `${apiPrefix}/gysw/search/hot`,       // 查询热门搜索
}