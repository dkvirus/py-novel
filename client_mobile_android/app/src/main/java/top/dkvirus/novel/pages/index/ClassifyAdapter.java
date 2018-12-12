package top.dkvirus.novel.pages.index;

import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import java.util.List;

import top.dkvirus.novel.models.Classify;
import top.dkvirus.novel.pages.R;

public class ClassifyAdapter extends RecyclerView.Adapter<ClassifyAdapter.ViewHolder> {

    private List<Classify> classifyList;

    public ClassifyAdapter (List<Classify> classifyList) {
        this.classifyList = classifyList;
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView classifyName;

        public ViewHolder (View view) {
            super(view);
            classifyName = view.findViewById(R.id.classify_name);
        }
    }

    /**
     * 初始化列表项控件
     */
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.view_classify_list,
                viewGroup, false);

        final ViewHolder holder = new ViewHolder(view);

        holder.classifyName.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int position = holder.getAdapterPosition();
                Classify classify = classifyList.get(position);
                Toast.makeText(view.getContext(), "click" + classify.getDesc(), Toast.LENGTH_SHORT)
                    .show();

            }
        });

        return holder;
    }

    @Override
    public void onBindViewHolder(ViewHolder viewHolder, int i) {
        Classify classify = classifyList.get(i);
        viewHolder.classifyName.setText(classify.getDesc());
    }

    @Override
    public int getItemCount() {
        return classifyList.size();
    }
}
