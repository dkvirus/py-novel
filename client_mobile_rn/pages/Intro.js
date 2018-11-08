import React from 'react';
import { View, Text, Button } from 'react-native';

/**
 * 小说介绍页面
 */
class Intro extends React.Component {
    // 顶部标题栏
    static navigationOptions = {
        headerTitle: <Text>介绍页面</Text>,
    };

    /**
     * 返回首页
     */
    handleGoHome () {
        this.props.navigation.navigate('Home');
    }

    render () {
        const { navigation } = this.props;
        const url = navigation.getParam('url');

        return (
            <View>
                <Text>小说介绍页面</Text>
                <Text>小说地址：{url}</Text>

                <Button onPress={() => this.handleGoHome()} title="返回书架"></Button>
            </View>        
        )
    }
}

export default Intro;