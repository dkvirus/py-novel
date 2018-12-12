package top.dkvirus.novel.pages.read;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.reflect.TypeToken;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;
import top.dkvirus.novel.configs.Api;
import top.dkvirus.novel.configs.Constant;
import top.dkvirus.novel.models.Chapter;
import top.dkvirus.novel.models.ChapterResult;
import top.dkvirus.novel.models.Novel;
import top.dkvirus.novel.models.NovelResult;
import top.dkvirus.novel.models.ShelfResult;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.pages.index.ShelfAdapter;
import top.dkvirus.novel.pages.search.SearchActivity;
import top.dkvirus.novel.utils.HttpUtil;

public class ReadActivity extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = Constant.LOG;

    private WebView content;

    private TextView title;

    private Novel novel;

    private List<Chapter> chapterList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_read);

        Log.d(TAG, "onCreate: 进入小说阅读页面");
        
        // 接收其它页面传递过来的参数
        Intent intent = getIntent();
        String chapterUrl = intent.getStringExtra("chapterUrl");

        // 获取页面控件
        content = findViewById(R.id.book_content);
        title = findViewById(R.id.book_title);

        Button prevBtn = findViewById(R.id.btn_prev);
        Button nextBtn = findViewById(R.id.btn_next);

        prevBtn.setOnClickListener(this);
        nextBtn.setOnClickListener(this);

        handleSearchDetail(chapterUrl, false);
        handleSearchChapter(chapterUrl);
    }

    /**
     * 处理页面跳转
     */
    public static void actionStart (Context context, String chapterUrl) {
        Intent intent = new Intent(context, ReadActivity.class);
        intent.putExtra("chapterUrl", chapterUrl);
        context.startActivity(intent);
    }

    /**
     * 查询小说章节
     */
    private void handleSearchChapter (String chapterUrl) {
        // https://www.biquge5200.cc/98_98081/155293499.html
        // https://www.biquge5200.cc/98_98081
        chapterUrl = chapterUrl.substring(0, chapterUrl.lastIndexOf("/"));

        Map<String, Object> map = new HashMap<>();
        map.put("url", chapterUrl);

        HttpUtil.get(Api.GET_NOVEL_CHAPTER, map, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: 查询小说章节失败");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                Log.d(TAG, "onResponse: 查询小说章节成功");

                String responseData =  response.body().string();
                ChapterResult chapterResult = HttpUtil.parseJSONWithGSON(responseData, new TypeToken<ChapterResult>(){});

            }
        });


    }

    /**
     * 查询内容详情
     */
    private void handleSearchDetail (final String chapterUrl, final Boolean isUpdate) {
        HttpUtil.get(Api.GET_NOVEL_CONTENT + "?url=" + chapterUrl,
            new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    Log.d(TAG, "onFailure: 请求小说内容失败");
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    Log.d(TAG, "onResponse: 请求小说内容成功");

                    String responseData =  response.body().string();
                    NovelResult novelResult = HttpUtil.parseJSONWithGSON(responseData, new TypeToken<NovelResult>(){});

                    showContent(novelResult);

                    // 更新章节
                    if (isUpdate == true) {
                        Map<String, Object> map = new HashMap<>();
                        map.put("recent_chapter_url", chapterUrl);

                        // 获取当前登录用户 ID
                        SharedPreferences preferences = getSharedPreferences("data", MODE_PRIVATE);
                        int userId = preferences.getInt("userId", 0);

                        HttpUtil.put(Api.EDIT_SHELF + "/" + userId, null, new Callback() {
                            @Override
                            public void onFailure(Call call, IOException e) {
                                Log.d(TAG, "onFailure: 更新最新阅读章节失败");
                            }

                            @Override
                            public void onResponse(Call call, Response response) throws IOException {
                                Log.d(TAG, "onResponse: 更新最新阅读章节成功");
                            }
                        });
                    }

                }
            });
    }

    private void showContent (final NovelResult novelResult) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                novel = novelResult.getData();
                Log.d(TAG, "run: " + novel.toString());

                content.loadDataWithBaseURL(null, novel.getContent(), "text/html", "utf-8", null);
                title.setText(novel.getTitle());
            }
        });

    }

    @Override
    public void onClick(View view) {

        Log.d(TAG, "onClick: " + novel.getNext_url());
        Log.d(TAG, "onClick: " + novel.getNext_url().indexOf(".html"));

        switch (view.getId()) {
            case R.id.btn_prev:
                Log.d(TAG, "onClick: 上一章");
                if (novel.getPrev_url().indexOf(".html") == -1) {
                    Toast.makeText(ReadActivity.this, "没有更多了", Toast.LENGTH_SHORT).show();
                    return;
                }

                handleSearchDetail(novel.getPrev_url(), true);
                break;
            case R.id.btn_next:
                Log.d(TAG, "onClick: 下一章");

                if (novel.getNext_url().indexOf(".html") == -1) {
                    Toast.makeText(ReadActivity.this, "已经是最新章节了", Toast.LENGTH_SHORT).show();
                    return;
                }
                handleSearchDetail(novel.getNext_url(), true);
                break;
        }
    }
}
