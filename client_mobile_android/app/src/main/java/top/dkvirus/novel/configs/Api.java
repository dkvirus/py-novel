package top.dkvirus.novel.configs;

/**
 * 网络请求接口
 */
public class Api {

    /**
     * 用户
     */
    public static final String GET_USER_INFO = "/gysw/user/info";               // 查询用户信息
    public static final String ADD_USER_INFO = "/gysw/user/info";               // 保存用户信息
    public static final String VALIDATE_USER_INFO = "/gysw/user/validate";      // 校验用户是否已注册，根据手机号查找

    /**
     * 书架
     */
    public static final String ADD_SHELF = "/gysw/shelf";                       // 往书架中添加一本小说
    public static final String GET_SHELF = "/gysw/shelf";                       // 查询书架列表
    public static final String EDIT_SHELF = "/gysw/shelf";                      // 更新书架最新阅读章节

    /**
     * 搜索
     */
    public static final String GET_SEARCH_NOVEL = "/gysw/search/novel";         // 搜索小说

    /**
     * 小说
     */
    public static final String GET_NOVEL_INTRO = "/gysw/novel/detail";          // 查询小说详情
    public static final String GET_NOVEL_CONTENT = "/gysw/novel/content";       // 查询小说内容
    public static final String GET_NOVEL_CHAPTER = "/gysw/novel/chapter";       // 查询小说章节
    public static final String GET_NOVEL_CLASSIFY = "/gysw/novel/classify";     // 查询小说分类

    /**
     * 短信
     */
    public static final String SEND_MOBILE_CODE = "/gysw/mobile/code";          // 发送短信验证码
    public static final String VALIDATE_MOBILE_CODE = "/gysw/mobile/validate";  // 校验短信验证码

}
