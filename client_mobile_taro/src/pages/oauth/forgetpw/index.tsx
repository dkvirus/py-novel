import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Button, Form, Text, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './index.scss'
import * as api from '../../../configs/api'
import { h5ApiPrefix } from '../../../configs/config'
import img_oauth_header from '../../../images/logo.png'

export default class Index extends Component<{}, {}> {
    config: Config = {
        navigationBarTitleText: '重置密码'
    }

    state = {
        vscodeTxt: '获取验证码',
        mobile: '',
        verifyId: '',   // 申请验证码返回来的验证码id
    }

    /**
     * 跳转登录页面
     */
    handleGoSigninPage () {
        Taro.navigateTo({
            url: '/pages/oauth/signin/index'
        })
    }

    /**
     * 渲染头部
     */
    renderHeader () {
        return (
            <View className="forgetpw_header">
                <View onClick={() => this.handleGoSigninPage()}>
                    <Text className="header-text">登录</Text>
                </View>
                <View className="header-divide"></View>
                <View>
                    <Text className="header-text header-text-active">重置密码</Text>
                </View>
            </View>
        )
    }

    /**
     * 提交表单
     */
    async handleSubmit (e) {
        const { username, password, vcode } = e.detail.value

        if (!username) {
            return Taro.showToast({ title: '手机号不能为空', icon: 'none' })
        } else if (!(/^1[34578]\d{9}$/.test(String(username)))) {
            return Taro.showToast({ title: '手机号格式有误', icon: 'none' })
        }

        if (!password) {
            return Taro.showToast({ title: '密码不能为空', icon: 'none' })
        }

        if (!vcode) {
            return Taro.showToast({ title: '验证码不能为空', icon: 'none' })
        }

        const result = await Taro.request({
            url: h5ApiPrefix + api.OAUTH_RESET_PW,
            method: 'POST',
            data: { username, password, vcode },
            header: {
                'Content-Type': 'application/json'
            }
        })

        if (result.data.code !== '0000') {
            Taro.showToast({
                title: result.data.message,
                icon: 'none',
            })
        } else {
            Taro.redirectTo({
                url: '/pages/oauth/signin/index'
            })
        }
    }

    /**
     * 发送验证码
     */
    async handleSendVscode () {
        const { vscodeTxt, mobile } = this.state
        if (vscodeTxt !== '获取验证码') {
            return
        }

        // 校验手机号是否存在
        if (!mobile) {
            return Taro.showToast({
                title: '请先输入手机号',
                icon: 'none',
            })
        }

        // 校验手机号格式是否正确
        if (!(/^1[34578]\d{9}$/.test(String(mobile)) {
            return Taro.showToast({
                title: '手机号格式不正确',
                icon: 'none',
            })
        }

        const result = await Taro.request({
            url: h5ApiPrefix + api.OAUTH_VCODE_GET,
            method: 'POST',
            data: { username: mobile, type: 'resetpw' },
            header: {
                'Content-Type': 'application/json'
            }
        })

        if (result.data && result.data.code === '0000') {
            let second = 60
            const timer = setInterval(() => {
                if (second === 0) {
                    this.setState({
                        vscodeTxt: '获取验证码'
                    })
                    clearInterval(timer)
                } else {
                    this.setState({
                        vscodeTxt: second,
                    })
                    second--
                }
            }, 1000)
        }

        Taro.showToast({
            title: result.data.message,
            icon: 'none',
        })
    }

    /**
     * 手机号变化触发事件
     */
    handleMobileChange (e) {
        const mobile = e.detail.value
        this.setState({
            mobile,
        })
    }

    /**
     * 渲染登录表单
     */
    renderForm () {
        const { vscodeTxt } = this.state

        return (
            <View className="forgetpw_form">
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <View className="form-control">
                        <AtIcon value='phone' size='20' color='#ccc'></AtIcon>
                        <Input name="username" className="form-input" onInput={(e) => this.handleMobileChange(e)} type="text" placeholder="手机号"></Input>
                    </View>
                    
                    <View className="form-control">
                        <AtIcon value='lock' size='20' color='#ccc'></AtIcon>
                        <Input name="password" className="form-input" type="text" placeholder="密码"></Input>
                    </View>

                    <View className="form-control vcode-wrap">
                        <AtIcon value='lock' size='20' color='#ccc'></AtIcon>
                        <Input name="vcode" className="form-input" type="text" placeholder="验证码"></Input>
                        <View className="btn-vcode" onClick={() => this.handleSendVscode()}>{vscodeTxt}</View>
                    </View>
                    
                    <Button className="form-button" type="primary">立即重置</Button>
                </Form>
            </View>
        )
    }

    render() {
        return (
            <View>
                <View className="forgetpw_img-wrap">
                    <Image className="img" src={img_oauth_header}></Image>
                </View>
                {this.renderHeader()}
                {this.renderForm()}
            </View>
        )
    }
}