package top.dkvirus.novel.models;

import java.util.ArrayList;
import java.util.List;

public class BookResult extends CommonResult {

    private List<Book> data = new ArrayList<>();

    public List<Book> getData() {
        return data;
    }

    public void setData(List<Book> data) {
        this.data = data;
    }
}
