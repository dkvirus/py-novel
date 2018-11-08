import React from 'react';
import { StyleSheet, View, Text, TouchableNativeFeedback, Image } from 'react-native';
import { TabBar } from 'antd-mobile-rn';

/**
 * 首页-书架页面
 */
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            novelList: [
                {
                    "author_name": "巫九",
                    "book_name": "都市阴阳师",
                    "chapter_url": "https://www.biquge5200.cc/84_84888/152458677.html"
                }
            ],
            selectedTab: 'shelf'
        };
    }

    // 顶部标题栏
    static navigationOptions = {
        headerTitle: <Text>书架</Text>,
        headerRight: <Image source={require('../images/setting.png')} style={{ width: 40, height: 40 }}></Image>
    };

    /**
     * 跳转搜索页面
     */
    handleGoSearch() {
        this.props.navigation.navigate('Search');
    }

    /**
     * 跳转阅读页面
     */
    handleGoRead (url) {
        this.props.navigation.navigate('Read', { url });
    }

    /**
     * 跳转分类页面
     */
    handleGoClassify () {
        this.props.navigation.navigate('Classify')
    }

    render() {
        const novelList = this.state.novelList || [];

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
                    selected={true}
                >
                    <View style={styles.container}>
                        <View style={styles.body}>
                            <TouchableNativeFeedback onPress={() => this.handleGoRead('https://www.biquge5200.cc/84_84888/152458677.html')}>
                                <View style={styles.item}>
                                    <Text>都市阴阳师</Text>
                                    <Text>巫九</Text>
                                </View>
                            </TouchableNativeFeedback>

                            <TouchableNativeFeedback onPress={() => this.handleGoSearch()}>
                                <View style={styles.item}>
                                    <Text>+</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </TabBar.Item>

                <TabBar.Item
                    title="书屋"
                    icon={require('../images/book-shop.png')}
                    selectedIcon={require('../images/book-shop-selected.png')}
                    selected={false}
                    onPress={() => this.handleGoClassify('Classify')}
                >
                </TabBar.Item>
            </TabBar>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#ccc',
        height: '100%',
    },
    body: {
        width: '100%',
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
    },
    tabbar: {
        position: 'absolute',
        bottom: 0,
    }
});

export default Home;