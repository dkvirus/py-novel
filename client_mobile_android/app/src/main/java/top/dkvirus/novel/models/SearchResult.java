package top.dkvirus.novel.models;

import java.util.ArrayList;
import java.util.List;

public class SearchResult extends CommonResult {

    private List<Search> data = new ArrayList<Search>();

    public List<Search> getData() {
        return data;
    }

    public void setData(List<Search> data) {
        this.data = data;
    }
}
