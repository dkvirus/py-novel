package top.dkvirus.novel.models;

/**
 * 邮箱 dto 类
 */
public class Email {

    // 用户主键
    private int userId;

    // 邮箱
    private String email;

    // 邮箱验证码
    private String code;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
