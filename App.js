import React, { useState } from 'react';
import DeckCreate from './app/DeckCreate';
import LogIn from './app/logIn';
import Main from './app/main';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer headerShown='false'>
      <Stack.Navigator 
        initialRouteName="LogIn"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Deck" component={DeckCreate} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;