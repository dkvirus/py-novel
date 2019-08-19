import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Button, Form, Text, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './index.scss'
import img_oauth_header from '../../../images/logo.png'

export default class Index extends Component<{}, {}> {
    config: Config = {
        navigationBarTitleText: '注册'
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
            <View className="signup_header">
                <View onClick={() => this.handleGoSigninPage()}>
                    <Text className="header-text">登录</Text>
                </View>
                <View className="header-divide"></View>
                <View>
                    <Text className="header-text header-text-active">注册</Text>
                </View>
            </View>
        )
    }

    /**
     * 提交表单
     */
    handleSubmit (e) {
        const { verifyId } = this.state
        if (!verifyId) {
            return Taro.showToast({
                title: '验证码过期，请重新获取短信验证码',
                icon: 'none',
            })
        }

        const { mobile, userName, authCertiPlain, verifyCode } = e.detail.value

        if (!mobile) {
            return Taro.showToast({ title: '手机号不能为空', icon: 'none' })
        } else if (!(/^1[34578]\d{9}$/.test(String(mobile)))) {
            return Taro.showToast({ title: '手机号格式有误', icon: 'none' })
        }

        if (!userName) {
            return Taro.showToast({ title: '用户名不能为空', icon: 'none' })
        }

        if (!authCertiPlain) {
            return Taro.showToast({ title: '密码不能为空', icon: 'none' })
        }

        if (!verifyCode) {
            return Taro.showToast({ title: '验证码不能为空', icon: 'none' })
        }

        // 校验用户名是否注册
        Taro.request({
            url: '/api/v1/user/registered',
            method: 'GET',
            data: { userName },
            success: res => {
                if (res.data && res.data.data && res.data.data.guid) {
                    Taro.showToast({
                        title: '用户名已存在，请重写填写。',
                        icon: 'none',
                    })
                } else {
                    // 用户名不存在，新增用户
                    Taro.request({
                        url: '/api/v1/user/register',
                        method: 'POST',
                        data: {
                            userName,
                            authCertiPlain: authCertiPlain,
                            mobile,
                            verifyCode,
                            email: '',
                            authClient: 'LOCAL',
                            authIdent: mobile,
                            verifyId,
                        },
                        success: () => {
                            // 新增完成后，跳转登录页面
                            Taro.navigateTo({
                                url: '/pages/oauth/signin/index'
                            })
                        }
                    })
                }
            }
        })
    }

    /**
     * 发送验证码
     */
    handleSendVscode () {
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

        // 根据手机号验证用户是否注册
        const that = this
        Taro.request({
            url: '/api/v1/user/registered',
            method: 'GET',
            data: { mobile },
            success: (res) => {
                if (res.data && res.data.data && res.data.data.guid) {
                    Taro.showToast({
                        title: '手机号已注册，请直接登录或找回密码。',
                        icon: 'none',
                    })
                } else {
                    // 60s 倒计时
                    let second = 5
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

                    Taro.request({
                        url: '/api/v1/user/verify/apply',
                        method: 'POST',
                        data: {
                            verifyCarrier: mobile,
                            verifyPurpose: '注册账号',
                            verifyType: 'PHONE',
                        },
                        success: res2 => {
                            if (res2.data && res2.data.data && res2.data.data.verifyId) {
                                that.setState({
                                    verifyId: res2.data.data.verifyId
                                })
                            }
                        }
                    })
                }
            }
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
            <View className="signup_form">
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <View className="form-control">
                        <AtIcon value='phone' size='20' color='#ccc'></AtIcon>
                        <Input name="mobile" className="form-input" onInput={(e) => this.handleMobileChange(e)} type="text" placeholder="手机号"></Input>
                    </View>
                    
                    <View className="form-control">
                        <AtIcon value='lock' size='20' color='#ccc'></AtIcon>
                        <Input name="userName" className="form-input" type="text" placeholder="用户名"></Input>
                    </View>

                    <View className="form-control">
                        <AtIcon value='lock' size='20' color='#ccc'></AtIcon>
                        <Input name="authCertiPlain" className="form-input" type="text" placeholder="密码"></Input>
                    </View>

                    <View className="form-control vcode-wrap">
                        <AtIcon value='lock' size='20' color='#ccc'></AtIcon>
                        <Input name="verifyCode" className="form-input" type="text" placeholder="验证码"></Input>
                        <View className="btn-vcode" onClick={() => this.handleSendVscode()}>{vscodeTxt}</View>
                    </View>
                    
                    <Button className="form-button" type="primary">立即注册</Button>
                </Form>
            </View>
        )
    }

    render() {
        return (
            <View>
                <View className="signup_img-wrap">
                    <Image className="img" src={img_oauth_header}></Image>
                </View>
                {this.renderHeader()}
                {this.renderForm()}
            </View>
        )
    }
}