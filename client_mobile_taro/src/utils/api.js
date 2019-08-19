export const GET_CLASSIFY = '/api/v1/gysw/novel/classify';             // 查询小说分类
export const GET_CHAPTER = '/api/v1/gysw/novel/chapter';               // 根据小说url查章节
export const GET_CONTENT = '/api/v1/gysw/novel/content';               // 根据章节url查内容
export const GET_NOVEL_INTRO = '/api/v1/gysw/novel/detail';            // 查询小说详情
  
export const DEL_SHELF = '/api/v1/gysw/shelf/{id}';                    // 删除书架中小说
export const GET_SHELF = '/api/v1/gysw/shelf';                         // 查询书架中小说列表
export const ADD_SHELF = '/api/v1/gysw/shelf';                         // 添加小说到书架中
export const EDIT_SHELF = '/api/v1/gysw/shelf/{id}';                   // 更新小说阅读章节

export const GET_SEARCH_HIST = '/api/v1/gysw/search/hist';   // 查询搜索历史
export const GET_SEARCH_HOT = '/api/v1/gysw/search/hot';               // 查询热门搜索
export const GET_SEARCH_NOVEL = '/api/v1/gysw/search/novel';           // 查询小说，关键字

export const GET_USER_INFO = '/api/v1/gysw/user/info';                 // 查询用户信息
export const ADD_USER_INFO = '/api/v1/gysw/user/info';                 // 添加用户信息
export const EDIT_USER_INFO = '/api/v1/gysw/user/info/{user_id}';      // 更新用户信息
export const GET_USER_WXINFO = '/api/v1/gysw/user/wxinfo';             // 获取微信用户信息

export const SIGNIN = '/api/v1/gysw/oauth/signin'                       // h5 登录
export const NOVEL_LIST = '/api/v1/gysw/novels'                         // 根据分类ID查询小说列表
export const GET_TOKEN = '/api/v1/gysw/oauth/token'                     // 获取 token