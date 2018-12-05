package top.dkvirus.novel.pages.intro;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;

import top.dkvirus.novel.pages.search.SearchActivity;

public class IntroActivity extends AppCompatActivity {

    private static final String TAG = "IntroActivity";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        String novelUrl = intent.getStringExtra("novelUrl");
        Log.d(TAG, "onCreate: " + novelUrl);
    }

    public static void actionStart (Context context, String novelUrl) {
        Intent intent = new Intent(context, IntroActivity.class);
        intent.putExtra("novelUrl", novelUrl);
        context.startActivity(intent);
    }
}
