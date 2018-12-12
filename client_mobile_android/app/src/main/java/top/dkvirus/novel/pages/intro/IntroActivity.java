package top.dkvirus.novel.pages.intro;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.google.gson.reflect.TypeToken;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;
import top.dkvirus.novel.configs.Api;
import top.dkvirus.novel.configs.Constant;
import top.dkvirus.novel.models.Detail;
import top.dkvirus.novel.models.DetailResult;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.pages.index.MainActivity;
import top.dkvirus.novel.utils.HttpUtil;

public class IntroActivity extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = Constant.LOG;

    private Detail detail;

    private TextView book_name;

    private TextView author_name;

    private TextView last_update_at;

    private TextView classify_name;

    private TextView book_desc;

    private Button join_shelf;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_intro);

        Log.d(TAG, "onCreate: 进入小说介绍页面");
        
        // 接收其它页面传递过来的参数
        Intent intent = getIntent();
        String novelUrl = intent.getStringExtra("novelUrl");
        Log.d(TAG, "onCreate: " + novelUrl);

        // 初始化控件
        book_name = findViewById(R.id.book_name);
        author_name = findViewById(R.id.author_name);
        last_update_at = findViewById(R.id.last_update_at);
        classify_name = findViewById(R.id.classify_name);
        book_desc = findViewById(R.id.book_desc);
        join_shelf = findViewById(R.id.join_shelf);

        join_shelf.setOnClickListener(this);

        handleSearchNovel(novelUrl);
    }

    /**
     * 页面跳转传参
     */
    public static void actionStart (Context context, String novelUrl) {
        Intent intent = new Intent(context, IntroActivity.class);
        intent.putExtra("novelUrl", novelUrl);
        context.startActivity(intent);
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.join_shelf:
                Log.d(TAG, "onClick: 将小说加入书架");
                handleJoinShelf();
        }
    }

    /**
     * 加入书架
     */
    private void handleJoinShelf () {
        // 获取登录状态
        SharedPreferences preferences = getSharedPreferences("data", MODE_PRIVATE);
        int userId = preferences.getInt("userId", -1);

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("author_name", detail.getAuthor_name());
        map.put("book_name", detail.getBook_name());
        map.put("book_desc", detail.getBook_desc());
        map.put("book_cover_url", "https://novel.dkvirus.top/images/cover.png");
        map.put("recent_chapter_url", detail.getRecent_chapter_url());
        map.put("user_id", userId);

        HttpUtil.post(Api.ADD_SHELF, map, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: 将小说添加到书架失败");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                Log.d(TAG, "onResponse: 将小说添加到书架成功");

                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        // 跳转到书架页面
                        MainActivity.actionStart(IntroActivity.this);
                    }
                });
            }
        });

    }

    /**
     * 请求小说详情
     */
    private void handleSearchNovel (String novelUrl) {
        HttpUtil.get(Api.GET_NOVEL_INTRO + "?url=" + novelUrl,
            new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    Log.d(TAG, "onFailure: 请求小说详情失败");
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    Log.d(TAG, "onResponse: 请求小说详情成功");

                    String responseData =  response.body().string();
                    DetailResult detailResult = HttpUtil.parseJSONWithGSON(responseData, new TypeToken<DetailResult>(){});

                    showDetail(detailResult);
                }
            });
    }

    /**
     * 显示小说详情信息
     */
    private void showDetail (final DetailResult detailResult) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                detail = detailResult.getData();

                book_name.setText(detail.getBook_name());
                author_name.setText(detail.getAuthor_name());
                last_update_at.setText(detail.getLast_update_at());
                classify_name.setText(detail.getClassify_name());
                book_desc.setText(detail.getBook_desc());
            }
        });

    }
}
