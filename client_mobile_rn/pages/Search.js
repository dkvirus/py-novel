import React from 'react';
import { View, Text, TouchableNativeFeedback, StyleSheet } from 'react-native';

/**
 * 小说搜索页面
 */
class Search extends React.Component {
    // 顶部标题栏
    static navigationOptions = {
        headerTitle: <Text>搜索页面</Text>,
    };

    /**
     * 跳转介绍页面
     */
    handleGoIntro (url) {
        this.props.navigation.navigate('Intro', { url });
    }

    render () {
        return (
            <View>
                <Text>搜索页面</Text>

                <TouchableNativeFeedback onPress={() => this.handleGoIntro('https://www.biquge5200.cc/92_92627/')}>
                    <View style={styles.item}>
                        <Text>都市阴阳师</Text>
                        <Text>巫九</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>        
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

export default Search;