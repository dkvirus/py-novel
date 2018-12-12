package top.dkvirus.novel.pages.index;

import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import java.util.List;

import top.dkvirus.novel.models.Book;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.pages.intro.IntroActivity;

public class NovelAdapter extends RecyclerView.Adapter<NovelAdapter.ViewHolder> {

    private List<Book> detailList;

    public NovelAdapter (List<Book> detailList) {
        this.detailList = detailList;
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        View novelView;
        TextView bookName;
        TextView authorName;
//        TextView bookDesc;

        public ViewHolder (View view) {
            super(view);
            novelView = view;
            bookName = view.findViewById(R.id.book_name);
            authorName = view.findViewById(R.id.author_name);
//            bookDesc = view.findViewById(R.id.book_desc);
        }

    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.view_novel_list,
                viewGroup, false);

        final ViewHolder holder = new ViewHolder(view);

        holder.novelView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int position = holder.getAdapterPosition();
                Book book = detailList.get(position);

                IntroActivity.actionStart(view.getContext(), book.getBook_url());
            }
        });

        return holder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder viewHolder, int i) {
        Book book = detailList.get(i);
        viewHolder.authorName.setText(book.getAuthor_name());
        viewHolder.bookName.setText(book.getBook_name());
//        viewHolder.bookDesc.setText(book.getBook_desc());
    }

    @Override
    public int getItemCount() {
        return detailList.size();
    }
}
