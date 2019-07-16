import Taro from '@tarojs/taro'
import * as api from './api'
import { apiPrefix } from './config'

/**
 * edit by dkvirus:
 * 封装 Taro 原生请求方法，统一打印响应日志
 */
function request (opts = {}) {
    const token = Taro.getStorageSync('token')

    if (!token) {
        // 请求 token 先
        const username = Taro.getStorageSync('openId')
        Taro.request({
            url: apiPrefix + api.GET_TOKEN,
            method: 'POST',
            data: {
                client_type: 'OPENID',
                username,
            },
        }).then(res => {
            if (!res.data.data) {
                return
            }
            
            Taro.setStorageSync('token',  res.data.data.token)
            request(opts)
        })
    }

    const method = opts.method || 'GET'
    const { url, data = {} } = handleRestful(opts.url, opts.data)

    Taro.showNavigationBarLoading()
    Taro.showLoading()

    return new Promise(function (resolve, reject) {
        Taro.request({
            url: apiPrefix + url,
            data,
            method,
            header: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => {
            console.log(`请求【${method} ${url}】成功，响应数据：%o`, res)
            
            Taro.hideNavigationBarLoading();
            Taro.hideLoading();

            if (res.data.code === '0000') {
                resolve(res.data.data)
            } else if (res.data.code === '9999' && res.data.message.indexOf('认证') !== -1) {
                Taro.setStorageSync('token', '')
                
                request(opts)
                .then(function (res2) {
                    if (res2.data.code === '0000') {
                        resolve(res2.data.data)
                    }
                })
            } else {
                reject(res)
            }
        })
        .catch(res => {
            console.log(`请求【${opts.method} ${url}】失败，响应数据：%o`, res)

            Taro.hideNavigationBarLoading();
            Taro.hideLoading();

            reject(res)
        })
    })
}

/**
 * edit by dkvirus:
 * 处理 restful 接口，示例：/user/:id/stop/:xx       参数为 { id: '1': xx: '2' }
 * 处理之后返回值    /user/1/stop/2
 */
function handleRestful(url, data = {}, isRemove = false) {
    for (const i in data) {
        if (url.indexOf(`{${i}}`) !== -1) {
            url = url.replace(`{${i}}`, data[i])
            if (isRemove === true) {
                delete data[i]
            }
        }
    }
    return { url, data }
}

export default request