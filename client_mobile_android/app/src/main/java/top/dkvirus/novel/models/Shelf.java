package top.dkvirus.novel.models;

import com.google.gson.annotations.SerializedName;

import java.util.Date;

/**
 * 书架 dto 类
 */
public class Shelf {

    // 主键
    private int id;

    // 用户主键
    @SerializedName("user_id")
    private int userId;

    // 作者名称
    @SerializedName("author_name")
    private String authorName;

    // 小说名称
    @SerializedName("book_name")
    private String bookName;

    // 小说描述文字 or 小说简介
    @SerializedName("book_desc")
    private String bookDesc;

    // 小说封面图片
    @SerializedName("book_cover_url")
    private String bookCoverUrl;

    // 用户最新阅读小说的章节地址
    @SerializedName("recent_chapter_url")
    private String recentChapterUrl;

    // 用户最后一次阅读小说时间
    @SerializedName("last_update_at")
    private Date lastUpdateAt;

    // 小说分类名称
    @SerializedName("classify_name")
    private String classifyName;

    public Shelf () {}

    public Shelf (String recentChapterUrl) {
        this.recentChapterUrl = recentChapterUrl;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getBookName() {
        return bookName;
    }

    public void setBookName(String bookName) {
        this.bookName = bookName;
    }

    public String getBookDesc() {
        return bookDesc;
    }

    public void setBookDesc(String bookDesc) {
        this.bookDesc = bookDesc;
    }

    public String getBookCoverUrl() {
        return bookCoverUrl;
    }

    public void setBookCoverUrl(String bookCoverUrl) {
        this.bookCoverUrl = bookCoverUrl;
    }

    public String getRecentChapterUrl() {
        return recentChapterUrl;
    }

    public void setRecentChapterUrl(String recentChapterUrl) {
        this.recentChapterUrl = recentChapterUrl;
    }

    public Date getLastUpdateAt() {
        return lastUpdateAt;
    }

    public void setLastUpdateAt(Date lastUpdateAt) {
        this.lastUpdateAt = lastUpdateAt;
    }

    public String getClassifyName() {
        return classifyName;
    }

    public void setClassifyName(String classifyName) {
        this.classifyName = classifyName;
    }
}
