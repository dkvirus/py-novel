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

        all: [],        // 所有列表信息
        page: [],       // 大分页 1-100、101-200、201-300
        list: [],       // 小分页展示的数据 
        isShowPage: false,          // 是否显示大分页
        chapterVisible: false,      // 左侧章节抽屉是否可见

        menuVisible: false,         // 菜单抽屉是否可见。'目录' | '设置' | '白天/黑夜'
        isDark: false,              // 白天还是黑夜

        settingVisible: false,      // 设置抽屉是否可见。字体大小、背景颜色、亮度
        bgColor: 'rgb(244, 243, 249)',
        font: 14,
    }

    componentWillMount() {
        const { bookName = '兵者', chapterUrl = 'https://www.biquge5200.cc/98_98081/155305426.html', novelId = 22 } = this.$router.params
        const novelUrl = chapterUrl.split('/').slice(0, 4).join('/')   // 用于查询目录

        this.setState({ bookName, novelId })
        this.handleGetChapterList(novelUrl)
        this.handleGetNovelContent(chapterUrl)
    }

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
     * 查询小说内容
     */
    handleGetNovelContent (url) {
        const { novelId } = this.state

        request({
            url: api.GET_CONTENT,
            data: { url },
        }).then(res => {
            const { title, content, prev_url, next_url } = res
            this.setState({
                title,
                content,
                prevUrl: prev_url,
                nextUrl: next_url,
            })

            return request({
                url: api.EDIT_SHELF,
                method: 'PUT',
                data: {
                    recent_chapter_url: url, 
                    id: novelId,
                }
            })
        }).then(res => {})
    }

    /**
     * 更改状态
     */
    handleUpdateState (variable: any, value?: any) {
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
    handleBack () {
        Taro.navigateBack()
    }

    /**
     * 渲染设置抽屉
     */
    renderMenu () {
        const { isDark, menuVisible } = this.state

        return (
            <AtActionSheet isOpened={menuVisible}>
                <View className='at-row menu'>
                    <View className='at-col' 
                        onClick={() => this.handleUpdateState({ menuVisible: false, chapterVisible: true })}>
                        <View className='at-icon at-icon-bullet-list'></View>
                        <View>目录</View>
                    </View>

                    <View className='at-col'
                        onClick={() => this.handleUpdateState({ menuVisible: false, settingVisible: true })}>
                        <View className='at-icon at-icon-settings'></View>
                        <View>设置</View>
                    </View>

                    <View className='at-col'
                        onClick={() => this.handleBack()}>
                        <View className='at-icon at-icon-chevron-left'></View>
                        <View>返回</View>
                    </View>
                    
                    {
                        isDark ? (
                            <View className='at-col' 
                                onClick={() => this.handleUpdateState({isDark: !isDark, bgColor: 'rgb(244, 243, 249)'})}>
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
    handleClickChapter (url) {
        this.setState({ chapterVisible: false })
        this.handleGetNovelContent(url)
    }   

    /**
     * 章节 > 章节排序
     */
    handleOrderChapter () {
        const list = this.state.list
        list.reverse()
        this.setState({ list })
    }

    /**
     * 渲染章节抽屉
     */
    renderChapter () {
        const { chapterVisible, bookName, title, all = [], list = [], page = [], isShowPage } = this.state

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
                                        className={`chapter-item ${item.name === title.trim() ? 'chapter-active' : ''}`}
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
    renderSetting () {
        const { settingVisible, font } = this.state

        const bgs = [
            'rgb(244, 243, 249)',
            'rgb(158, 151, 167)',
            'rgb(177, 160, 132)',
            'rgb(165, 168, 185)',
            'rgb(187, 157, 171)',
        ]

        return (
            <AtActionSheet isOpened={settingVisible}>
                <View className="setting">
                    <View className="font">
                        <View className="label">字体</View>

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

                    <ScrollView scrollX={true} className="bg">
                        {
                            bgs.map(bg => (
                                <View
                                    key={bg}
                                    style={{ backgroundColor: bg }}
                                    className="bg-box"
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
    handleTurnPage (url) {
        const { prevUrl, nextUrl } = this.state

        if (prevUrl.indexOf('.html') === -1 && nextUrl.indexOf('.html') !== -1) {
            return Taro.showToast({ title: '已经是第一章了', icon: 'none' }) 
        }
        if (prevUrl.indexOf('.html') !== -1 && nextUrl.indexOf('.html') === -1) {
            return Taro.showToast({ title: '已经是最新章节了', icon: 'none' })
        }

        this.handleGetNovelContent(url)
    }

    render() {
        const { content, title, prevUrl, nextUrl, bgColor, font } = this.state

        return (
            <View className="container" style={{ backgroundColor: bgColor }}>
                <View className="content">
                    <RichText style={{ fontSize: font + 'px', lineHeight: font * 1.5 + 'px' }} 
                        className="at-article__p"    
                        nodes={content}
                        onClick={() => this.handleUpdateState({ menuVisible: true, settingVisible: false })}></RichText>
                </View>

                <View className="at-row footer">
                    <View className='at-col at-col-6'>
                        {title}
                    </View>
                    <View className='at-col at-col-3'
                        onClick={() => this.handleTurnPage(prevUrl)}>
                        上一章
                    </View> 
                    <View className='at-col at-col-3'
                        onClick={() => this.handleTurnPage(nextUrl)}>
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