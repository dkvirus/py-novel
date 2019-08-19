import Taro, { Component, Config } from '@tarojs/taro'
import { View, RichText, ScrollView } from '@tarojs/components'
import { AtDrawer, AtActionSheet, AtIcon } from 'taro-ui'

import request from '../../utils/request'
import * as api from '../../utils/api'
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

export default class ReadPage extends Component {
    config: Config = {
    }

    state = {
        novelId: '',
        bookName: '',
        title: '',
        content: '',
        prevUrl: '',
        nextUrl: '',
        scrollTop: 0,               // 点击"下一章"时，文章滚动条能回到页面顶部

        all: [],                    // 所有列表信息
        page: [],                   // 大分页 1-100、101-200、201-300
        list: [],                   // 小分页展示的数据 
        isShowPage: false,          // 是否显示大分页
        chapterVisible: false,      // 左侧章节抽屉是否可见

        menuVisible: false,         // 菜单抽屉是否可见。'目录' | '设置' | '白天/黑夜'
        isDark: false,              // 白天还是黑夜

        settingVisible: false,      // 设置抽屉是否可见。字体大小、背景颜色、亮度
        bgColor: '#fff',
        font: 15,
    }

    componentWillMount() {
        const { bookName = '', chapterUrl = '', novelId } = this.$router.params
        const novelUrl = chapterUrl.split('/').slice(0, 4).join('/')   // 用于查询目录

        this.handleGetChapterList(novelUrl)
        this.setState({ bookName, novelId }, () => {
            this.handleGetNovelContent(chapterUrl)
        })
    }

