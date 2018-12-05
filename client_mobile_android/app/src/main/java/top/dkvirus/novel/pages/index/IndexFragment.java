package top.dkvirus.novel.pages.index;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.io.IOException;

import com.google.gson.reflect.TypeToken;

import okhttp3.Call;
import okhttp3.Response;
import top.dkvirus.novel.models.ShelfResult;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.utils.HttpUtil;

public class IndexFragment extends Fragment {

    private static final String TAG = "IndexFragment";

    private RecyclerView mRecycleView;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_index, container, false);

        MainActivity activity = (MainActivity) getActivity();

        mRecycleView = view.findViewById(R.id.shelf_list);
        GridLayoutManager manager = new GridLayoutManager(activity, 2);
        mRecycleView.setLayoutManager(manager);

        // 请求用户数据
        HttpUtil.sendOkHttpRequest("https://novel.dkvirus.top/api/v2/gysw/shelf/?user_id=9",
            new okhttp3.Callback() {

                @Override
                public void onFailure(Call call, IOException e) {

                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    String responseData =  response.body().string();
                    ShelfResult shelfResult = HttpUtil.parseJSONWithGSON(responseData, new TypeToken<ShelfResult>(){});

                    Log.d(TAG, "请求书架列表成功");
                    showShelfList(shelfResult);
                }
            });

        return view;
    }

    /**
     * 展示书架列表
     */
    private void showShelfList (final ShelfResult result) {
        MainActivity activity = (MainActivity) getActivity();
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ShelfAdapter adapter = new ShelfAdapter(result.getData());
                mRecycleView.setAdapter(adapter);
            }
        });
    }


}
