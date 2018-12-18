package top.dkvirus.novel.utils;

import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import top.dkvirus.novel.configs.Config;
import top.dkvirus.novel.configs.Constant;
import top.dkvirus.novel.pages.BuildConfig;
import top.dkvirus.novel.services.ApiService;

public class HttpUtil {

    private static final String TAG = Constant.LOG;

    private static final String apiPrefix = Config.API_PREFIX;

    private static ApiService apiService = null;

    /**
     * 获取 apiService 实例对象
     */
    public static ApiService getApiService () {
        OkHttpClient.Builder client = new OkHttpClient.Builder();
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();

        // 生产/开发环境自动切换日志模式
        if (BuildConfig.DEBUG) {
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);
        } else {
            logging.setLevel(HttpLoggingInterceptor.Level.BASIC);
        }


        client.addInterceptor(logging);

        if (apiService == null) {
            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl("https://novel.dkvirus.top/api/test/")
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(client.build())
                    .build();

            apiService = retrofit.create(ApiService.class);
        }

        return apiService;
    }

    /**
     * get 请求
     */
    public static void get (String url, Callback callback) {
        OkHttpClient client = new OkHttpClient();
        url = apiPrefix + url;

        Request request = new Request.Builder()
                .url(url)
                .build();

        client.newCall(request).enqueue(callback);
    }

    /**
     * get 请求传参
     */
    public static void get (String url, Map<String, Object> map, Callback callback) {
        OkHttpClient client = new OkHttpClient();
        url = apiPrefix + url + "?1=1";

        for (String key : map.keySet()) {
            url += "&" + key + "=" + map.get(key);
        }

        Request request = new Request.Builder()
                .url(url)
                .build();

        client.newCall(request).enqueue(callback);
    }

    /**
     * post 请求
     */
    public static void post (String url, Map<String, Object> map, Callback callback) {
        OkHttpClient client = new OkHttpClient();
        url = apiPrefix + url;

        MediaType JSON = MediaType.parse("application/json; charset=utf-8");
        JSONObject jsonObject = new JSONObject();

        try {
            for (String key : map.keySet()) {
                jsonObject.put(key, map.get(key));
            }
        } catch (JSONException e) {
            Log.d(TAG, "POST 请求 json 格式参数解析错误");
            e.printStackTrace();
        }

        Log.d(TAG, "POST 请求参数：" + jsonObject.toString());

        RequestBody body = RequestBody.create(JSON, jsonObject.toString());
        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();

        client.newCall(request).enqueue(callback);
    }

    /**
     * delete 请求
     */
    public static void delete (String url, Callback callback) {
        OkHttpClient client = new OkHttpClient();
        url = apiPrefix + url;

        Request request = new Request.Builder()
                .url(url)
                .delete()
                .build();

        client.newCall(request).enqueue(callback);
    }

    /**
     * put 请求
     */
    public static void put (String url, Map<String, Object> map, Callback callback) {
        OkHttpClient client = new OkHttpClient();
        url = apiPrefix + url;

        MediaType JSON = MediaType.parse("application/json; charset=utf-8");
        JSONObject jsonObject = new JSONObject();

        try {
            for (String key : map.keySet()) {
                jsonObject.put(key, map.get(key));
            }
        } catch (JSONException e) {
            Log.d(TAG, "PUT 请求 json 格式参数解析错误");
            e.printStackTrace();
        }

        RequestBody body = RequestBody.create(JSON, jsonObject.toString());
        Request request = new Request.Builder()
                .url(url)
                .put(body)
                .build();

        client.newCall(request).enqueue(callback);
    }

    /**
     * 解析 json
     * @return
     */
    public static <T> T parseJSONWithGSON (String jsonData, TypeToken<T> typeToken) {
        Gson gson = new Gson();
        T t = gson.fromJson(jsonData, typeToken.getType());
        return t;
    }

}
