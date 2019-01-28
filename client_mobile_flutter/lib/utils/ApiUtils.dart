class ApiUtils {
  static const String GET_USER_INFO = '/gysw/user/info';                      // 登录接口，获取用户信息
  static const String POST_USER_INFO = '/gysw/user/info';                     // 注册接口，新增用户信息
  
  static const String GET_MOBILE_CODE = '/gysw/mobile/code';                  // 获取手机验证码
  static const String VALIDATE_MOBILE_CODE = '/gysw/mobile/validate';         // 校验手机验证码是否正确

  static const String SEND_FEEDBACK = '/gysw/email/feedback';                 // 发送反馈邮件

  static const String GET_SHELF_LIST = '/gysw/shelf';                         // 获取书架列表
  static const String ADD_SHELF = '/gysw/shelf';                              // 新增书架销售
  static const String DELETE_SHELF = '/gysw/shelf/:id';                       // 删除书架小说
  static const String EDIT_SHELF = '/gysw/shelf/:id';                         // 修改书架小说最新阅读章节

  static const String GET_NOVEL_BY_CLASSIFY_ID = '/gysw/search/novel';        // 根据分类 ID 获取小说列表
  static const String GET_NOVEL_HOT_LIST = '/gysw/search/hot';                // 获取热门小说列表
  static const String GET_NOVEL_HISTORY_LIST = '/gysw/search/hist/:user_id';  // 获取搜索历史列表
  static const String ADD_NOVEL_HISTORY = '/gysw/search/hist';                // 添加一条搜索记录

  static const String GET_CLASSIFY_LIST = '/gysw/novel/classify';             // 获取小说分类列表
  static const String GET_NOVEL_INTRO = '/gysw/novel/detail';                 // 获取小说详细信息
  static const String GET_NOVEL_CHAPTER = '/gysw/novel/chapter';              // 获取小说章节信息
  static const String GET_NOVEL_CONTENT = '/gysw/novel/content';              // 获取小说阅读正文

}