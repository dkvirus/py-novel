package top.dkvirus.novel.models;

import java.util.ArrayList;
import java.util.List;

public class ClassifyResult extends CommonResult {

    private List<Classify> data = new ArrayList<>();

    public List<Classify> getData() {
        return data;
    }

    public void setData(List<Classify> data) {
        this.data = data;
    }
}
