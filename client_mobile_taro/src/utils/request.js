import Taro from '@tarojs/taro'
import * as api from '../configs/api'
import { weappApiPrefix } from '../configs/config'

const weappRequest = {
    apiPrefix: weappApiPrefix,
    request: function ({ url, method = 'GET', data = {}, header = {}, oauth2=false }) {
        return new Promise(async function (resolve, reject) {
            const userId = Taro.getStorageSync('userId')
            if (!userId) {
                // 登录
                await weappRequest.signin()
                data.userId = Taro.getStorageSync('userId')
                const result = await weappRequest.request({ url, method, data, header, oauth2 })
                return resolve(result)
            }

            // 处理请求头
            if (oauth2) {
                const token = Taro.getStorageSync('token')
                header['Authorization'] = `Bearer ${token}`
            }  
            
            await Taro.showLoading({ title: '加载中...' })
            const result = await Taro.request({
                url: weappRequest.apiPrefix + url, 
                method, 
                data, 
                header,
            })
            await Taro.hideLoading()

            if (result.statusCode === 401) {
                // 未认证，重新请求 token
                await weappRequest.getToken()
                const result = await weappRequest.request({ url, method, data, header, oauth2 })
                resolve(result)
            } else if (result.statusCode >= 200 && result.statusCode < 400) {
                resolve(result.data)
            } else  {
                reject({
                    code: '9999',
                    message: '服务端出错',
                    data: {},
                })
            }
        })
    },
    signin: async function () {
        const { code } = await Taro.login()
        const result = await Taro.request({
            url: weappRequest.apiPrefix + api.SIGNIN_WX,
            data: { code },
            method: 'POST',
        })
        const { userId, openId, token, nickname, avatarUrl } = result.data && result.data.data
        Taro.setStorageSync('userId', userId)
        Taro.setStorageSync('openId', openId)
        Taro.setStorageSync('token', token)
        Taro.setStorageSync('nickname', nickname)
        Taro.setStorageSync('avatarUrl', avatarUrl)
    },
    getToken: async function () {
        const userId = Taro.getStorageSync('userId')
        const result = await Taro.request({
            url: weappRequest.apiPrefix + api.TOKEN_GET,
            method: 'GET',
            data: { userId },
        })
        Taro.setStorageSync('token', result.data.data.token)
    },
}

const h5Request = {
    request: function ({ url, method = 'GET', data = {}, header = {}, oauth2=false }) {
        return new Promise(async function (resolve, reject) {
            const userId = Taro.getStorageSync('userId')
            if (!userId) {
                Taro.redirectTo({
                    url: '/pages/oauth/signin/index',
                })
                return resolve({ code: '0000', message: '跳转到登录页', data: {} })
            }

            // 处理请求头
            if (oauth2) {
                const token = Taro.getStorageSync('token')
                header['Authorization'] = `Bearer ${token}`
            }  

            if (method === 'POST') {
                header['Content-Type'] = 'application/json'
            }
            
            await Taro.showLoading({ title: '加载中...' })
            const result = await Taro.request({
                url, 
                method, 
                data, 
                header,
            })
            await Taro.hideLoading()

            if (result.statusCode === 401) {
                // 未认证，重新请求 token
                await h5Request.getToken()
                const result = await h5Request.request({ url, method, data, header, oauth2 })
                resolve(result)
            } else if (result.statusCode >= 200 && result.statusCode < 400) {
                resolve(result.data)
            } else  {
                reject({
                    code: '9999',
                    message: '服务端出错',
                    data: {},
                })
            }
        })
    },
    getToken: async function () {
        const userId = Taro.getStorageSync('userId')
        const result = await Taro.request({
            url: api.TOKEN_GET,
            method: 'GET',
            data: { userId },
        })
        Taro.setStorageSync('token', result.data.data.token)
    },
}

let request
if (process.env.TARO_ENV === 'weapp') {
    request = weappRequest.request
} else {
    // h5 和 rn 都可以用 h5Request.request
    request = h5Request.request
}

export default request