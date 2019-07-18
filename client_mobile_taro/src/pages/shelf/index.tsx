import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtAvatar, AtNavBar, AtIcon } from 'taro-ui'

import request from '../../utils/request'
import * as api from '../../utils/api'
import icon_cover from '../../images/cover.png'
import './index.scss'

interface Shelf {
    book_name: string;
    author_name: string;
}

interface UserInfo {
    nickName: string;
    gender: number;
    language: string;
    city: string;
    province: string;
    country: string;
    avatarUrl: string;
}

interface State {
    shelfList: Array<Shelf>;
    settingEnable: boolean;
    userInfo: object;
    gretting: string;
}

export default class Index extends Component<{}, State> {
    config: Config = {
        navigationBarTitleText: '首页'
    }

    state = {
        shelfList: [],            // 小说书架列表
        settingEnable: false,     // 是否编辑
        userInfo: {},
        greeting: '',             // 问候语         
    }

    componentWillMount() {
        Taro.login().then(res => {
            if (res.code) {
                request({
                    url: api.GET_USER_WXINFO,
                    data: { code: res.code },
                }).then(res => {
                    Taro.setStorageSync('userId', res.userId)
                    Taro.setStorageSync('openId', res.openId)
                    this.handleGetShelfList()
                })
            } else {
                Taro.showToast({
                    title: '登录失败',
                    icon: 'none',
                })
            }
        })
        
        this.handleGetUserInfo()
        this.handleGeneGreeting()
    }

    componentDidShow () {
        this.handleGetShelfList()
    }

    /**
     * 查询小说列表
     */
    handleGetShelfList() {
        const userId = Taro.getStorageSync('userId')
        if (!userId) return
        request({
            url: api.GET_SHELF,
            data: { user_id: userId }
        }).then(res => {
            this.setState({ shelfList: res, settingEnable: false })
        }).catch(err => { })
    }

    /**
     * 获取微信用户信息
     */
    handleGetUserInfo() {
        Taro.getUserInfo().then(res => {
            this.setState({ userInfo: res.userInfo })
        })
    }

    /**
     * 更改状态
     */
    handleUpdateState(variable: any, value?: any) {
        if (typeof variable === 'string') {
            this.setState({
                [variable]: value
            })
        } else {
            this.setState(variable)
        }
    }

    /**
     * 根据时间生成问候语
     */
    handleGeneGreeting() {
        const hour = new Date().getHours()
        let greeting = ''

        if (hour < 6) { greeting = '凌晨好！' }
        else if (hour < 9) { greeting = '早上好！' }
        else if (hour < 12) { greeting = '上午好！' }
        else if (hour < 14) { greeting = '中午好！' }
        else if (hour < 17) { greeting = '下午好！' }
        else if (hour < 19) { greeting = '傍晚好！' }
        else if (hour < 22) { greeting = '晚上好！' }
        else { greeting = '夜里好！' }

        this.setState({ greeting })
    }

    /**
     * 跳转到阅读页面
     */
    handleGoReadPage({ recent_chapter_url, book_name, id }) {
        Taro.navigateTo({
            url: `/pages/read/index?chapterUrl=${recent_chapter_url}&bookName=${book_name}&novelId=${id}`
        })
    }

    /**
     * 渲染头部
     */
    renderHeader() {
        const { userInfo, settingEnable, greeting } = this.state

        if (userInfo.nickName) {
            return (
                <View className="header at-row">
                    <AtAvatar circle image={userInfo.avatarUrl}></AtAvatar>

                    <View className="at-col at-col-6">
                        {greeting}{userInfo.nickName}
                    </View>

                    <AtIcon value='settings'
                        size='28' color='#707070'
                        onClick={() => this.handleUpdateState({ settingEnable: !settingEnable })}></AtIcon>
                </View>
            )
        }

        return (
            <View className="header"></View>
        )
    }

    /**
     * 删除书架
     */
    handleDelShelf(id) {
        request({
            url: api.DEL_SHELF,
            method: 'DELETE',
            data: { id },
        }).then(res => {
            this.setState({ settingEnable: false })
            this.handleGetShelfList()
            Taro.showToast({
                title: '删除成功',
            })
        })
    }

    /**
     * 渲染书架列表
     */
    renderShelfList() {
        const { shelfList, settingEnable } = this.state

        return (
            <View className="shelf-list">
                {
                    shelfList.map((shelf) => (
                        <View className="shelf-item" key={shelf.book_name}>
                            <View className="shelf-wrapper" onClick={() => this.handleGoReadPage(shelf)}>
                                <Image src={icon_cover} className="shelf-cover"></Image>

                                <View className="shelf-novelname">
                                    {shelf.book_name}
                                </View>
                                <View className="shelf-authorname">
                                    {shelf.author_name}
                                </View>
                            </View>

                            {
                                settingEnable && (
                                    <View className="icon-del">
                                        <AtIcon value='close-circle'
                                            size='30' color='#707070'
                                            onClick={() => this.handleDelShelf(shelf.id)}></AtIcon>
                                    </View>
                                )
                            }
                        </View>
                    ))
                }
            </View>
        )
    }

    /**
     * 渲染空书架
     */
    renderEmptyShelf () {
        return (
            <View className="at-article__h3" style={{ marginTop: '40px' }}>您还没有书籍呢？去书屋找一找吧~</View>
        )
    }

    render() {
        const shelfList: Array<Shelf> = this.state.shelfList

        return (
            <View>
                <View className="navbar" style={{ backgroundColor: 'rgb(244, 243, 249)' }}>
                    公羊阅读
                </View>

                {this.renderHeader()}
                {shelfList.length && this.renderShelfList()}
                {shelfList.length === 0 && this.renderEmptyShelf()}
            </View>
        )
    }
}
