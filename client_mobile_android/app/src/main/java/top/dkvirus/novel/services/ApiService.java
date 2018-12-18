package top.dkvirus.novel.services;

import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;
import retrofit2.http.QueryMap;
import top.dkvirus.novel.models.ChapterVo;
import top.dkvirus.novel.models.ClassifyVo;
import top.dkvirus.novel.models.CommonVo;
import top.dkvirus.novel.models.ContentVo;
import top.dkvirus.novel.models.Email;
import top.dkvirus.novel.models.Mobile;
import top.dkvirus.novel.models.NovelListVo;
import top.dkvirus.novel.models.NovelVo;
import top.dkvirus.novel.models.SearchVo;
import top.dkvirus.novel.models.Shelf;
import top.dkvirus.novel.models.ShelfVo;
import top.dkvirus.novel.models.User;
import top.dkvirus.novel.models.UserVo;

public interface ApiService {

    /**
     * 用户
     */

    @GET("gysw/user/info")
    Call<UserVo> getUserInfo();

    @POST("gysw/user/info")
    Call<CommonVo> addUserInfo(@Body User user);

    @PUT("gysw/user/info/{id}")
    Call<CommonVo> editUserInfo(@Path("id") int id, @Body User user);

    @GET("gysw/user/validate")
    Call<CommonVo> validateUser(@Query("username") String username);


    /**
     * 书架
     */

    @GET("gysw/shelf")
    Call<ShelfVo> getShelf(@QueryMap Map<String, Object> options);

    @POST("gysw/shelf")
    Call<CommonVo> addShelf(@Body Shelf shelf);

    @PUT("gysw/shelf/{id}")
    Call<CommonVo> editShelf(@Path("id") int id, @Body Shelf shelf);

    @DELETE("gysw/shelf/{id}")
    Call<CommonVo> removeShelf(@Path("id") int id);

    /**
     * 小说
     */

    // 查询小说分类列表
    @GET("gysw/novel/classify")
    Call<ClassifyVo> getClassify();

    // 查询小说章节列表
    @GET("gysw/novel/chapter")
    Call<ChapterVo> getChapter(@Query("url") String url);

    // 查询小说阅读内容
    @GET("gysw/novel/content")
    Call<ContentVo> getContent(@Query("url") String url);

    // 查询小说详情
    @GET("gysw/novel/detail")
    Call<NovelVo> getDetail(@Query("url") String url);


    /**
     * 搜索
     */

    // 添加历史搜索记录
    @POST("gysw/search/hist")
    Call<CommonVo> addSearchHist();

    // 根据用户 id 查询历史搜索记录
    @GET("gysw/search/hist/{user_id}")
    Call<SearchVo> getSearchHist(@Path("user_id") int userId);

    // 查询热门搜索
    @GET("gysw/search/hot")
    Call<SearchVo> getSearchHot();

    // 查询小说
    @GET("gysw/search/novel")
    Call<NovelListVo> getSearchNovel(@QueryMap Map<String, Object> options);

    /**
     * 邮箱验证码
     */

    @POST("gysw/email/code")
    Call<CommonVo> sendEmailCode(@Body Email email);

    @POST("gysw/email/validate")
    Call<CommonVo> validateEmailCode(@Body Email email);

    /**
     * 手机验证码
     */

    @POST("gysw/mobile/code")
    Call<CommonVo> sendMobileCode(@Body Mobile mobile);

    @POST("gysw/mobile/validate")
    Call<CommonVo> validateMobileCode(@Body Mobile mobile);

}
