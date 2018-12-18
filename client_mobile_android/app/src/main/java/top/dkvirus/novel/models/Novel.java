package top.dkvirus.novel.models;

import com.google.gson.annotations.SerializedName;

import java.util.Date;

public class Novel {

    // 主键
    private int id;

    // 小说分类主键
    @SerializedName("classify_id")
    private int classifyId;

    // 小说分类名称
    @SerializedName("classify_name")
    private String classifyName;

    // 作者名称
    @SerializedName("author_name")
    private String authorName;

    // 小说名称
    @SerializedName("book_name")
    private String bookName;

    // 小说简介
    @SerializedName("book_desc")
    private String bookDesc;

    // 小说封面地址
    @SerializedName("book_cover_url")
    private String bookCoverUrl;

    // 小说地址
    @SerializedName("book_url")
    private String bookUrl;

    // 最后更新时间
    @SerializedName("last_update_at")
    private Date lastUpdateAt;

    @SerializedName("recent_chapter_url")
    private String recentChapterUrl;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getClassifyId() {
        return classifyId;
    }

    public void setClassifyId(int classifyId) {
        this.classifyId = classifyId;
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

    public String getBookUrl() {
        return bookUrl;
    }

    public void setBookUrl(String bookUrl) {
        this.bookUrl = bookUrl;
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

    public String getRecentChapterUrl() {
        return recentChapterUrl;
    }

    public void setRecentChapterUrl(String recentChapterUrl) {
        this.recentChapterUrl = recentChapterUrl;
    }
}
