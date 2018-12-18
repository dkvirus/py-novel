package top.dkvirus.novel.pages.index;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import top.dkvirus.novel.configs.Constant;
import top.dkvirus.novel.models.Classify;
import top.dkvirus.novel.models.ClassifyVo;
import top.dkvirus.novel.models.Novel;
import top.dkvirus.novel.models.NovelListVo;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.utils.HttpUtil;

public class ClassifyFragment extends Fragment {

    private static final String TAG = Constant.LOG;

    private RecyclerView classifyView;

    private RecyclerView novelView;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_classify, container, false);

        classifyView = view.findViewById(R.id.classify_list_view);
        novelView = view.findViewById(R.id.novel_list_view);

        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(view.getContext());
        classifyView.setLayoutManager(linearLayoutManager);

        LinearLayoutManager linearLayoutManager2 = new LinearLayoutManager(view.getContext());
        novelView.setLayoutManager(linearLayoutManager2);


        handleGetClassify();

        return view;
    }

    /**
     * 获取小说分类列表
     */
    private void handleGetClassify () {
        Call<ClassifyVo> call = HttpUtil.getApiService().getClassify();
        call.enqueue(new retrofit2.Callback<ClassifyVo>() {

            @Override
            public void onResponse(Call<ClassifyVo> call, final Response<ClassifyVo> response) {
                Log.d(TAG, "onResponse: 查询小说分类成功");

                final List<Classify> classifyList = response.body().getData();

                MainActivity mainActivity = (MainActivity) getActivity();
                mainActivity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        ClassifyAdapter classifyAdapter = new ClassifyAdapter(classifyList);
                        classifyView.setAdapter(classifyAdapter);
                    }
                });


                if (classifyList == null) {
                    return;
                }

                // 根据分类查询小说
                handleGetNovelByClassifyId(classifyList.get(0).getId());
            }

            @Override
            public void onFailure(retrofit2.Call<ClassifyVo> call, Throwable t) {
                Log.d(TAG, "onFailure: 查询小说分类失败");
            }
        });
    }

    /**
     * 根据小说分类 id 获取对应的小说列表
     * @param classifyId 小说分类 id
     */
    private void handleGetNovelByClassifyId (int classifyId) {

        Map<String, Object> map = new HashMap<>();
        map.put("classify_id", classifyId);

        Call<NovelListVo> call = HttpUtil.getApiService().getSearchNovel(map);
        call.enqueue(new Callback<NovelListVo>() {
            @Override
            public void onResponse(Call<NovelListVo> call, Response<NovelListVo> response) {
                Log.d(TAG, "onResponse: 根据分类查询小说成功");

                final List<Novel> novelList = response.body().getData();

                MainActivity activity = (MainActivity) getActivity();
                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {

                        NovelAdapter novelAdapter = new NovelAdapter(novelList);
                        novelView.setAdapter(novelAdapter);
                    }
                });
            }

            @Override
            public void onFailure(Call<NovelListVo> call, Throwable t) {
                Log.d(TAG, "onFailure: 根据分类查询小说失败");
            }
        });

    }
}
