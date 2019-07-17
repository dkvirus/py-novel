import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'

import icon_cover from '../../images/cover.png'
import request from '../../utils/request'
import * as api from '../../utils/api'
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
} 

export default class Index extends Component<{}, State> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }

  state = {
    shelfList: [],            // 小说书架列表
    settingEnable: false,     // 是否编辑
    userInfo: {},
  }

  componentWillMount () { 
    // 请求用户信息，拿到 userId
    const userId = 9
    Taro.setStorageSync('openId', 'o02_15SJd-Kgc5rC3nMmPgOePaPE')
    Taro.setStorageSync('user_id', 9)
    this.handleGetShelfList(userId)
    this.handleGetUserInfo()
  }

  /**
   * 查询小说列表
   */
  handleGetShelfList (userId) {
    request({
      url: api.GET_SHELF,
      data: { user_id: userId }
    })
    .then(res => {
      this.setState({ shelfList: res, settingEnable: false })
    }).catch(err => {
    })
  }

  /**
   * 获取微信用户信息
   */
  handleGetUserInfo () {
    Taro.getUserInfo()
    .then(res => {
      this.setState({ userInfo: res.userInfo })
    })
  }

  /**
   * 跳转到阅读页面
   */
  handleGoReadPage ({ recent_chapter_url, book_name, id }) {
    Taro.navigateTo({
      url: `/pages/read/index?chapterUrl=${recent_chapter_url}&bookName=${book_name}&novelId=${id}`
    })
  }

  render () {
    const shelfList: Array<Shelf> = this.state.shelfList
    const userInfo: UserInfo  = this.state.userInfo

    return (
      <View className='index'>
        {
          userInfo.nickName && (
            <View className="header at-row">
              <AtAvatar circle image={userInfo.avatarUrl}></AtAvatar>

              <View className="at-col at-col-6">
                {userInfo.nickName}
              </View>

              <View className='at-icon at-icon-settings'></View>
            </View>
          )
        }

        {
          shelfList.length > 0 &&
          (
            <View className="shelf-list">
              {
                shelfList.map((shelf, index) => (
                  <View className="shelf-item" key={shelf.book_name} onClick={() => this.handleGoReadPage(shelf)}>
                    <View className="shelf-wrapper">
                      <Image src={icon_cover} className="shelf-cover"></Image>

                      <View className="shelf-novelname">
                        {shelf.book_name}
                      </View>
                      <View className="shelf-authorname">
                        {shelf.author_name}
                      </View>
                    </View>
                  </View>
                ))
              }
            </View>
          )
        }
      </View>
    )
  }
}
