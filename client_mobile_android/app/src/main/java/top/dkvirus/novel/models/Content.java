package top.dkvirus.novel.models;

import com.google.gson.annotations.SerializedName;

/**
 * 阅读内容 dto 类
 */
public class Content {

    // 阅读标题
    private String title;

    // 阅读内容
    private String content;

    // 上一章节地址
    @SerializedName("prev_url")
    private String prevUrl;

    // 下一章节地址
    @SerializedName("next_url")
    private String nextUrl;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPrevUrl() {
        return prevUrl;
    }

    public void setPrevUrl(String prevUrl) {
        this.prevUrl = prevUrl;
    }

    public String getNextUrl() {
        return nextUrl;
    }

    public void setNextUrl(String nextUrl) {
        this.nextUrl = nextUrl;
    }
}
