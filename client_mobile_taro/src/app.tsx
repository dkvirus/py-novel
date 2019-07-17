import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/shelf/index'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/shelf/index',
      'pages/intro/index',
      'pages/classify/index',
      'pages/read/index',
      'pages/search/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#0068C4',
      navigationBarTitleText: '公羊阅读',
      navigationBarTextStyle: 'white',
      navigationStyle: 'custom',
      enablePullDownRefresh: false,
    },
    tabBar: {
      backgroundColor: '#fafafa',
      borderStyle: 'white',
      selectedColor: '#51d1cc',
      color: '#666',
      list: [
        {
          pagePath: 'pages/shelf/index',
          iconPath: 'images/book-shelf.png',
          selectedIconPath: 'images/book-shelf-selected.png',
          text: '书架'
        },
        {
          pagePath: 'pages/classify/index',
          iconPath: 'images/book-shop.png',
          selectedIconPath: 'images/book-shop-selected.png',
          text: '书屋'
        },
      ]
    },
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
