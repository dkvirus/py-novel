package top.dkvirus.novel.models;

import java.util.List;

/**
 * 书架 vo 类
 */
public class ShelfVo extends CommonVo{

    private List<Shelf> data;

    public List<Shelf> getData() {
        return data;
    }

    public void setData(List<Shelf> data) {
        this.data = data;
    }

}