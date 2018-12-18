package top.dkvirus.novel.models;

import java.util.ArrayList;
import java.util.List;

public class NovelListVo extends CommonVo {

    private List<Novel> data = new ArrayList<>();

    public List<Novel> getData() {
        return data;
    }

    public void setData(List<Novel> data) {
        this.data = data;
    }
}
