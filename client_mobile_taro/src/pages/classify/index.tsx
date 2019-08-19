import Taro, { Component, Config } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'

import request from '../../utils/request'
import * as api from '../../configs/api'
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
    async handleGetClassifyList() {
        const result = await request({
            url: api.NOVEL_CLASSIFY_GET,
        })
        this.setState({ classifyList: result.data })
        this.handleGetNovelList(result.data[0].id)
    }

    /**
     * 根据分类查询小说列表
     */
    async handleGetNovelList(classifyId: number) {
        const result = await request({
            url: api.NOVEL_LIST_GET,
            data: { classifyId },
        })
        this.setState({ 
            novelList: result.data, 
            selectedClassify: classifyId, 
        })
    }

    /**
     * 点击分类
     */
    handleClickClassify (classify: Classify) {
        if (classify.id === this.state.selectedClassify) return
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
            <View className="classify_container">
                <View className="navbar">
                    公羊阅读
                </View>

                <View className="classify_search">
                    <View className="classify_input" onClick={() => this.handleGoSearchPage()}>
                        <View className="at-icon at-icon-search"></View>
                        <View style={{ marginLeft: '20px' }}>搜索</View>
                    </View>
                </View>

                <View className="classify_body">
                    <ScrollView className="classify_classify" scrollY={true}>
                        {
                            classifyList.map((classify: Classify) => (
                                <View key={classify.id} 
                                    className={`classify_classify-item ${classify.id === selectedClassify ? 'classify_classify-active' : ''}`}
                                    onClick={() => this.handleClickClassify(classify)}>{classify.desc}</View>
                            ))
                        }
                    </ScrollView>

                    <ScrollView className="classify_novel" scrollY={true}>
                        {
                            novelList.map((novel: Novel) => (
                                <View className="classify_novel-item" 
                                    key={novel.book_name} onClick={() => this.handleGoIntroPage(novel)}>
                                    <View className="classify_novel-wrapper">
                                        <Image src={icon_cover} className="classify_novel-cover"></Image>

                                        <View className="classify_novel-novelname">
                                            {novel.book_name}
                                        </View>
                                        <View className="classify_novel-authorname">
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