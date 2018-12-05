package top.dkvirus.novel.models;

public class Novel {

    private String title;

    private String content;

    private String prev_url;

    private String next_url;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPrev_url() {
        return prev_url;
    }

    public void setPrev_url(String prev_url) {
        this.prev_url = prev_url;
    }

    public String getNext_url() {
        return next_url;
    }

    public void setNext_url(String next_url) {
        this.next_url = next_url;
    }
}
