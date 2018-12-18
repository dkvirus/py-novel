package top.dkvirus.novel.models;

import com.google.gson.annotations.SerializedName;

import java.util.Date;

public class Search {

    private int id;

    @SerializedName("user_id")
    private int userId;

    private String keyword;

    private int times;

    @SerializedName("last_update_at")
    private Date lastUpdateAt;

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

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public int getTimes() {
        return times;
    }

    public void setTimes(int times) {
        this.times = times;
    }

    public Date getLastUpdateAt() {
        return lastUpdateAt;
    }

    public void setLastUpdateAt(Date lastUpdateAt) {
        this.lastUpdateAt = lastUpdateAt;
    }
}
