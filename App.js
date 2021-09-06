import React, { useState } from 'react';
import { database } from './db';

import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';


function App() {
  const [Deck, setDeck] = useState([]);
  const [Name, setName] = useState("test");

  React.useEffect( () => {
    const dataName = database().ref('/users/88888/Name')
    const ChangeName = dataName.on('value', 
                       data => {
                          setName(data.val());
                          console.log('User Name: ', data.val());
                      });
    return () => {
      dataName.off('value', ChangeName);
    }
  })

  return (
    <SafeAreaView>
      <View>
        <Text>
          {Name}
        </Text>
        <Button onPress={
          ()=> {
            database()
            .ref('/users/88888')
            .update({"Name": 'God Pete inwZa'});
          }}
          title="Change Pete to God!"
        />
      </View>      
    </SafeAreaView>
  );
};


export default App;
