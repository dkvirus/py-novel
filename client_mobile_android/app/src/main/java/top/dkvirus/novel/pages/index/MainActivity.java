package top.dkvirus.novel.pages.index;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;

import com.google.gson.reflect.TypeToken;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Response;
import top.dkvirus.novel.models.ShelfResult;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.utils.HttpUtil;

public class MainActivity extends AppCompatActivity{

    private static final String TAG = "MainActivity";

    private RecyclerView mRecycleView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mRecycleView = findViewById(R.id.shelf_list);
        GridLayoutManager manager = new GridLayoutManager(this, 2);
        mRecycleView.setLayoutManager(manager);

        // 请求用户数据
        HttpUtil.sendOkHttpRequest("https://novel.dkvirus.top/api/v2/gysw/shelf/?user_id=9",
            new okhttp3.Callback() {

                @Override
                public void onFailure(Call call, IOException e) {

                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    String responseData =  response.body().string();
                    ShelfResult shelfResult = HttpUtil.parseJSONWithGSON(responseData, new TypeToken<ShelfResult>(){});

                    Log.d(TAG, "请求书架列表成功");
                    showShelfList(shelfResult);
                }
            });
    }

    /**
     * 展示书架列表
     */
    private void showShelfList (final ShelfResult result) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ShelfAdapter adapter = new ShelfAdapter(result.getData());
                mRecycleView.setAdapter(adapter);
            }
        });
    }

}
