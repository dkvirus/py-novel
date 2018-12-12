package top.dkvirus.novel.models;

import java.util.ArrayList;
import java.util.List;

public class ChapterResult extends CommonResult {

    private List<Chapter> data = new ArrayList<Chapter>();

    public List<Chapter> getData() {
        return data;
    }

    public void setData(List<Chapter> data) {
        this.data = data;
    }
}
