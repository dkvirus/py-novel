package top.dkvirus.novel.utils;

import android.os.CountDownTimer;
import android.widget.Button;

public class TimeCount extends CountDownTimer {

    private Button btn;

    public TimeCount(long millisInFuture, long countDownInterval, Button btn) {
        super(millisInFuture, countDownInterval);
        this.btn = btn;
    }

    @Override
    public void onTick(long millisUntilFinished) {
        btn.setTextSize(13);
        btn.setText(millisUntilFinished / 1000 +"秒");
        btn.setClickable(false);
    }

    @Override
    public void onFinish() {
        btn.setTextSize(13);
        btn.setText("再次接收");
        btn.setClickable(true);
    }

}
