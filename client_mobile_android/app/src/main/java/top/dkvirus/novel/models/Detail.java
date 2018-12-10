package top.dkvirus.novel.models;

public class Detail {

    private String book_name;

    private String author_name;

    private String classify_name;

    private String last_update_at;

    private String book_desc;

    private String recent_chapter_url;

    public String show () {
        return "bookname is " + book_name + "\n author_name is " + author_name + "\n classify_name is " + classify_name;
    }

    public String getBook_name() {
        return book_name;
    }

    public void setBook_name(String book_name) {
        this.book_name = book_name;
    }

    public String getAuthor_name() {
        return author_name;
    }

    public void setAuthor_name(String author_name) {
        this.author_name = author_name;
    }

    public String getClassify_name() {
        return classify_name;
    }

    public void setClassify_name(String classify_name) {
        this.classify_name = classify_name;
    }

    public String getLast_update_at() {
        return last_update_at;
    }

    public void setLast_update_at(String last_update_at) {
        this.last_update_at = last_update_at;
    }

    public String getBook_desc() {
        return book_desc;
    }

    public void setBook_desc(String book_desc) {
        this.book_desc = book_desc;
    }

    public String getRecent_chapter_url() {
        return recent_chapter_url;
    }

    public void setRecent_chapter_url(String recent_chapter_url) {
        this.recent_chapter_url = recent_chapter_url;
    }
}
