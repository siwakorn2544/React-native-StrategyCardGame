import React, { useState } from 'react';
import DeckCreate from './app/DeckCreate';
import LogIn from './app/logIn';
import Main from './app/main';
import MatchMaking from './app/matchMaking';
import PlayRoom from './app/playRoom';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer >
      <Stack.Navigator 
        initialRouteName="LogIn"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Deck" component={DeckCreate} />
        <Stack.Screen name="MatchMaking" component={MatchMaking} />
        <Stack.Screen name="PlayRoom" component={PlayRoom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;