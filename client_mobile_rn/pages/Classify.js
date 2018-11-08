import React from 'react';
import { View, Text, TouchableNativeFeedback, StyleSheet } from 'react-native';
import { TabBar } from 'antd-mobile-rn';

/**
 * 小说分类页面
 */
class Classify extends React.Component {
    // 顶部标题栏
    static navigationOptions = {
        headerTitle: <Text>书屋</Text>,
    };

    /**
     * 返回首页
     */
    handleGoHome () {
        this.props.navigation.navigate('Home');
    }

    /**
     * 跳转介绍页面
     */
    handleGoIntro (url) {
        this.props.navigation.navigate('Intro', { url });
    }

    render () {
        return (
            <TabBar
                unselectedTintColor="#949494"
                tintColor="#33A3F4"
                barTintColor="#ccc"
            >
                <TabBar.Item
                    title="书架"
                    icon={require('../images/book-shelf.png')}
                    selectedIcon={require('../images/book-shelf-selected.png')}
                    selected={false}
                    onPress={() => this.handleGoHome()}
                >
                </TabBar.Item>

                <TabBar.Item
                    title="书屋"
                    icon={require('../images/book-shop.png')}
                    selectedIcon={require('../images/book-shop-selected.png')}
                    selected={true}
                >
                    <View>
                        <Text>分类页面</Text>

                        <TouchableNativeFeedback onPress={() => this.handleGoIntro('https://www.biquge5200.cc/92_92627/')}>
                            <View style={styles.item}>
                                <Text>都市阴阳师</Text>
                                <Text>巫九</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>    
                </TabBar.Item>
            </TabBar>      
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ccc',
    },
    body: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 10,
    },
    bodyWrap: {
        width: '96%',
        backgroundColor: '#fff',
        borderRadius: 4,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    item: {
        height: 100,
        width: 100,
        marginBottom: 20,
        borderRadius: 4,
        borderWidth: 0.5,
    }
});

export default Classify;