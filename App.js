import React from 'react';
import {
    SafeAreaView, 
    StatusBar,
} from 'react-native';
import { 
    createSwitchNavigator,
    createAppContainer
} from "react-navigation";

import { 
    Provider 
} from 'react-redux'
import { 
    createStore, 
    applyMiddleware, 
    compose 
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './src/API';
import reducers from './src/redux/reducers';
import NotifService from "./src/components/notifService";
//-------------------頁面組件--------------------
import LoginScreen from "./src/pages/login";
import AppScreen from "./src/pages/appRouter";
//-------------------路由設定-------------------
const AppStack = createAppContainer(
    createSwitchNavigator({
        login: LoginScreen,
        app: AppScreen
    },{
        initialRouteName: "login",
    })
)
//--------------------App進入點------------------
const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducers, compose(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(rootSaga);
export default function() {
  return (
    <SafeAreaView style={{flex: 1,backgroundColor:"#141C26"}}>
        <StatusBar barStyle="light-content" />
        <Provider store={store}>
            <NotifService/>
            <AppStack/>
        </Provider>
    </SafeAreaView>
  )
}
