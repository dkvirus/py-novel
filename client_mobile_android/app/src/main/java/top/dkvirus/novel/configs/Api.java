package top.dkvirus.novel.configs;

public class Api {

    // 查询用户信息
    public static final String GET_USER_INFO = "/gysw/user/info";

    // 保存用户信息
    public static final String ADD_USER_INFO = "/gysw/user/info";

    // 校验用户是否已注册，根据手机号查找
    public static final String VALIDATE_USER_INFO = "/gysw/user/validate";

    // 发送短信验证码
    public static final String SEND_MOBILE_CODE = "/gysw/mobile/code";

    // 校验短信验证码
    public static final String VALIDATE_MOBILE_CODE = "/gysw/mobile/validate";

    // 搜索小说
    public static final String GET_SEARCH_NOVEL = "/gysw/search/novel";

    // 往书架中添加一本小说
    public static final String ADD_SHELF = "/gysw/shelf";

    // 查询小说详情
    public static final String GET_NOVEL_INTRO = "/gysw/novel/detail";

    // 查询书架列表
    public static final String GET_SHELF = "/gysw/shelf";

    // 查询小说内容
    public static final String GET_NOVEL_CONTENT = "/gysw/novel/content";

}
