package top.dkvirus.novel.pages.search;

import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.gson.reflect.TypeToken;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Response;
import top.dkvirus.novel.models.SearchResult;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.utils.HttpUtil;

public class SearchActivity extends AppCompatActivity implements View.OnClickListener{

    private static final String TAG = "SearchActivity";

    private EditText editText;

    private RecyclerView mRecyclerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);

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


        // 请求用户数据
        HttpUtil.sendOkHttpRequest("https://novel.dkvirus.top/api/v2/gysw/search/novel?keyword=" + keyword,
            new okhttp3.Callback() {

                @Override
                public void onFailure(Call call, IOException e) {
                    Log.d(TAG, "onFailure: 请求列表失败");
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    Log.d(TAG, "请求书架列表成功");

                    String responseData =  response.body().string();
                    SearchResult searchResult = HttpUtil.parseJSONWithGSON(responseData, new TypeToken<SearchResult>(){});

                    showSearchList(searchResult);
                }
            });


        // 内容不为空，发请求，请求回来之后展示列表
    }

    /**
     * 展示书架列表
     */
    private void showSearchList (final SearchResult result) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                SearchAdapter adapter = new SearchAdapter(result.getData());
                mRecyclerView.setAdapter(adapter);
            }
        });
    }
}
