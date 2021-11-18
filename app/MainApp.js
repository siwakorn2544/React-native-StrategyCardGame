import React from 'react';
import DeckCreate from './DeckCreate';
import LogIn from './logIn';
import Main from './main';
import MatchMaking from './matchMaking';
import PlayRoom from './playRoom';
import Testing from "./test";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


function MyApp() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer >
      <Stack.Navigator 
        // initialRouteName="LogIn"
        initialRouteName="Test"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Test" component={Testing} />
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="DeckC" component={DeckCreate} />
        <Stack.Screen name="MatchMaking" component={MatchMaking} />
        <Stack.Screen name="PlayRoom" component={PlayRoom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MyApp;
