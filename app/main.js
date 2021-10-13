import React, { useState, useEffect } from 'react';
import { database } from './database/db';
import { Button, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Screen({navigation}) {
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
      <SafeAreaView style={styles.container} >
          <Text>
            {UID}
          </Text>
            <View style={styles.viewbutton}>
              <TouchableOpacity style={styles.buttonPlay}
              // onPress={() => navigation.navigate('Play')}
              > 
              <Text style={styles.textinbutton}> Play </Text> 
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonDeck}
              onPress={() => navigation.navigate('Deck')}> 
              <Text style={styles.textinbutton}> Deck </Text> 
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonExit}
               onPress={() => navigation.navigate('LogIn')}> 
              <Text style={styles.textinbutton}> Exit </Text> 
              </TouchableOpacity>
            </View> 
      </SafeAreaView>
    );
}


const styles = StyleSheet.create({
  // SafeAreaView
  container: {
    flex: 1,
    backgroundColor:"white"
  },
    viewbutton:{
      flex:1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    // ปุ่ม Play
    buttonPlay:{
      borderWidth:3,
      borderColor:'#0086f5',
      backgroundColor:'#4286f5',
      borderRadius:2,
      margin:10,
      paddingHorizontal: 30,
      paddingVertical: 5
    },
    // ปุ่ม Deck 
    buttonDeck:{
      borderWidth:3,
      borderColor:'#40D60E',
      backgroundColor:'#84D60E',
      borderRadius:2,
      margin:10,
      paddingHorizontal: 30,
      paddingVertical: 5
    },
    // ปุ่ม Exit 
    buttonExit:{
      borderWidth:3,
      borderColor:'#A00E0E',
      backgroundColor:'#D60E0E',
      borderRadius:2,
      margin:10,
      paddingHorizontal: 30,
      paddingVertical: 5
    },
    textinbutton:{
      color:"black",
      fontWeight:'bold',
      textAlign:'center'
    }
})

export default Screen;
