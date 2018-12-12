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

import com.google.gson.reflect.TypeToken;

import java.io.IOException;
import java.util.List;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;
import top.dkvirus.novel.configs.Api;
import top.dkvirus.novel.configs.Constant;
import top.dkvirus.novel.models.BookResult;
import top.dkvirus.novel.models.Classify;
import top.dkvirus.novel.models.ClassifyResult;
import top.dkvirus.novel.models.DetailResult;
import top.dkvirus.novel.models.ShelfResult;
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

        HttpUtil.get(Api.GET_NOVEL_CLASSIFY, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: 查询小说分类失败");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                Log.d(TAG, "onResponse: 查询小说分类成功");

                String responseData =  response.body().string();
                final ClassifyResult classifyResult = HttpUtil.parseJSONWithGSON(responseData, new TypeToken<ClassifyResult>(){});

                MainActivity mainActivity = (MainActivity) getActivity();
                mainActivity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        ClassifyAdapter classifyAdapter = new ClassifyAdapter(classifyResult.getData());
                        classifyView.setAdapter(classifyAdapter);
                    }
                });

                List<Classify> classifyList = classifyResult.getData();

                if (classifyList == null) {
                    return;
                }

                // 根据分类查询小说
                handleGetNovelByClassifyId(classifyList.get(0).getId());
            }
        });

        return view;
    }

    private void handleGetNovelByClassifyId (int classifyId) {
        HttpUtil.get(Api.GET_SEARCH_NOVEL + "?classify_id=" + classifyId, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: 根据分类查询小说失败");
            }

            @Override
            public void onResponse(Call call, final Response response) throws IOException {
                Log.d(TAG, "onResponse: 根据分类查询小说成功");

                String responseData =  response.body().string();
                final BookResult detailResult = HttpUtil.parseJSONWithGSON(responseData, new TypeToken<BookResult>(){});

                MainActivity activity = (MainActivity) getActivity();
                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        NovelAdapter novelAdapter = new NovelAdapter(detailResult.getData());
                        novelView.setAdapter(novelAdapter);
                    }
                });

            }
        });
    }
}
