package top.dkvirus.novel.models;

/**
 * 章节 dto 类
 */
public class Chapter {

    // 主键
    private String uuid;

    // 章节名称
    private String name;

    // 章节地址
    private String url;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
