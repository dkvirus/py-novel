package top.dkvirus.novel.pages.signup;

import android.content.Context;
import android.content.Intent;
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
import top.dkvirus.novel.pages.signin.SigninActivity;
import top.dkvirus.novel.utils.HttpUtil;
import top.dkvirus.novel.utils.TimeCount;

public class SignupActivity extends AppCompatActivity implements View.OnClickListener{

    private static final String TAG = Constant.LOG;

    private TextView mUsername;

    private TextView mCode;

    private TextView mPassword;

    private Button mSmsBtn;

    private Button mSignupBtn;

    private TimeCount mTime;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        Log.d(TAG, "onCreate: 进入注册页面");

        mUsername = findViewById(R.id.username);
        mCode = findViewById(R.id.code);
        mPassword = findViewById(R.id.password);
        mSmsBtn = findViewById(R.id.sms_btn);
        mSignupBtn = findViewById(R.id.signup_btn);

        mSmsBtn.setOnClickListener(this);
        mSignupBtn.setOnClickListener(this);

        mTime = new TimeCount(60000, 1000, mSmsBtn);

    }

    /**
     * 按钮绑定事件
     */
    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.sms_btn:
                handleSendCode();
                break;
            case R.id.signup_btn:
                handleSignup();
                break;
        }
    }

    /**
     * 发送验证码
     */
    private void handleSendCode () {

        // 判断手机号输入是否为空
        String username = mUsername.getText().toString();

        if (username == "") {
            Toast
                .makeText(SignupActivity.this, "手机号不能为空", Toast.LENGTH_SHORT)
                .show();
            return;
        }

        Map<String, Object> map = new HashMap<>();
        map.put("mobile", mUsername.getText());

        HttpUtil.post(Api.SEND_MOBILE_CODE, map, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: 发送手机验证码失败");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                Log.d(TAG, "onResponse: 发送手机验证码成功");

                // 设置按钮 60s 内不可点击
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        // 弹窗提醒发送成功
                        Toast
                            .makeText(SignupActivity.this, "发送验证码成功", Toast.LENGTH_SHORT)
                            .show();

                        mTime.start();
                    }
                });

            }
        });
    }

    /**
     * 注册
     */
    private void handleSignup () {
        // 校验手机号是否已注册
        HttpUtil.get(Api.VALIDATE_USER_INFO + "?username=" + mUsername.getText(), new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: 校验用户是否已注册失败");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                Log.d(TAG, "onResponse: 校验用户是否已注册成功");

                String responseData =  response.body().string();
                UserVo userResult = HttpUtil.parseJSONWithGSON(responseData, new TypeToken<UserVo>(){});

                if (!"0000".equals(userResult.getCode())) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast
                                .makeText(SignupActivity.this, "注册失败：网络原因", Toast.LENGTH_SHORT)
                                .show();
                        }
                    });
                    return;
                }

                Log.d(TAG, "onResponse: " + userResult.getData().getId());

                if (userResult.getData().getId() != 0) {
                    Log.d(TAG, "onResponse: 用户名已注册");
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast
                                .makeText(SignupActivity.this, "注册失败：用户名已注册，请直接登录", Toast.LENGTH_SHORT)
                                .show();
                        }
                    });
                    return;
                }

                // 校验短信验证码是否正确
                Map<String, Object> map = new HashMap<>();
                map.put("mobile", mUsername.getText());
                map.put("code", mCode.getText());

                HttpUtil.post(Api.VALIDATE_MOBILE_CODE, map, new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        Log.d(TAG, "onFailure: 校验验证码失败");
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        Log.d(TAG, "onResponse: 校验验证码成功");

                        // 保存用户，跳转首页
                        Map<String, Object> map2 = new HashMap<>();
                        map2.put("username", mUsername.getText());
                        map2.put("password", mPassword.getText());
                        map2.put("client_type", "MOBILE");

                        // 新增用户
                        HttpUtil.post(Api.ADD_USER_INFO, map2, new Callback() {
                            @Override
                            public void onFailure(Call call, IOException e) {
                                Log.d(TAG, "onFailure: 新增用户失败");
                            }

                            @Override
                            public void onResponse(Call call, Response response) throws IOException {
                                Log.d(TAG, "onResponse: 新增用户成功");

                                // 跳转登录页面
                                SigninActivity.actionStart(SignupActivity.this);
                            }
                        });

                    }
                });
            }
        });


    }

    /**
     * 页面跳转传参
     */
    public static void actionStart (Context context) {
        Intent intent = new Intent(context, SignupActivity.class);
        context.startActivity(intent);
    }
}
