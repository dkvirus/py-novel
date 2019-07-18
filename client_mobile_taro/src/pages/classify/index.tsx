import Taro, { Component, Config } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'

import request from '../../utils/request'
import * as api from '../../utils/api'
import icon_cover from '../../images/cover.png'
import './index.scss'

interface Classify {
    desc: string;
    path: string;
    id: number;
}

interface Novel {
    id: number;
    classify_id: number;
    author_name: string;
    book_name: string;
    book_desc: string;
    book_cover_url: string;
    book_url: string;
    last_update_at: string;
}

export default class ClassifyPage extends Component {
    config: Config = {
    }

    state = {
        selectedClassify: 1,
        classifyList: [],
        novelList: [],
    }

    componentWillMount() {
        this.handleGetClassifyList()
    }

    /**
     * 查询所有分类列表
     */
    handleGetClassifyList() {
        request({
            url: api.GET_CLASSIFY,
        }).then(res => {
            const classifyList = res.map(item => {
                item.title = item.desc
                return item
            })
            this.setState({ classifyList })

            this.handleGetNovelList(classifyList[0].id)
        })
    }

    /**
     * 根据分类查询小说列表
     */
    handleGetNovelList(classifyId) {
        request({
            url: api.GET_SEARCH_NOVEL,
            data: { classify_id: classifyId },
        }).then(res => {
            this.setState({ novelList: res, selectedClassify: classifyId })
        })
    }

    /**
     * 点击分类
     */
    handleClickClassify (classify: Classify) {
        if (classify.id === this.state.selectedClassify) {
            return
        }

        this.setState({
            selectedClassify: classify.id
        })

        this.handleGetNovelList(classify.id)
    }

    /**
     * 跳转小说介绍页面
     */
    handleGoIntroPage (novel: Novel) {
        Taro.navigateTo({
            url: `/pages/intro/index?novelUrl=${novel.book_url}`
        })
    }

    /**
     * 跳转到搜索页面
     */
    handleGoSearchPage () {
        Taro.navigateTo({
            url: '/pages/search/index'
        })
    }

    render() {
        const { selectedClassify, classifyList = [], novelList = [] } = this.state

        return (
            <View className="container">
                <View className="search">
                    <View className="input" onClick={() => this.handleGoSearchPage()}>
                        <View className="at-icon at-icon-search"></View>
                        <View style={{ marginLeft: '20px' }}>搜索</View>
                    </View>
                </View>

                <View className="body">
                    <ScrollView className="classify" scrollY={true}>
                        {
                            classifyList.map((classify: Classify) => (
                                <View key={classify.id} 
                                    className={`classify-item ${classify.id === selectedClassify ? 'classify-active' : ''}`}
                                    onClick={() => this.handleClickClassify(classify)}>{classify.desc}</View>
                            ))
                        }
                    </ScrollView>

                    <ScrollView className="novel" scrollY={true}>
                        {
                            novelList.map((novel: Novel) => (
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
                    </ScrollView>
                </View>
            </View>
        )
    }
}