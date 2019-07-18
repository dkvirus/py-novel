import Taro, { Component, Config } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import { AtDrawer, AtIcon } from 'taro-ui'

import request from '../../utils/request'
import * as api from '../../utils/api'
import icon_cover from '../../images/cover.png'
import './index.scss'

interface Page {
    id: string;
    start: number;
    end: number;
    desc: string;
}

interface Chapter {
    uuid: string;
    name: string;
    url: string;
}

export default class IntroPage extends Component {
    config: Config = {
    }

    state = {
        list: [],
        page: [],
        all: [],
        isShowPage: false,
        chapterVisible: false,

        bookName: '',
        authorName: '',
        classifyName: '',
        lastUpdateAt: '',
        bookDesc: '',
        recentChapterUrl: '',
    }

    componentWillMount() {
        const { novelUrl } = this.$router.params

        this.handleGetNovelDetail(novelUrl)
        this.handleGetChapterList(novelUrl)
    }

    /**
     * 获取小说详情
     */
    handleGetNovelDetail(url) {
        request({
            url: api.GET_NOVEL_INTRO,
            data: { url }
        }).then(res => {
            if (!res.recent_chapter_url) {
                Taro.showToast({
                    title: '网络波动',
                })
                this.handleGetNovelDetail(url)
                return
            }

            this.setState({
                bookName: res.book_name,
                authorName: res.author_name,
                classifyName: res.classify_name,
                lastUpdateAt: res.last_update_at,
                bookDesc: res.book_desc,
                recentChapterUrl: res.recent_chapter_url,
            })
        })
    }

    /**
     * 获取小说章节
     */
    /**
     * 查询目录
     */
    handleGetChapterList(url) {
        request({
            url: api.GET_CHAPTER,
            data: { url },
        }).then(res => {
            // 拼接分页数据  288 => 2、88,,,,2880 => 28、80
            const integer = Math.floor(res.length / 100)        // 整数部分
            const remainder = res.length % 100                  // 小数部分

            const page: Array<Page> = []

            /**
             * start、end  下标从 0 开始
             * page    0-99、100-199、200-299
             */
            for (let i = 0; i <= integer; i++) {
                const obj = Object.create(null)
                obj.id = String(i)
                obj.start = i * 100

                if (integer === 0) {   // 只有一页，0 - 88
                    obj.end = remainder - 1
                } else if (i === integer) {  // 最后一页
                    obj.end = i * 100 + remainder - 1
                } else {
                    obj.end = (i + 1) * 100 - 1
                }

                obj.desc = `${obj.start + 1} - ${obj.end + 1}`

                page.push(obj)
            }

            this.setState({
                all: res,
                page,
                list: res.slice(0, 100),
            })
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
     * 章节 > 章节排序
     */
    handleOrderChapter() {
        const list = this.state.list
        list.reverse()
        this.setState({ list })
    }

    /**
     * 渲染章节抽屉
     */
    renderChapter() {
        const { chapterVisible, bookName, all = [], list = [], page = [], isShowPage } = this.state

        return (
            <AtDrawer
                show={chapterVisible}
                mask
            >
                <View className="chapter">
                    <View className="bookname chapter-header">
                        {bookName}(共 {all.length} 章)
                    </View>

                    <View className="at-row chapter-menus">
                        <View className="at-col align-center">目录</View>
                        <View className="at-col align-center"
                            onClick={() => this.handleUpdateState({ isShowPage: !isShowPage })}>切换翻页</View>
                        {
                            !isShowPage && <View className="at-col align-center"
                                onClick={() => this.handleOrderChapter()}>排序</View>
                        }
                    </View>

                    <ScrollView scrollY={true} className="chapter-list">
                        {
                            isShowPage ? (
                                page.map((item: Page) => (
                                    <View
                                        className="chapter-item"
                                        key={item.id}
                                        onClick={() => this.handleUpdateState({ isShowPage: !isShowPage, list: all.slice(item.start, item.end + 1) })}
                                    >{item.desc}</View>
                                ))
                            ) : (
                                    list.map((item: Chapter) => (
                                        <View
                                            className="chapter-item"
                                            key={item.uuid}>{item.name}</View>
                                    ))
                                )
                        }
                    </ScrollView>
                </View>
            </AtDrawer>
        )
    }

    /**
     * 返回上一个页面
     */
    handleBack () {
        Taro.navigateBack()
    }

    /**
     * 加入书架
     */
    handleJoinShelf () {
        const userId = Taro.getStorageSync('userId')
        const { bookName, authorName, bookDesc, recentChapterUrl } = this.state

        request({
            url: api.GET_SHELF,
            data: {
                user_id: userId,
                book_name: bookName,
                author_name: authorName,
            }
        }).then(res => {
            if (res.length > 0) {
                Taro.showToast({
                    title: '已加入书架',
                    icon: 'none',
                })
                return  
            }

            request({
                url: api.ADD_SHELF,
                method: 'POST',
                data: {
                    user_id: userId,
                    book_name: bookName,
                    author_name: authorName,
                    book_desc: bookDesc,
                    book_cover_url: 'https://novel.dkvirus.top/images/cover.png',
                    recent_chapter_url: recentChapterUrl,
                }
            }).then(res => {
                Taro.switchTab({
                    url: '/pages/shelf/index' 
                })
            }).catch(err => {
                Taro.showToast({
                    title: '加入书架失败',
                    icon: 'none'
                })
            })
        })
    }

    render() {
        const { bookName, authorName, lastUpdateAt, classifyName, bookDesc } = this.state

        return (
            <View className="container">
                <View className="navbar">
                    <AtIcon value="chevron-left" onClick={() => this.handleBack()}></AtIcon>
                    公羊阅读
                </View>

                <View className="at-row info">
                    <View className="at-col at-col-3">
                        <Image className="cover" src={icon_cover}></Image>
                    </View>

                    <View className="at-col at-col-9 right">
                        <View className="bookname">{bookName}</View>
                        <View className="authorname">作者：{authorName}</View>
                    </View>
                </View>

                <View className="classify">
                    <View>最后更新时间:{lastUpdateAt}</View>
                    <View>分类:{classifyName}</View>
                </View>

                <View className="desc">
                    <View className="at-article__h2">小说简介</View>
                    <View className="at-article__p">
                        {bookDesc}
                    </View>
                </View>

                <View className="at-row btn-groups">
                    <View className="at-col btn-item btn-chapter"
                        onClick={() => this.handleUpdateState({ chapterVisible: true })}>查看目录</View>
                    <View className="at-col btn-item btn-shelf"
                        onClick={() => this.handleJoinShelf()}>加入书架</View>
                </View>

                {this.renderChapter()}
            </View>
        )
    }
}