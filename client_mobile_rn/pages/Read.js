import React from 'react';
import { View, Text } from 'react-native';

/**
 * 小说阅读页面
 */
class Read extends React.Component {
    // 顶部标题栏
    static navigationOptions = {
        headerTitle: <Text>阅读页面</Text>,
    };

    render () {
        const { navigation } = this.props;
        const url = navigation.getParam('url');

        return (
            <View>
                <Text>阅读页面</Text>
                <Text>阅读地址：{url}</Text>
            </View>        
        )
    }
}

export default Read;