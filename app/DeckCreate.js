import React, { useState, useEffect } from 'react';
import { database } from './database/db';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';

function Screen() {
    const [Deck, setDeck] = useState([]);
    const [Name, setName] = useState("test");
    return (
      <SafeAreaView>
        <View>
          <Text>
            {Name}
          </Text>
          <Button title="write file" /> 
        </View>      
      </SafeAreaView>
    );
}

export default Screen;
