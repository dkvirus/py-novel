package top.dkvirus.novel.pages.login;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.design.widget.BottomNavigationView;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;
import top.dkvirus.novel.pages.R;
import top.dkvirus.novel.pages.index.MainActivity;
import top.dkvirus.novel.pages.signup.SignupActivity;
import top.dkvirus.novel.utils.HttpUtil;

public class LoginFragment extends Fragment implements View.OnClickListener {

    private static final String TAG = "LoginFragment";

    private TextView mUsername;

    private TextView mPassword;

    private Button mSigninBtn;

    private Button mSignupBtn;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_login, container, false);

        mUsername = view.findViewById(R.id.login_username);
        mPassword = view.findViewById(R.id.login_password);
        mSigninBtn = view.findViewById(R.id.signin_btn);
        mSignupBtn = view.findViewById(R.id.signup_btn);

        mSigninBtn.setOnClickListener(this);
        mSignupBtn.setOnClickListener(this);

        return view;
    }

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

        HttpUtil.get("/gysw/user/info", map, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d(TAG, "onFailure: 查询用户信息失败");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                Log.d(TAG, "onResponse: 查询用户信息成功");

                MainActivity activity = (MainActivity) getActivity();
                MainActivity.actionStart(activity);
            }
        });
    }

    /**
     * 跳转注册页面
     */
    private void handleGoSignup () {
        MainActivity activity = (MainActivity) getActivity();
        SignupActivity.actionStart(activity);
    }
}
