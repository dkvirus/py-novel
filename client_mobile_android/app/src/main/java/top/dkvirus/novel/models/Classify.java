package top.dkvirus.novel.models;

/**
 * 小说分类 dto 类
 */
public class Classify {

    // 主键
    private int id;

    // 小说分类路径
    private String path;

    // 小说分类名称
    private String desc;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }
}
