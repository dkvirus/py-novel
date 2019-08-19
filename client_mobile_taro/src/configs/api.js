export const NOVEL_CLASSIFY_GET = '/api/v1/gysw/novel/classify'        // 查询小说分类
export const NOVEL_CHAPTER_GET = '/api/v1/gysw/novel/chapter'          // 根据小说url查章节
export const NOVEL_CONTENT_GET = '/api/v1/gysw/novel/content'          // 根据章节url查内容
export const NOVEL_INTRO_GET = '/api/v1/gysw/novel/detail'             // 查询小说详情
export const NOVEL_LIST_GET = '/api/v1/gysw/novels'                    // 根据分类ID查询小说列表
  
export const SHELF_DEL = '/api/v1/gysw/shelf'                          // 删除书架中小说
export const SHELF_GET = '/api/v1/gysw/shelf'                          // 查询书架中小说列表
export const SHELF_ADD = '/api/v1/gysw/shelf'                          // 添加小说到书架中

export const SEARCH_HIST_GET = '/api/v1/gysw/search/hist'              // 查询搜索历史
export const SEARCH_HOT_GET = '/api/v1/gysw/search/hot'                // 查询热门搜索
export const SEARCH_NOVEL_GET = '/api/v1/gysw/search/novel'            // 查询小说，关键字

export const SIGNIN = '/api/v1/gysw/oauth/signin'                      // h5 登录
export const SIGNIN_WX = '/api/v1/gysw/oauth/wxsignin'                 // weapp 登录
export const TOKEN_GET = '/api/v1/gysw/oauth/token'                    // 获取 token
export const USER_EDIT = '/api/v1/gysw/user'                           // 修改用户信息