import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { AtAvatar, AtIcon } from 'taro-ui'

import request from '../../utils/request'
import * as api from '../../configs/api'
import icon_cover from '../../images/cover.png'
import icon_avatar from '../../images/default_avatar.png'
import './index.scss'

interface Shelf {
    book_name: string;
    author_name: string;
    id: number;
    recent_chapter_url: string;
}

interface State {
    shelfList: Array<Shelf>;
    settingEnable: boolean;
    greeting: string;
    nickname: string;
    avatarUrl: string;
}

export default class Index extends Component {
    config: Config = {
        navigationBarTitleText: '首页'
    }

    state: State = {
        shelfList: [],            // 小说书架列表
        settingEnable: false,     // 是否编辑
        greeting: '',             // 问候语    
        nickname: '',
        avatarUrl: '',   
    }

    async componentWillMount() {
        if (process.env.TARO_ENV !== 'weapp' && !Taro.getStorageSync('userId')) {
            Taro.redirectTo({
                url: '/pages/oauth/signin/index'
            })
        }

        this.handleGeneGreeting()
    }

    componentDidShow () {
        this.handleGetShelfList()
    }

    /**
     * 查询小说列表
     */
    async handleGetShelfList() {
        const userId = Taro.getStorageSync('userId')
        const result = await request({
            url: api.SHELF_GET,
            data: { userId },
        })

        const nickname = Taro.getStorageSync('nickname')
        const avatarUrl = Taro.getStorageSync('avatarUrl')

        this.setState({ shelfList: result.data, nickname, avatarUrl, settingEnable: false })
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
    handleGoReadPage({ recent_chapter_url, book_name, id }: Shelf) {
        Taro.navigateTo({
            url: `/pages/read/index?chapterUrl=${recent_chapter_url}&bookName=${book_name}&novelId=${id}`
        })
    }

    /**
     * 更新用户信息。昵称、头像
     */
    async handleUpdateUserInfo (e) {
        let { avatarUrl, city, country, gender, nickName, province } = e.detail.userInfo
        const address = `${country}、${province}、${city}`
        const genderObj = {
            1: '男性',
            2: '女性',
        }
        gender = genderObj[gender] || '未知'

        // 保存到 data 中
        this.setState({
            nickname: nickName,
            avatarUrl
        })

        Taro.setStorageSync('nickname', nickName)
        Taro.setStorageSync('avatarUrl', avatarUrl)

        // 更新到库中
        const userId = Taro.getStorageSync('userId')
        if (!userId) return

        await request({
            url: api.USER_EDIT,
            method: 'PUT',
            data: { 
                userId,
                nickname: nickName,
                avatarUrl,
                address, 
                gender,
            },
            oauth2: true,
        })
    }

    /**
     * 渲染头部
     */
    renderHeader() {
        const { nickname, avatarUrl, settingEnable, greeting }: State = this.state

        if (process.env.TARO_ENV !== 'weapp') {
            const nickname = Taro.getStorageSync('nickname')

            return (
                <View className="shelf_header at-row">
                    <AtAvatar circle image={icon_avatar}></AtAvatar>

                    <View className="at-col at-col-6">
                        {greeting}{nickname}
                    </View>

                    <AtIcon value='settings'
                        size='28' color='#707070'
                        onClick={() => this.handleUpdateState({ settingEnable: !settingEnable })}></AtIcon>
                </View>
            )
        }

        return (
            <View className="shelf_header at-row">
                <AtAvatar circle image={avatarUrl || icon_avatar}></AtAvatar>

                {
                    nickname ? (
                        <View className="at-col at-col-6">
                            {greeting}{nickname}
                        </View>
                    ) : (
                        <View className="at-col at-col-6">
                            <Button className="shelf_btn-user" 
                                open-type="getUserInfo"
                                onGetUserInfo={(e) => this.handleUpdateUserInfo(e)}>获取微信昵称</Button>
                        </View>
                    )
                }

                <AtIcon value='settings'
                    size='28' color='#707070'
                    onClick={() => this.handleUpdateState({ settingEnable: !settingEnable })}></AtIcon>
            </View>
        )
    }

    /**
     * 删除书架
     */
    async handleDelShelf(id: number) {
        await request({
            url: api.SHELF_DEL,
            method: 'DELETE',
            data: { id },
            oauth2: true,
        })
        this.setState({ settingEnable: false })
        this.handleGetShelfList()
        Taro.showToast({
            title: '删除成功',
        })
    }

    /**
     * 渲染书架列表
     */
    renderShelfList() {
        const { shelfList, settingEnable } = this.state

        return (
            <View className="shelf_list">
                {
                    shelfList.map((shelf: Shelf) => (
                        <View className="shelf_item" key={shelf.book_name}>
                            <View className="shelf_wrapper" onClick={() => this.handleGoReadPage(shelf)}>
                                <Image src={icon_cover} className="shelf_cover"></Image>

                                <View className="shelf_novelname">
                                    {shelf.book_name}
                                </View>
                                <View className="shelf_authorname">
                                    {shelf.author_name}
                                </View>
                            </View>

                            {
                                settingEnable && (
                                    <View className="icon_del">
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
                {Boolean(shelfList.length) && this.renderShelfList()}
                {!Boolean(shelfList.length) && this.renderEmptyShelf()}
            </View>
        )
    }
}
