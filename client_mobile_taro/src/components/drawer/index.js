import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

class Drawer extends Taro.Component {
    render () {
        const { 
            visible,
            width,
            height,
            placement = 'left', 
        } = this.props


        return (
            visible && <View className="drawer">
                <View className="drawer-mask"></View>
                <View className="drawer-content">
                    {this.props.children}
                </View>
            </View>    
        )
    }
}

export default Drawer