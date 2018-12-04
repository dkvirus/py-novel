package top.dkvirus.novel.models;

import java.util.ArrayList;
import java.util.List;

public class ShelfResult extends CommonResult {

    private List<Shelf> data = new ArrayList<Shelf>();

    public List<Shelf> getData() {
        return data;
    }

    public void setData(List<Shelf> data) {
        this.data = data;
    }
}
