import Taro, { Component, Config } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'

import request from '../../utils/request'
import * as api from '../../utils/api'
import './index.scss'

export default class IntroPage extends Component {
    config: Config = {
    }

    render() {
        return (
            <View>
                介绍页面
            </View>
        )
    }
}