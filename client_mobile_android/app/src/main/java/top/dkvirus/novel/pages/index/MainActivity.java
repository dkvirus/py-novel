package top.dkvirus.novel.pages.index;

import android.app.ActionBar;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.BottomNavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import top.dkvirus.novel.configs.Constant;
import top.dkvirus.novel.pages.classify.ClassifyFragment;
import top.dkvirus.novel.pages.login.LoginFragment;
import top.dkvirus.novel.pages.search.SearchActivity;

import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.pages.signin.SigninActivity;
import top.dkvirus.novel.pages.signup.SignupActivity;

public class MainActivity extends AppCompatActivity{

    private static final String TAG = Constant.LOG;

    private RecyclerView mRecycleView;

    // 底部导航栏
    private BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = new BottomNavigationView.OnNavigationItemSelectedListener() {

        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {
            switch (item.getItemId()) {
                case R.id.navigation_index:
                    replaceFragment(new IndexFragment());
                    return true;
                case R.id.navigation_classify:
                    replaceFragment(new ClassifyFragment());
                    return true;
            }
            return false;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Log.d(TAG, "onCreate: 进入我的书架页面");
        
        // 底部导航条处理
        BottomNavigationView navigation = (BottomNavigationView) findViewById(R.id.navigation);
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);


//        SharedPreferences.Editor editor = getSharedPreferences("data", MODE_PRIVATE).edit();
//
//        // 开始存数据
//        editor.putBoolean("isLogin", false);
//        editor.putInt("userId", -1);
//
//        editor.apply();
//        return;

        // 获取登录状态
        SharedPreferences preferences = getSharedPreferences("data", MODE_PRIVATE);
        Boolean isLogin = preferences.getBoolean("isLogin", false);
        int userId = preferences.getInt("userId", -1);

        Log.d(TAG, "onCreate: isLogin = " + isLogin);
        Log.d(TAG, "onCreate: userId = " + userId);

        if (isLogin == true) {
            replaceFragment(new IndexFragment());
        } else {
            SigninActivity.actionStart(MainActivity.this);
        }

    }

    /**
     * 页面跳转传参
     */
    public static void actionStart (Context context) {
        Intent intent = new Intent(context, MainActivity.class);
        context.startActivity(intent);
    }

    /**
     * 创建标题栏上面的按钮
     */
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.indexbar, menu);
        return true;
    }

    /**
     * 选中按钮触发事件
     */
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.add_item:
                SearchActivity.actionStart(this);
                break;
            case R.id.edit_item:
                Toast.makeText(MainActivity.this, "You clicked edit",
                        Toast.LENGTH_SHORT).show();
                break;
            default:
        }

        return true;
    }

    /**
     * 替换碎片
     */
    private void replaceFragment (Fragment fragment) {
        FragmentManager manager = getSupportFragmentManager();
        FragmentTransaction transaction = manager.beginTransaction();
        transaction.replace(R.id.wrapper, fragment);
        transaction.commit();
    }

}
