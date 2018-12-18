package top.dkvirus.novel.models;

import com.google.gson.annotations.SerializedName;

import java.util.Date;

public class User {

    // 主键
    private int id;

    // 用户昵称
    private String nickname;

    // 用户头像
    @SerializedName("avatar_url")
    private String avatarUrl;

    // 用户登录名称
    private String username;

    // 用户登录密码
    private String password;

    // 客户端类型：MOBILE、WECHAT
    @SerializedName("client_type")
    private String clientType;

    // 性别
    private String gender;

    // 用户地址
    private String address;

    // 用户生日
    private Date birth;

    // 备注
    private String remark;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getClientType() {
        return clientType;
    }

    public void setClientType(String clientType) {
        this.clientType = clientType;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Date getBirth() {
        return birth;
    }

    public void setBirth(Date birth) {
        this.birth = birth;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
