import Taro from '@tarojs/taro'
import * as api from './api'
import { apiPrefix } from './config'

/**
 * edit by dkvirus:
 * 封装 Taro 原生请求方法，统一打印响应日志
 */
function request (opts = {}) {
    return new Promise(function (resolve, reject) {
        const { method = 'GET' } = opts
        const { url, data } = handleRestful(opts.url, opts.data)
        const token = Taro.getStorageSync('token')
        Taro.showLoading({ mask: true, title: '拼命加载中....' })

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
            Taro.hideLoading();

            // 认证失败，token 不存在或者过期
            if (res.data.code === '9999' && res.data.message.indexOf('认证') !== -1) {
                const openId = Taro.getStorageSync('openId')
                getToken(openId).then(res => {
                    const token = res.token
                    Taro.setStorageSync('token', token)
                    return request(opts)
                }).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            } else if (res.data.code === '0000') {
                resolve(res.data.data)
            } else {
                reject(res)
            }
        }).catch(err => {
            console.log(`请求【${opts.method} ${url}】失败，响应数据：%o`, res)
            Taro.hideLoading();
            reject(err)
        })
    })
}

/**
 * 拿 token
 */
function getToken(openId) {
    return new Promise(function (resolve, reject) {
        if (!openId) {
            resolve({ code: '9999', message: '拿token失败，openId为空', token: '' })
        } else {
            Taro.request({
                url: apiPrefix + api.GET_TOKEN,
                method: 'POST',
                data: {
                    client_type: 'OPENID',
                    username: openId,
                },
            }).then(res => {
                if (!res.data.data) return
                resolve({ code: '0000', message: '拿token成功', token: res.data.data.token })
            }).catch(err => {
                resolve({ code: '9999', message: '拿token失败, 网络请求异常', token: '' })
            })
        }
    })
}

/**
 * edit by dkvirus:
 * 处理 restful 接口，示例：/user/{id}/stop/{xx}       参数为 { id: '1': xx: '2' }
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