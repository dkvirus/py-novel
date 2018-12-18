package top.dkvirus.novel.pages.signin;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.reflect.TypeToken;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;
import top.dkvirus.novel.configs.Api;
import top.dkvirus.novel.configs.Constant;
import top.dkvirus.novel.models.UserVo;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.pages.index.MainActivity;
import top.dkvirus.novel.pages.signup.SignupActivity;
import top.dkvirus.novel.utils.HttpUtil;

public class SigninActivity extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = Constant.LOG;

    private TextView mUsername;

    private TextView mPassword;

    private Button mSigninBtn;

    private Button mSignupBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signin);

        Log.d(TAG, "onCreate: 进入登录页面");

        mUsername = findViewById(R.id.login_username);
        mPassword = findViewById(R.id.login_password);
        mSigninBtn = findViewById(R.id.signin_btn);
        mSignupBtn = findViewById(R.id.signup_btn);

        mSigninBtn.setOnClickListener(this);
        mSignupBtn.setOnClickListener(this);
        
    }

    /**
     * 页面跳转传参
     */
    public static void actionStart (Context context) {
        Intent intent = new Intent(context, SigninActivity.class);
        context.startActivity(intent);
    }

    /**
     * 按钮绑定事件
     */
    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.signin_btn:
                handleLogin();
                break;
            case R.id.signup_btn:
                handleGoSignup();
        }
    }

    /**
     * 处理登录按钮
     */
    public void handleLogin () {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("username", mUsername.getText());
        map.put("password", mPassword.getText());
        map.put("client_type", "MOBILE");

        HttpUtil.get(Api.GET_USER_INFO, map, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: 查询用户信息失败");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                Log.d(TAG, "onResponse: 查询用户信息成功");

                String responseData =  response.body().string();
                UserVo userResult = HttpUtil.parseJSONWithGSON(responseData, new TypeToken<UserVo>(){});

                if (!"0000".equals(userResult.getCode())) {
                     runOnUiThread(new Runnable() {
                         @Override
                         public void run() {
                             Toast
                                 .makeText(SigninActivity.this, "登录失败：网络错误", Toast.LENGTH_SHORT)
                                 .show();
                         }
                     });
                     return;
                }

                if (userResult.getData().getId() == 0) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast
                                .makeText(SigninActivity.this, "登录失败：用户名或密码错误", Toast.LENGTH_SHORT)
                                .show();
                        }
                    });
                    return;
                }

                // 将用户信息保存到本地
                SharedPreferences.Editor editor = getSharedPreferences("data", MODE_PRIVATE).edit();
                editor.putInt("userId", userResult.getData().getId());
                editor.putBoolean("isLogin", true);
                editor.apply();

                MainActivity.actionStart(SigninActivity.this);
            }
        });
    }

    /**
     * 跳转注册页面
     */
    private void handleGoSignup () {
        SignupActivity.actionStart(SigninActivity.this);
    }
}
