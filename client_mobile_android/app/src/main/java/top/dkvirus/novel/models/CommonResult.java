package top.dkvirus.novel.models;

/**
 * 通用响应体
 *
 * {
 *     code: '0000',
 *     message: 'xxxxx',
 *     data: {}
 * }
 *
 * 其中 code 和 message 字段确定就是个字符串，
 * data 字段不确定值，可能是个数组(List集合)，也可能是个对象(Map集合)
 */
public class CommonResult {

    private String code;

    private String message;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
