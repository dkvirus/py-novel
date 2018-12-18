package top.dkvirus.novel.pages.search;

import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import top.dkvirus.novel.configs.Constant;
import top.dkvirus.novel.models.Novel;
import top.dkvirus.novel.models.NovelListVo;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.utils.HttpUtil;

public class SearchActivity extends AppCompatActivity implements View.OnClickListener{

    private static final String TAG = Constant.LOG;

    private EditText editText;

    private RecyclerView mRecyclerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);

        Log.d(TAG, "onCreate: 进入小说搜索页面");

        Button btnSearch = findViewById(R.id.btn_search);
        editText = findViewById(R.id.keyword);

        // 使用 recycleView 控件
        mRecyclerView = findViewById(R.id.search_list);
        GridLayoutManager manager = new GridLayoutManager(SearchActivity.this, 2);
        mRecyclerView.setLayoutManager(manager);

        btnSearch.setOnClickListener(this);
    }

    public static void actionStart (Context context) {
        Intent intent = new Intent(context, SearchActivity.class);
        context.startActivity(intent);
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.btn_search:
                handleSearchNovel();
                break;
        }
    }

    /**
     * 查询小说
     */
    private void handleSearchNovel () {
        // 获取文本框内容
        String keyword = editText.getText().toString();

        // 内容为空，弹框提示
        if (keyword.length() == 0) {
            Toast.makeText(SearchActivity.this, "查询字符串不能为空", Toast.LENGTH_SHORT).show();
            return;
        }

        // 内容不为空，发请求，请求回来之后展示列表
        Map<String, Object> map = new HashMap<>();
        map.put("keyword", keyword);
        Call<NovelListVo> call = HttpUtil.getApiService().getSearchNovel(map);
        call.enqueue(new Callback<NovelListVo>() {
            @Override
            public void onResponse(Call<NovelListVo> call, Response<NovelListVo> response) {
                Log.d(TAG, "onResponse: 根据关键字查询小说列表成功");

                showSearchList(response.body().getData());
            }

            @Override
            public void onFailure(Call<NovelListVo> call, Throwable t) {
                Log.d(TAG, "onFailure: 根据关键字查询小说列表失败");
            }
        });

    }

    /**
     * 展示书架列表
     */
    private void showSearchList (final List<Novel> novelList) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                SearchAdapter adapter = new SearchAdapter(novelList);
                mRecyclerView.setAdapter(adapter);
            }
        });
    }
}
