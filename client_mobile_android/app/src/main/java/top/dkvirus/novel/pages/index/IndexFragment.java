package top.dkvirus.novel.pages.index;

import android.content.SharedPreferences;
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

import java.util.HashMap;
import java.util.Map;

import top.dkvirus.novel.models.ShelfVo;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.utils.HttpUtil;

import static android.content.Context.MODE_PRIVATE;

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

        // 获取
        int userId = getUserId();
        // 请求书架列表
        handleGetShelf(userId);

        return view;
    }

    /**
     * 获取本地缓存中的用户 ID
     */
    public int getUserId () {
        MainActivity mainActivity = (MainActivity) getActivity();
        SharedPreferences preferences = mainActivity.getSharedPreferences("data", MODE_PRIVATE);

        int userId = preferences.getInt("userId", 0);
        return userId;
    }

    /**
     * 获取用户拥有的书架列表
     */
    private void handleGetShelf (int userId) {
        Map<String, Object> map = new HashMap<>();
        map.put("user_id", userId);

        retrofit2.Call<ShelfVo> call = HttpUtil.getApiService().getShelf(map);
        call.enqueue(new retrofit2.Callback<ShelfVo>() {

            @Override
            public void onResponse(retrofit2.Call<ShelfVo> call, final retrofit2.Response<ShelfVo> response) {
                Log.d(TAG, "onResponse: 请求书架列表成功");

                final ShelfVo shelfVo = response.body();

                // 展示书架列表
                MainActivity activity2 = (MainActivity) getActivity();
                activity2.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        ShelfAdapter adapter = new ShelfAdapter(shelfVo.getData());
                        mRecycleView.setAdapter(adapter);
                    }
                });
            }

            @Override
            public void onFailure(retrofit2.Call<ShelfVo> call, Throwable t) {
                Log.d(TAG, "onFailure: 请求书架列表失败");
            }
        });
    }

}
