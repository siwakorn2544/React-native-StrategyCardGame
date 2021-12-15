import React from 'react';
import DeckCreate from './DeckCreate';
import LogIn from './logIn';
import Main from './main';
import MatchMaking from './matchMaking';
import PlayRoom from './playRoom';
import Testing from "./test";
import TestRedux from './Testredux'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import userReducer from './redux/userReducer';


function MyApp() {
  const Stack = createNativeStackNavigator();

  const rootReducer = combineReducers({
    user: userReducer, });
  const store = createStore(rootReducer);


  return (
    <Provider store={store}>
    <NavigationContainer >
      <Stack.Navigator 
        initialRouteName="LogIn"
        // initialRouteName="Test"
        // initialRouteName="PlayRoom"
        // initialRouteName="TestRedux"
        screenOptions={{
          headerShown: false
        }}
      >
        {/* <Stack.Screen name="Test" component={Testing} /> */}
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="DeckC" component={DeckCreate} />
        <Stack.Screen name="MatchMaking" component={MatchMaking} />
        <Stack.Screen name="PlayRoom" component={PlayRoom} />
        <Stack.Screen name="TestRedux" component={TestRedux} />
      </Stack.Navigator>
    </NavigationContainer></Provider>
  );
}

export default MyApp;
