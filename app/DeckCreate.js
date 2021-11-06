import React, { useState, useEffect } from 'react';
import {getCardLists} from './database/User'
import CardItem from './component/CardItem';
import { Button, SafeAreaView, StyleSheet, Text, View, FlatList } from 'react-native';

function Screen({route, navigation}) {
    const [Deck, setDeck] = useState([]);
    const [Name, setName] = useState("test");
    const [CardLists, setCardLists] = useState([]);
    const [dropzoneValues, setDropzone] = useState();

    const renderCardItem = (data) => {
      return (<CardItem 
        image={data.item.imgURL} 
        cardId = {data.item.id} 
        dropzone={dropzoneValues}
        addCardToDeck = {(id) => {
          console.log('Add Card:', id, 'to Deck!!');
          setDeck([...Deck, id]);
        }}
      />)
    }

    const _retrieveCardLists = async() => {
      let cardURL = await getCardLists();
      // console.log(cardURL);
      setCardLists(cardURL);
    }

    const setDropzoneLocations = (event) => {
      let dz = event.nativeEvent.layout;
      setDropzone(dz);
    }

    useEffect(() => {
      setDeck(route.params.DECK);
      _retrieveCardLists()
    }
    ,[])

    return (
      <View style={{
        flex: 1
      }}>
        <View
          onLayout = {(event) => setDropzoneLocations(event)} 
          style={styles.selectDeck}>

        </View>
        <View style={styles.cardList}>
          <FlatList 
            data={CardLists} 
            renderItem={renderCardItem} numColumns={5}
            style={styles.listData}
          />
        </View>      
      </View>
    );
}

const styles = StyleSheet.create({
  selectDeck: {
      flex: 0.35,
      backgroundColor: "red",
      elevation: 2, // works on android 
  },
  cardList: {
    flex: 0.65,
    backgroundColor: "silver",
    elevation: 2, // works on android   
  },
listData: {
  padding: 10
}
})

export default Screen;
