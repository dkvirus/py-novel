package top.dkvirus.novel.pages.index;

import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.List;

import top.dkvirus.novel.models.Novel;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.pages.intro.IntroActivity;

public class NovelAdapter extends RecyclerView.Adapter<NovelAdapter.ViewHolder> {

    private List<Novel> novelList;

    public NovelAdapter (List<Novel> novelList) {
        this.novelList = novelList;
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        View novelView;
        TextView bookName;
        TextView authorName;

        public ViewHolder (View view) {
            super(view);
            novelView = view;
            bookName = view.findViewById(R.id.book_name);
            authorName = view.findViewById(R.id.author_name);
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
                Novel novel = novelList.get(position);

                IntroActivity.actionStart(view.getContext(), novel.getBookUrl());
            }
        });

        return holder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder viewHolder, int i) {
        Novel novel = novelList.get(i);
        viewHolder.authorName.setText(novel.getAuthorName());
        viewHolder.bookName.setText(novel.getBookName());
    }

    @Override
    public int getItemCount() {
        return novelList.size();
    }
}
