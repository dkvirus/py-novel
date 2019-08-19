import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtSearchBar, AtGrid, AtList, AtListItem, AtIcon } from 'taro-ui'

import request from '../../utils/request'
import * as api from '../../configs/api'
import icon_cover from '../../images/cover.png'
import './index.scss'

interface Hot {
    keyword: string;
    value: string;
}

interface Hist {
    keyword: string;
}

interface Novel {
    authorName: string;
    bookName: string;
}

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
    async handleGetHotList() {
        const result = await request({
            url: api.SEARCH_HOT_GET,
        })
        this.setState({ hotList: result.data || [] })
    }

    /**
     * 查看历史记录列表
     */
    async handleGetHistList() {
        const userId = Taro.getStorageSync('userId')
        const result = await request({
            url: api.SEARCH_HIST_GET,
            data: { userId },
        })
        this.setState({ histList: result.data || [] })
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
    async handleSearchSubmit(keyword) {
        if (!keyword) {
            return Taro.showToast({
                title: '请输入内容',
                icon: 'none',
            })
        }

        this.setState({ keyword })

        const userId = Taro.getStorageSync('userId')
        const result = await request({
            url: api.SEARCH_NOVEL_GET,
            data: { keyword, userId },
        })

        if (result.data && result.data.length === 0) {
            return Taro.showToast({
                title: '没有找到小说！',
                icon: 'none',
            })
        }

        this.setState({ novelList: result.data })
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
        let { hotList }: { hotList: Hot[] } = this.state
        hotList = hotList.map((item: { value: string, keyword: string }) => {
            item.value = item.keyword
            return item
        })

        return (
            <View className="search_hot">
                <View className="at-article__h3 search_title">热门搜索</View>
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
            <View className="search_hist">
                <View className="at-article__h3 search_title">搜索历史</View>
                <AtList>
                    {
                        histList.map((hist: Hist) => (
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
            url: `/pages/intro/index?novelUrl=${novel.bookUrl}`
        })
    }

    /**
     * 渲染小说
     */
    renderNovel () {
        const { novelList = [] } = this.state

        return (
            <View className="search_novel">
                <View className="at-article__h3 search_title">找到了这些书</View>
                <View className="search_novel-list">
                    {
                        novelList.map((novel: Novel) => (
                            <View className="search_novel-item" 
                                key={novel.bookName} onClick={() => this.handleGoIntroPage(novel)}>
                                <View className="search_novel-wrapper">
                                    <Image src={icon_cover} className="search_novel-cover"></Image>

                                    <View className="search_novel-novelname">
                                        {novel.bookName}
                                    </View>
                                    <View className="search_novel-authorname">
                                        {novel.authorName}
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
                { Boolean(novelList.length) && Boolean(keyword) && this.renderNovel() }
                {this.renderHot()}
                {this.renderHist()}
            </View>
        )
    }
}