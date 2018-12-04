package top.dkvirus.novel.utils;

public interface HttpCallbackListener {

    void onFinish(String response);

    void onError(Exception e);

}
