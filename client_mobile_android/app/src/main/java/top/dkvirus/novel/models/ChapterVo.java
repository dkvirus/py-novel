package top.dkvirus.novel.models;

import java.util.ArrayList;
import java.util.List;

/**
 * 章节 vo 类
 */
public class ChapterVo extends CommonVo {

    private List<Chapter> data = new ArrayList<Chapter>();

    public List<Chapter> getData() {
        return data;
    }

    public void setData(List<Chapter> data) {
        this.data = data;
    }
}
