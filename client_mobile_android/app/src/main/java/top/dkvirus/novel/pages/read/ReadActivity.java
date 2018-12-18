package top.dkvirus.novel.pages.read;

import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import top.dkvirus.novel.configs.Constant;
import top.dkvirus.novel.models.Chapter;
import top.dkvirus.novel.models.ChapterVo;
import top.dkvirus.novel.models.CommonVo;
import top.dkvirus.novel.models.Content;
import top.dkvirus.novel.models.ContentVo;
import top.dkvirus.novel.models.Shelf;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.utils.HttpUtil;

public class ReadActivity extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = Constant.LOG;

    private WebView body;

    private TextView title;

    private Content content;

    private int shelfId;

    private List<Chapter> chapterList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_read);

        Log.d(TAG, "onCreate: 进入小说阅读页面");
        
        // 接收其它页面传递过来的参数
        Intent intent = getIntent();
        String chapterUrl = intent.getStringExtra("chapterUrl");
        int id = intent.getIntExtra("id", -1);
        shelfId = id;

        // 获取页面控件
        body = findViewById(R.id.book_content);
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
    public static void actionStart (Context context, String chapterUrl, int id) {
        Intent intent = new Intent(context, ReadActivity.class);
        intent.putExtra("chapterUrl", chapterUrl);
        intent.putExtra("id", id);
        context.startActivity(intent);
    }

    /**
     * 查询小说章节
     */
    private void handleSearchChapter (String chapterUrl) {
        // https://www.biquge5200.cc/98_98081/155293499.html
        // https://www.biquge5200.cc/98_98081
        chapterUrl = chapterUrl.substring(0, chapterUrl.lastIndexOf("/"));

        Call<ChapterVo> call = HttpUtil.getApiService().getChapter(chapterUrl);
        call.enqueue(new Callback<ChapterVo>() {
            @Override
            public void onResponse(Call<ChapterVo> call, retrofit2.Response<ChapterVo> response) {
                Log.d(TAG, "onResponse: 查询小说章节成功");
            }

            @Override
            public void onFailure(Call<ChapterVo> call, Throwable t) {
                Log.d(TAG, "onFailure: 查询小说章节失败");
            }
        });


    }

    /**
     * 查询内容详情
     */
    private void handleSearchDetail (final String chapterUrl, final Boolean isUpdate) {
        Call<ContentVo> call = HttpUtil.getApiService().getContent(chapterUrl);
        call.enqueue(new Callback<ContentVo>() {
            @Override
            public void onResponse(Call<ContentVo> call, retrofit2.Response<ContentVo> response) {
                Log.d(TAG, "onResponse: 请求小说内容成功");

                // 显示小说正文内容
                final Content result = response.body().getData();
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        content = result;

                        body.loadDataWithBaseURL(null, content.getContent(), "text/html", "utf-8", null);
                        title.setText(result.getTitle());
                    }
                });

                // 更新章节
                if (isUpdate == true) {

                    // TODO 不是根据 userid 更新的，是根据书架 id 更新的


                    Call<CommonVo> call2 = HttpUtil.getApiService().editShelf(shelfId, new Shelf(chapterUrl));
                    call2.enqueue(new Callback<CommonVo>() {
                        @Override
                        public void onResponse(Call<CommonVo> call, retrofit2.Response<CommonVo> response) {
                            Log.d(TAG, "onResponse: 更新最新阅读章节成功");
                        }

                        @Override
                        public void onFailure(Call<CommonVo> call, Throwable t) {
                            Log.d(TAG, "onFailure: 更新最新阅读章节失败");
                        }
                    });

                }
            }

            @Override
            public void onFailure(Call<ContentVo> call, Throwable t) {
                Log.d(TAG, "onFailure: 请求小说内容失败");
            }
        });

    }

    /**
     * 点击上一章/下一章按钮
     */
    @Override
    public void onClick(View view) {

        Log.d(TAG, "onClick: " + content.getNextUrl());
        Log.d(TAG, "onClick: " + content.getNextUrl().indexOf(".html"));

        switch (view.getId()) {
            case R.id.btn_prev:
                Log.d(TAG, "onClick: 上一章");
                if (content.getPrevUrl().indexOf(".html") == -1) {
                    Toast.makeText(ReadActivity.this, "没有更多了", Toast.LENGTH_SHORT).show();
                    return;
                }

                handleSearchDetail(content.getPrevUrl(), true);
                break;
            case R.id.btn_next:
                Log.d(TAG, "onClick: 下一章");

                if (content.getNextUrl().indexOf(".html") == -1) {
                    Toast.makeText(ReadActivity.this, "已经是最新章节了", Toast.LENGTH_SHORT).show();
                    return;
                }
                handleSearchDetail(content.getNextUrl(), true);
                break;
        }
    }
}
