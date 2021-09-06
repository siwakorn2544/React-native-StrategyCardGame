import React, { useState, useEffect } from 'react';
import { database } from '../db';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';


function Screen() {
    const [Deck, setDeck] = useState([]);
    const [Name, setName] = useState("test");
  
    // useEffect( () => {
    //   const dataName = database().ref('/users/88888/Name')
    //   const ChangeName = dataName.on('value', 
    //                      data => {
    //                         setName(data.val());
    //                         console.log('User Name: ', data.val());
    //                     });
    //   return () => {
    //     dataName.off('value', ChangeName);
    //   }
    // })
  
    return (
      <SafeAreaView>
        <View>
          <Text>
            {Name}
          </Text>
        </View>      
      </SafeAreaView>
    );
}

export default Screen;
