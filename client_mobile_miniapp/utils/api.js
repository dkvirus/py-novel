module.exports = {
  GET_TOKEN: '/gysw/oauth/token',                 // 获取 token

  GET_CLASSIFY: '/gysw/novel/classify',           // 查询小说分类
  GET_CHAPTER: '/gysw/novel/chapter',             // 根据小说url查章节
  GET_CONTENT: '/gysw/novel/content',             // 根据章节url查内容
  GET_NOVEL_INTRO: '/gysw/novel/detail',          // 查询小说详情
  
  DEL_SHELF: '/gysw/shelf/{id}',                  // 删除书架中小说
  GET_SHELF: '/gysw/shelf/',                      // 查询书架中小说列表
  ADD_SHELF: '/gysw/shelf',                       // 添加小说到书架中
  EDIT_SHELF: '/gysw/shelf/{id}',                 // 更新小说阅读章节

  ADD_SEARCH_HIST: '/gysw/search/hist',           // 添加搜索历史
  GET_SEARCH_HIST: '/gysw/search/hist/{user_id}', // 查询搜索历史
  GET_SEARCH_HOT: '/gysw/search/hot',             // 查询热门搜索
  GET_SEARCH_NOVEL: '/gysw/search/novel',         // 查询小说，关键字

  GET_USER_INFO: '/gysw/user/info',               // 查询用户信息
  ADD_USER_INFO: '/gysw/user/info',               // 添加用户信息
  EDIT_USER_INFO: '/gysw/user/info/{user_id}',    // 更新用户信息
  GET_USER_WXINFO: '/gysw/user/wxinfo',           // 获取微信用户信息
}