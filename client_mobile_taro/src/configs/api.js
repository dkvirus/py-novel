export const NOVEL_CLASSIFY_GET = '/gysw/novel/classify'        // 查询小说分类
export const NOVEL_CHAPTER_GET = '/gysw/novel/chapter'          // 根据小说url查章节
export const NOVEL_CONTENT_GET = '/gysw/novel/content'          // 根据章节url查内容
export const NOVEL_INTRO_GET = '/gysw/novel/detail'             // 查询小说详情
export const NOVEL_LIST_GET = '/gysw/novels'                    // 根据分类ID查询小说列表
  
export const SHELF_DEL = '/gysw/shelf'                          // 删除书架中小说
export const SHELF_GET = '/gysw/shelf'                          // 查询书架中小说列表
export const SHELF_ADD = '/gysw/shelf'                          // 添加小说到书架中

export const SEARCH_HIST_GET = '/gysw/search/hist'              // 查询搜索历史
export const SEARCH_HOT_GET = '/gysw/search/hot'                // 查询热门搜索
export const SEARCH_NOVEL_GET = '/gysw/search/novel'            // 查询小说，关键字

export const OAUTH_SIGNIN = '/gysw/oauth/signin'                // h5 登录
export const OAUTH_SIGNUP = '/gysw/oauth/signup'                // h5 注册
export const OAUTH_VCODE_GET = '/gysw/oauth/vcode'              // h5 发送短信验证码
export const OAUTH_RESET_PW = '/gysw/oauth/resetpw'             // h5 重置密码
export const OAUTH_SIGNIN_WX = '/gysw/oauth/wxsignin'           // weapp 登录
export const OAUTH_TOKEN_GET = '/gysw/oauth/token'              // 获取 token

export const USER_EDIT = '/gysw/user'                           // 修改用户信息