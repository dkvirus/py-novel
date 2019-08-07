import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtSearchBar, AtGrid, AtList, AtListItem, AtIcon } from 'taro-ui'

import request from '../../utils/request'
import * as api from '../../utils/api'
import icon_cover from '../../images/cover.png'
import './index.scss'

export default class SearchPage extends Component {
    config: Config = {
    }

    state = {
        keyword: '',
        hotList: [],
        histList: [],
        novelList: [],
    }

    componentWillMount () {
        this.handleGetHotList()
        this.handleGetHistList()
    }

    /**
     * 查看热门搜索列表
     */
    handleGetHotList() {
        request({
            url: api.GET_SEARCH_HOT,
        }).then(res => {
            this.setState({ hotList: res || [] })
        })
    }

    /**
     * 查看历史记录列表
     */
    handleGetHistList() {
        const userId = Taro.getStorageSync('userId')
        request({
            url: api.GET_SEARCH_HIST,
            data: { user_id: userId },
        }).then(res => {
            this.setState({ histList: res })
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
     * 返回上一页
     */
    handleBack() {
        Taro.navigateBack()
    }

    /**
     * 根据关键词查询
     */
    handleSearchSubmit(keyword) {
        if (!keyword) {
            Taro.showToast({
                title: '请输入内容',
                icon: 'none',
            })
            return
        }

        this.setState({ keyword })

        request({
            url: api.GET_SEARCH_NOVEL,
            data: { keyword },
        }).then(res => {
            if (res && res.length === 0) {
                Taro.showToast({
                    title: '没有找到小说！',
                    icon: 'none',
                })
                return
            }

            this.setState({ novelList: res })

            // 新增一条历史查询记录
            const userId = Taro.getStorageSync('userId')
            request({
                url: api.ADD_SEARCH_HIST,
                method: 'POST',
                data: { user_id: userId, keyword }
            })
        })
    }

    /**
     * 渲染搜索框
     */
    renderSearch() {
        const { keyword } = this.state

        return (
            <AtSearchBar
                actionName='搜一下'
                value={keyword}
                onChange={(value) => this.handleUpdateState({ keyword: value, novelList: [] })}
                onActionClick={() => this.handleSearchSubmit(keyword)}
            />
        )
    }

    /**
     * 渲染热门搜索
     */
    renderHot () {
        let { hotList } = this.state
        hotList = hotList.map((item) => {
            item.value = item.keyword
            return item
        })

        return (
            <View className="hot">
                <View className="at-article__h3 title">热门搜索</View>
                <View style={{ backgroundColor: '#fff' }}>
                    <AtGrid mode='rect' data={hotList} 
                        onClick={(item) => this.handleSearchSubmit(item.value)}/>
                </View>
            </View>
        )
    }

    /**
     * 渲染搜索历史
     */
    renderHist () {
        const { histList = [] } = this.state

        return (
            <View className="hist">
                <View className="at-article__h3 title">搜索历史</View>
                <AtList>
                    {
                        histList.map(hist => (
                            <AtListItem key={hist.keyword} title={hist.keyword} arrow='right' 
                                onClick={() => this.handleSearchSubmit(hist.keyword)} />
                        ))
                    }
                </AtList>
            </View>
        )
    }

    /**
     * 跳转小说介绍页面
     */
    handleGoIntroPage (novel) {
        Taro.navigateTo({
            url: `/pages/intro/index?novelUrl=${novel.book_url}`
        })
    }

    /**
     * 渲染小说
     */
    renderNovel () {
        const { novelList = [] } = this.state

        return (
            <View className="novel">
                <View className="at-article__h3 title">找到了这些书</View>
                <View className="novel-list">
                    {
                        novelList.map((novel) => (
                            <View className="novel-item" 
                                key={novel.book_name} onClick={() => this.handleGoIntroPage(novel)}>
                                <View className="novel-wrapper">
                                    <Image src={icon_cover} className="novel-cover"></Image>

                                    <View className="novel-novelname">
                                        {novel.book_name}
                                    </View>
                                    <View className="novel-authorname">
                                        {novel.author_name}
                                    </View>
                                </View>
                            </View>
                        ))
                    }
                </View>
            </View>
        )
    }

    render() {
        const { novelList = [], keyword = '' } = this.state

        return (
            <View>
                <View className="navbar">
                    <AtIcon value="chevron-left" onClick={() => this.handleBack()}></AtIcon>
                    公羊阅读
                </View>

                {this.renderSearch()}
                { novelList.length && keyword && this.renderNovel() }
                {this.renderHot()}
                {this.renderHist()}
            </View>
        )
    }
}