import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { HomePage, SearchPage, ReadPage, IntroPage, ClassifyPage } from './pages/index';

/**
 * 创建路由
 */
const RootStack = createStackNavigator({
  Home: HomePage,
  Search: SearchPage,
  Read: ReadPage,
  Intro: IntroPage,
  Classify: ClassifyPage,
}, {
  initialRouteName: 'Home',
});

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
