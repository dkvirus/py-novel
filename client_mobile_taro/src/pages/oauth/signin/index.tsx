import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Button, Form, Text, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import * as api from '../../../configs/api'
import { h5ApiPrefix } from '../../../configs/config'
import './index.scss'
import img_oauth_header from '../../../images/logo.png'

export default class Index extends Component<{}, {}> {
    config: Config = {
        navigationBarTitleText: '登录'
    }

    /**
     * 跳转注册页面
     */
    handleGoSignupPage () {
        Taro.navigateTo({
            url: '/pages/oauth/signup/index'
        })
    }

    /**
     * 渲染头部
     */
    renderHeader () {
        return (
            <View className="signin_header">
                <View>
                    <Text className="header-text header-text-active">登录</Text>
                </View>
                <View className="header-divide"></View>
                <View onClick={() => this.handleGoSignupPage()}>
                    <Text className="header-text">注册</Text>
                </View>
            </View>
        )
    }

    /**
     * 提交表单
     */
    async handleSubmit (e) {
        const { username, password } = e.detail.value
        
        if (String(username).length !== 11 || !(/^1[34578]\d{9}$/.test(String(username)))) {
            return Taro.showToast({ title: '手机号格式有误', icon: 'none' })
        }

        if (!password) {
            return Taro.showToast({ title: '密码不能为空', icon: 'none' })
        }

        const result = await Taro.request({
            url: h5ApiPrefix + api.OAUTH_SIGNIN,
            method: 'POST',
            data: { username, password },
            header: {
                'Content-Type': 'application/json'
            }
        })

        if (result.data.code !== '0000') {
            return Taro.showToast({
                title: result.data.message,
                icon: 'none',
            })
        }

        const { userId, token, nickname, avatarUrl } = result.data.data

        Taro.setStorageSync('userId', userId)
        Taro.setStorageSync('token', token)
        Taro.setStorageSync('nickname', nickname)
        Taro.setStorageSync('avatarUrl', avatarUrl)

        Taro.redirectTo({
            url: '/pages/shelf/index'
        })
    }

    /**
     * 点击"忘记密码"，跳转到忘记密码页面
     */
    handleGoForgetPwPage () {
        Taro.navigateTo({
            url: '/pages/oauth/forgetpw/index'
        })
    }

    /**
     * 渲染登录表单
     */
    renderForm () {
        return (
            <View className="signin_form">
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <View className="form-control">
                        <AtIcon value='phone' size='20' color='#ccc'></AtIcon>
                        <Input name="username" className="form-input" type="text" placeholder="手机号"></Input>
                    </View>
                    
                    <View className="form-control">
                        <AtIcon value='lock' size='20' color='#ccc'></AtIcon>
                        <Input name="password" className="form-input" type="text" placeholder="密码"></Input>
                    </View>

                    <View className="forget">
                        <View className="forget-pw" onClick={() => this.handleGoForgetPwPage()}>忘记密码?</View>
                    </View>
                    
                    <Button className="form-button" type="primary">登录</Button>
                </Form>
            </View>
        )
    }

    render() {
        return (
            <View>
                <View className="signin_img-wrap">
                    <Image className="img" src={img_oauth_header}></Image>
                </View>
                {this.renderHeader()}
                {this.renderForm()}
            </View>
        )
    }
}