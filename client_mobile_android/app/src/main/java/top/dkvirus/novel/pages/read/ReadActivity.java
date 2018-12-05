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

import com.google.gson.reflect.TypeToken;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Response;
import top.dkvirus.novel.models.Novel;
import top.dkvirus.novel.models.NovelResult;
import top.dkvirus.novel.models.ShelfResult;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.pages.index.ShelfAdapter;
import top.dkvirus.novel.pages.search.SearchActivity;
import top.dkvirus.novel.utils.HttpUtil;

public class ReadActivity extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = "ReadActivity";

    private WebView content;

    private TextView title;

    private Novel novel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_read);

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
    }

    public static void actionStart (Context context, String chapterUrl) {
        Intent intent = new Intent(context, ReadActivity.class);
        intent.putExtra("chapterUrl", chapterUrl);
        context.startActivity(intent);
    }

    /**
     * 查询内容详情
     */
    private void handleSearchDetail (String chapterUrl, Boolean isUpdate) {
        // 请求用户数据
        HttpUtil.sendOkHttpRequest("https://novel.dkvirus.top/api/v2/gysw/novel/content?url=" + chapterUrl,
            new okhttp3.Callback() {

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
                }
            });
    }

    private void showContent (final NovelResult novelResult) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                novel = novelResult.getData();

                content.loadDataWithBaseURL(null, novel.getContent(), "text/html", "utf-8", null);
                title.setText(novel.getTitle());
            }
        });

    }

    @Override
    public void onClick(View view) {
        if (novel.getPrev_url().indexOf(".html") == -1) {
            Toast.makeText(ReadActivity.this, "没有更多了", Toast.LENGTH_SHORT).show();
            return;
        }
        if (novel.getNext_url().indexOf(".html") == -1) {
            Toast.makeText(ReadActivity.this, "已经是最新章节了", Toast.LENGTH_SHORT).show();
            return;
        }

        switch (view.getId()) {
            case R.id.btn_prev:
                Log.d(TAG, "onClick: 上一章");
                handleSearchDetail(novel.getPrev_url(), true);
                break;
            case R.id.btn_next:
                Log.d(TAG, "onClick: 下一章");
                handleSearchDetail(novel.getNext_url(), true);
                break;
        }
    }
}
