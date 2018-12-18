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

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import top.dkvirus.novel.configs.Constant;
import top.dkvirus.novel.models.CommonVo;
import top.dkvirus.novel.models.Novel;
import top.dkvirus.novel.models.NovelVo;
import top.dkvirus.novel.models.Shelf;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.pages.index.MainActivity;
import top.dkvirus.novel.utils.HttpUtil;

public class IntroActivity extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = Constant.LOG;

    private Novel mNovel;

    private TextView mBookName;

    private TextView mAuthorName;

    private TextView mLastUpdateAt;

    private TextView mClassifyName;

    private TextView mBookDesc;

    private Button mJoinShelf;

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
        mBookName = findViewById(R.id.book_name);
        mAuthorName = findViewById(R.id.author_name);
        mLastUpdateAt = findViewById(R.id.last_update_at);
        mClassifyName = findViewById(R.id.classify_name);
        mBookDesc = findViewById(R.id.book_desc);
        mJoinShelf = findViewById(R.id.join_shelf);

        mJoinShelf.setOnClickListener(this);

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

    /**
     * 点击事件
     */
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

        Shelf shelf = new Shelf();
        shelf.setAuthorName(mNovel.getAuthorName());
        shelf.setBookName(mNovel.getBookName());
        shelf.setBookDesc(mNovel.getBookDesc());
        shelf.setBookCoverUrl(mNovel.getBookCoverUrl());
        shelf.setRecentChapterUrl(mNovel.getRecentChapterUrl());
        shelf.setUserId(userId);


        Call<CommonVo> call = HttpUtil.getApiService().addShelf(shelf);
        call.enqueue(new Callback<CommonVo>() {
            @Override
            public void onResponse(Call<CommonVo> call, Response<CommonVo> response) {
                Log.d(TAG, "onResponse: 将小说添加到书架成功");

                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                    // 跳转到书架页面
                    MainActivity.actionStart(IntroActivity.this);
                    }
                });
            }

            @Override
            public void onFailure(Call<CommonVo> call, Throwable t) {
                Log.d(TAG, "onFailure: 将小说添加到书架失败");
            }
        });

    }

    /**
     * 请求小说详情
     */
    private void handleSearchNovel (String novelUrl) {
        Call<NovelVo> call = HttpUtil.getApiService().getDetail(novelUrl);
        call.enqueue(new Callback<NovelVo>() {
            @Override
            public void onResponse(Call<NovelVo> call, Response<NovelVo> response) {
                Log.d(TAG, "onResponse: 请求小说详情成功");

                showDetail(response.body().getData());            }

            @Override
            public void onFailure(Call<NovelVo> call, Throwable t) {
                Log.d(TAG, "onFailure: 请求小说详情失败");
            }
        });

    }

    /**
     * 显示小说详情信息
     */
    private void showDetail (final Novel novel) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mNovel = novel;

                mBookName.setText(mNovel.getBookName());
                mAuthorName.setText(mNovel.getAuthorName());
                mLastUpdateAt.setText(mNovel.getLastUpdateAt().toString());
                mClassifyName.setText(mNovel.getClassifyName());
                mBookDesc.setText(mNovel.getBookDesc());
            }
        });

    }
}