    /**
     * 查询目录
     */
    async handleGetChapterList(url) {
        const result = await request({
            url: api.GET_CHAPTER,
            data: { url },
        })

        // 拼接分页数据  288 => 2、88,,,,2880 => 28、80
        const integer = Math.floor(result.data.length / 100)        // 整数部分
        const remainder = result.data.length % 100                  // 小数部分

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
            all: result.data,
            page,
            list: result.data.slice(0, 100),
        })
    }

    /**
     * 查询小说内容
     */
    async handleGetNovelContent(url) {
        const { novelId } = this.state

        const result = await request({
            url: api.GET_CONTENT,
            data: { url, shelfId: novelId },
        })
        
        const { title, content, prevUrl, nextUrl } = result.data
        this.setState({
            title,
            content,
            prevUrl,
            nextUrl,
            settingVisible: false,
            menuVisible: false,
            chapterVisible: false,
            scrollTop: Math.random(),  // scrollTop 值不变时滚动条位置不会变
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
     * 返回书架页面
     */
    handleBack() {
        Taro.navigateBack()
    }

    /**
     * 显示目录
     * 根据当前阅读章节显示对应的目录
     */
    handleShowChapter () {
        const { title, all = [], page = [] } = this.state
        try {
            const index = all.findIndex((item:Chapter) => item.name.indexOf(title.trim()) !== -1) || 0
            const currentPage = page.find((item:Page) => item.start <= index && item.end >= index)
            const list = all.slice(currentPage.start, currentPage.end + 1)

            this.setState({ 
                menuVisible: false, 
                chapterVisible: true,
                list, 
            })
        } catch (e) {
            Taro.showToast({
                title: '页面打小差了，再试一下吧~',
                icon: 'none',
            })
            this.setState({
                menuVisible: false, 
            })
        }
    }

    /**
     * 渲染设置抽屉
     */
    renderMenu() {
        const { isDark, menuVisible } = this.state

        return (
            <AtActionSheet isOpened={menuVisible}
                onClose={() => this.handleUpdateState({ menuVisible: false })}>
                <View className='at-row read_menu'>
                    <View className='at-col'
                        onClick={() => this.handleShowChapter()}>
                        <View className='at-icon at-icon-bullet-list'></View>
                        <View>目录</View>
                    </View>

                    <View className='at-col'
                        onClick={() => this.handleUpdateState({ menuVisible: false, settingVisible: true })}>
                        <View className='at-icon at-icon-settings'></View>
                        <View>设置</View>
                    </View>

                    {
                        isDark ? (
                            <View className='at-col'
                                onClick={() => this.handleUpdateState({ isDark: !isDark, bgColor: '#fff' })}>
                                <View className='at-icon at-icon-loading-2'></View>
                                <View>白天</View>
                            </View>
                        ) : (
                            <View className='at-col'
                                onClick={() => this.handleUpdateState({ isDark: !isDark, bgColor: 'rgb(0, 0, 0)' })}>
                                <View className='at-icon at-icon-star'></View>
                                <View>黑夜</View>
                            </View>
                        )
                    }
                </View>
            </AtActionSheet>
        )
    }

    /**
     * 章节 > 点击章节
     */
    handleClickChapter(url) {
        this.setState({ chapterVisible: false })
        this.handleGetNovelContent(url)
    }

    /**
     * 章节 > 章节排序
     */
    handleOrderChapter() {
        const list = this.state.list
        list.reverse()
        this.setState({ list, scrollTop: Math.random() })
    }

    /**
     * 渲染章节抽屉
     */
    renderChapter() {
        const { chapterVisible, bookName, title, all = [], list = [], page = [], isShowPage, scrollTop } = this.state

        return (
            <AtDrawer
                show={chapterVisible}
                onClose={() => this.handleUpdateState({ chapterVisible: false })}
                mask
            >
                <View className="read_chapter">
                    <View className="read_chapter-header">
                        {bookName}(共 {all.length} 章)
                    </View>

                    <View className="at-row read_chapter-menus">
                        <View className="at-col read_align-center">目录</View>
                        <View className="at-col read_align-center"
                            onClick={() => this.handleUpdateState({ isShowPage: !isShowPage })}>切换翻页</View>
                        {
                            !isShowPage && <View className="at-col read_align-center"
                                onClick={() => this.handleOrderChapter()}>排序</View>
                        }
                    </View>

                    <ScrollView scrollY={true} className="read_chapter-list" scrollTop={scrollTop}>
                        {
                            isShowPage ? (
                                page.map((item: Page) => (
                                    <View
                                        className="read_chapter-item"
                                        key={item.id}
                                        onClick={() => this.handleUpdateState({ isShowPage: !isShowPage, list: all.slice(item.start, item.end + 1) })}
                                    >{item.desc}</View>
                                ))
                            ) : (
                                    list.map((item: Chapter) => (
                                        <View
                                            className={`read_chapter-item ${item.name === title.trim() ? 'read_chapter-active' : ''}`}
                                            key={item.uuid}
                                            onClick={() => this.handleClickChapter(item.url)}>{item.name}</View>
                                    ))
                                )
                        }
                    </ScrollView>
                </View>
            </AtDrawer>
        )
    }

    /**
     * 渲染设置
     */
    renderSetting() {
        const { settingVisible, font } = this.state

        const bgs = [
            '#fff',
            'rgb(158, 151, 167)',
            'rgb(177, 160, 132)',
            'rgb(165, 168, 185)',
            'rgb(187, 157, 171)',
        ]

        return (
            <AtActionSheet isOpened={settingVisible}
                onClose={() => this.handleUpdateState({ settingVisible: false })}>
                <View className="read_setting">
                    <View className="read_font">
                        <View className="read_label">字体</View>

                        <AtIcon
                            value="reload" color="rgb(107, 115, 117)" size={30}
                            onClick={() => this.handleUpdateState({ font: 14 })}></AtIcon>

                        <AtIcon
                            value="subtract-circle" color="rgb(107, 115, 117)" size={30}
                            onClick={() => this.handleUpdateState({ font: font - 2 })}></AtIcon>

                        <AtIcon
                            value="add-circle" color="rgb(107, 115, 117)" size={30}
                            onClick={() => this.handleUpdateState({ font: font + 2 })}></AtIcon>
                    </View>

                    <ScrollView scrollX={true} className="read_bg">
                        {
                            bgs.map(bg => (
                                <View
                                    key={bg}
                                    style={{ backgroundColor: bg }}
                                    className="read_bg-box"
                                    onClick={() => this.handleUpdateState({ bgColor: bg })}></View>
                            ))
                        }
                    </ScrollView>
                </View>
            </AtActionSheet>
        )
    }

    /**
     * 主页面：上一页 | 下一页
     */
    handleTurnPage(url, info) {
        if (url.indexOf('.html') === -1) {
            if (info === 'prev') {
                Taro.showToast({
                    title: '已经是第一章了',
                    icon: 'none',
                })
            } else if (info === 'next') {
                Taro.showToast({
                    title: '已经是最新章节了',
                    icon: 'none',
                })
            }
            return
        }

        this.handleGetNovelContent(url)
    }

    render() {
        const { content, title, prevUrl, nextUrl, bgColor, font, isDark, scrollTop = 0 } = this.state

        return (
            <View className="read_container" style={{ backgroundColor: bgColor }}>
                <View className="navbar" style={{ backgroundColor: bgColor, color: isDark ? '#666' : '#333' }}>
                    <AtIcon value="chevron-left" onClick={() => this.handleBack()}></AtIcon>
                    <View className="at-article__p read_title">{title}</View>
                </View>

                <ScrollView className="read_content" scrollTop={scrollTop} scrollY>
                    <RichText style={{ fontSize: font + 'px', lineHeight: font * 1.5 + 'px' }}
                        className="at-article__p"
                        nodes={content}
                        onClick={() => this.handleUpdateState({ menuVisible: true })}></RichText>
                </ScrollView>

                <View className="at-row read_footer">
                    <View className='at-col at-col-3 at-col__offset-6'
                        onClick={() => this.handleTurnPage(prevUrl, 'prev')}>
                        上一章
                    </View>
                    <View className='at-col at-col-3'
                        onClick={() => this.handleTurnPage(nextUrl, 'next')}>
                        下一章
                    </View>
                </View>

                {this.renderMenu()}
                {this.renderChapter()}
                {this.renderSetting()}
            </View>
        )
    }
}