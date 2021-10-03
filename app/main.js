import React, { useState, useEffect } from 'react';
import { database } from './database/db';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Screen() {
    const [Deck, setDeck] = useState([]);
    const [Name, setName] = useState("")
    const [UID, setUID] = useState("");

    const _retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('logIn_User');
        setUID(value)
      } catch (error) {
        // Error retrieving data
        console.log('error')
      }
    }

    useEffect(() => {
      _retrieveData();
    }, [])
  
    return (
      <SafeAreaView>
        <View>
          <Text>
            {UID}
          </Text>
          <Button title='PLAY' />
          <Button title='DECK' />
          <Button title='EXIT' />
        </View>      
      </SafeAreaView>
    );
}

export default Screen;
