package top.dkvirus.novel.models;

public class Shelf {

    private int id;

    private String author_name;

    private String book_name;

    private String book_desc;

    private String book_cover_url;

    private String recent_chapter_url;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getAuthor_name() {
        return author_name;
    }

    public void setAuthor_name(String author_name) {
        this.author_name = author_name;
    }

    public String getBook_name() {
        return book_name;
    }

    public void setBook_name(String book_name) {
        this.book_name = book_name;
    }

    public String getBook_desc() {
        return book_desc;
    }

    public void setBook_desc(String book_desc) {
        this.book_desc = book_desc;
    }

    public String getBook_cover_url() {
        return book_cover_url;
    }

    public void setBook_cover_url(String book_cover_url) {
        this.book_cover_url = book_cover_url;
    }

    public String getRecent_chapter_url() {
        return recent_chapter_url;
    }

    public void setRecent_chapter_url(String recent_chapter_url) {
        this.recent_chapter_url = recent_chapter_url;
    }
}
