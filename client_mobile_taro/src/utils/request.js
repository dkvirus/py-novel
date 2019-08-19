import Taro from '@tarojs/taro'
import * as api from './api'
import { apiPrefix } from './config'

const commons = {
    regexUrl: (url, data) => {
        const obj = JSON.parse(JSON.stringify(data))

        for (let i in obj) {
            if (url.indexOf(`{${i}}`) !== -1) {
                url = url.replace(`{${i}}`, obj[i])
            }
        }
        return { originUrl: url, originData: obj }
    },
}

const weappRequest = {
    apiPrefix: 'http://localhost:4000/api/v1',
    request: function ({ url, method = 'GET', data = {}, header = {}, oauth2=false }) {
        /**
         * 网路请求
         * 业务请求
         */
        return new Promise(async function (resolve, reject) {
            // 处理请求头
            if (oauth2) {
                const token = Taro.getStorageSync('token')
                header['Authorization'] = `Bearer ${token}`
            }  
            
            // 处理 restful 请求
            const { originUrl, originData } = commons.regexUrl(url, data)

            await Taro.showLoading({ title: '加载中...' })
            const result = await Taro.request({
                url: weappRequest.apiPrefix + originUrl, 
                method, 
                data: originData, 
                header,
            })
            await Taro.hideLoading()

            if (result.statusCode >= 200 || result.statusCode < 400) {
                // if (result.data.code === '9999' && result.data.message.indexOf('认证') !== -1) {
                //     const openId = Taro.getStorageSync('openId')
                    // 重新拿 token
                    // const result = await weappRequest.getToken(openId)
                    // console.log('token is %o', token)
                // } else {
                    
                // }

                resolve(result.data)
            } else  {
                // 跳转到登录页面
                Taro.navigateTo({
                    url: '/pages/oauth/signin/index'
                })
                resolve({
                    code: '0000',
                    message: 'token失效，请登录',
                    data: {},
                })
            }
        })
    },

    signin: async function () {
        const { code } = await Taro.login()
        const result = await Taro.request({
            url: weappRequest.apiPrefix + '/gysw/oauth/wxsignup',
            data: { code },
        })
    },
}

const h5Request = {
    request: function ({ url, method = 'GET', data = {}, header = {}, oauth2=false }) {
        /**
         * 网路请求
         * 业务请求
         */
        return new Promise(async function (resolve, reject) {
            const userId = Taro.getStorageSync('userId')
            if (!userId) {
                Taro.redirectTo({
                    url: '/pages/oauth/signin/index'
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
            
            // 处理 restful 请求
            const { originUrl, originData } = commons.regexUrl(url, data)

            await Taro.showLoading({ title: '加载中...' })
            const result = await Taro.request({
                url: originUrl, 
                method, 
                data: originData, 
                header,
            })
            await Taro.hideLoading()

            if (result.statusCode === 401) {
                // 未认证，重新请求 token
                await h5Request.getToken()
                const result = await h5Request.request({ url, method, data, header, oauth2 })
                if (result.code !== '0000') {
                    Taro.showToast({
                        title: result.message,
                        icon: 'none',
                    })
                } else {
                    Taro.redirectTo({
                        url: '/pages/shelf/index'
                    })
                }
                resolve({})
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
            url: api.GET_TOKEN,
            method: 'GET',
            data: { userId },
        })
        Taro.setStorageSync('token', result.data.data.token)
    },
}

let request
const reqeusts = {
    h5: h5Request.request,
    weapp: weappRequest.request,
}

export default reqeusts[process.env.TARO_ENV]