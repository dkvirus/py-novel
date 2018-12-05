package top.dkvirus.novel.pages.search;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.util.List;

import top.dkvirus.novel.models.Search;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.pages.intro.IntroActivity;

public class SearchAdapter extends RecyclerView.Adapter<SearchAdapter.ViewHolder> {

    private List<Search> searchList;

    static class ViewHolder extends  RecyclerView.ViewHolder {
        View searchView;
        RelativeLayout searchWrap;
        TextView novelAuthorName;
        TextView novelBookName;

        public ViewHolder(View view) {
            super(view);
            searchView = view;
            this.searchWrap = view.findViewById(R.id.search_wrap);
            this.novelAuthorName = view.findViewById(R.id.author_name);
            this.novelBookName = view.findViewById(R.id.book_name);
        }
    }

    public SearchAdapter(List<Search> searchList) {
        this.searchList = searchList;
    }

    @Override
    public SearchAdapter.ViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.view_search_list,
                viewGroup, false);

        final SearchAdapter.ViewHolder holder = new SearchAdapter.ViewHolder(view);

        // 给整个 view 绑定事件
        holder.searchWrap.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int position = holder.getAdapterPosition();
                Search search = searchList.get(position);

                IntroActivity.actionStart(view.getContext(), search.getBook_url());
            }
        });

        return holder;
    }

    @Override
    public void onBindViewHolder(SearchAdapter.ViewHolder holder, int position) {
        Search search = searchList.get(position);
        holder.novelAuthorName.setText(search.getAuthor_name());
        holder.novelBookName.setText(search.getBook_name());
    }

    @Override
    public int getItemCount() {
        return searchList.size();
    }
}
