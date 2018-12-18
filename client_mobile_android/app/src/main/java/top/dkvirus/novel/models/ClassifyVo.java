package top.dkvirus.novel.models;

import java.util.ArrayList;
import java.util.List;

/**
 * 小说分类 vo 类
 */
public class ClassifyVo extends CommonVo {

    private List<Classify> data = new ArrayList<>();

    public List<Classify> getData() {
        return data;
    }

    public void setData(List<Classify> data) {
        this.data = data;
    }

}
