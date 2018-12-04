package top.dkvirus.novel.pages.index;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.util.List;

import top.dkvirus.novel.models.Shelf;
import top.dkvirus.novel.pages.R;

public class ShelfAdapter extends RecyclerView.Adapter<ShelfAdapter.ViewHolder> {

    private List<Shelf> shelfList;

    static class ViewHolder extends  RecyclerView.ViewHolder {
        View novelView;
        RelativeLayout novelCover;
        TextView novelAuthorName;
        TextView novelBookName;

        public ViewHolder(View view) {
            super(view);
            novelView = view;
            this.novelCover = view.findViewById(R.id.novel_cover);
            this.novelAuthorName = view.findViewById(R.id.novel_author);
            this.novelBookName = view.findViewById(R.id.novel_book);
        }
    }

    public ShelfAdapter(List<Shelf> shelfList) {
        this.shelfList = shelfList;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.view_shelf_list,
                viewGroup, false);

        final ViewHolder holder = new ViewHolder(view);

        // 给整个 view 绑定事件
        holder.novelCover.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int position = holder.getAdapterPosition();
                Shelf shelf = shelfList.get(position);
                Toast.makeText(view.getContext(), "You click view " + shelf.getBook_desc(),
                        Toast.LENGTH_SHORT).show();
            }
        });

        return holder;
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Shelf shelf = shelfList.get(position);
        holder.novelAuthorName.setText(shelf.getAuthor_name());
        holder.novelBookName.setText(shelf.getBook_name());
    }

    @Override
    public int getItemCount() {
        return shelfList.size();
    }
}
