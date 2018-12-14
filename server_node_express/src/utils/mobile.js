const { mobile_appid, mobile_appkey, mobile_signature, mobile_templateId } = require('../../config');
const QcloudSms = require('qcloudsms_js');

function callback(err, res, resData) {
    if (err) {
        console.log("err: ", err);
    } else {
        console.log("request data: ", res.req);
        console.log("response data: ", resData);
    }
}

/**
 * mobile 可以传一个数组，也可以传一个字符串
 */
exports.sendMobileSms = function (mobile, params = []) {
    return new Promise(function (resolve, reject) {

        const qcloudsms = QcloudSms(mobile_appid, mobile_appkey);

        const pattern = /^1[3578][0-9]{8}[0-9]$/g;
        if (!(new RegExp(pattern).test(mobile))) {
            return reject({ code: '9999', message: '短信验证码发送失败：手机号码格式错误' });
        }
        if (params.length !== 2) {
            return reject({ code: '9999', message: '短信验证码发送失败：短信模板参数传递错误' });
        }

        try {
            const ssender = qcloudsms.SmsSingleSender();
            ssender.sendWithParam(86, mobile, mobile_templateId,
                params, mobile_signature, "", "", function callback(err, res, resData) {
                    if (err) {
                        return reject({ code: '9999', message: `短信验证码发送失败：${err}` });
                    } else {
                        return resolve({ code: '0000', message: '短信验证码发送成功', data: resData });
                    }
                });  
        } catch (e) {
            return reject({ code: '9999', message: `短信验证码发送失败：${e}` });
        }

    });
}