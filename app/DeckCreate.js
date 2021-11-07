import React, { useState, useEffect } from 'react';
import {getCardLists, _receiveDeckData, getCardData} from './database/User'
import CardItem from './component/CardItem';
import DeckSelect from './component/DeckSelect'
import { Button, SafeAreaView, StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity } from 'react-native';

function Screen({route, navigation}) {
    const [Deck, setDeck] = useState([]);
    const [Name, setName] = useState("test");
    const [CardLists, setCardLists] = useState([]);
    const [dropZoneValues, setDropzone] = useState();
    const [deckZoneValues, setDeckzone] = useState();
    const [cardInDeck, setCardInDeck] = useState([]);
    const [cardCount, setCardCount] = useState(0);

    const renderCardItem = (data) => {
      return (<CardItem 
        image={data.item.imgURL} 
        cardId = {data.item.id} 
        dropzone={deckZoneValues}
        addCardToDeck = {(id) => {
          console.log('Add Card:', id, 'to Deck!!');
          setDeck([...Deck, id]);
        }}
      />)
    }

    const renderDeckSelect = (data) => {
      
      return (<DeckSelect
        image={data.item.imgURL} 
        cardId = {data.item.id} 
        dropzone={dropZoneValues}
        count = {data.item.count}
        DeleteFromDeck = {(id) => {
          console.log('Delete Card:', id, 'from Deck...');
          var dummy = Deck;
          setDeck(dummy.splice(Deck.indexOf(id), 1));
        }}
      />)
    }

    const _retrieveCardLists = async() => {
      let cardURL = await getCardLists();
      // console.log(cardURL);
      setCardLists(cardURL);
    }

    const _retrieveCardInDeck = async(deck, params) => {
      let cardInDeck = []
      if (deck == null){
        cardInDeck = await getCardData(params);
      }
      else {
        cardInDeck = await getCardData(deck);
      }
      setCardInDeck(cardInDeck);
    }

    const saveDeck = () => {
      
    }

    const setDeckZoneLocations = (event) => {
      let dz = event.nativeEvent.layout;
      setDeckzone(dz);
    }

    const setDropZoneLocations = (event) => {
      let dz = event.nativeEvent.layout;
      setDropzone(dz);
    }

    useEffect(() => {
      setDeck(route.params.DECK);
      _retrieveCardLists();
    }
    ,[])

    useEffect(() =>{
      _retrieveCardInDeck(Deck, route.params.DECK);
      setCardCount(Deck.length);
    },[Deck])

    return (
      <View style={{
        flex: 1
      }}>
        <View
          onLayout = {(event) => setDeckZoneLocations(event)} 
          style={styles.selectDeck}>
            <View style={{flex: 0.8, backgroundColor: "white"}}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
              <FlatList
                data={cardInDeck}
                renderItem={renderDeckSelect} numColumns={40}
                style = {styles.cardInDeck}
              />
            </ScrollView >
            </View>
            <View style={styles.boxItem}>
              <View style={{flex: 1, alignItems: "center"}}>
                <Text>
                  { cardCount } | 40
                </Text>
                <TouchableOpacity style={styles.saveButton} 
                  onPress={saveDeck}
                >
                  <Text>SAVE</Text>
                </TouchableOpacity>
              </View>
            </View>         
        </View>
        <View 
          style={styles.cardList} 
          onLayout = {(event) => setDropZoneLocations(event)} 
        >
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
      flexDirection: 'row'
  },
  cardList: {
    flex: 0.65,
    backgroundColor: "silver",
    elevation: 2, // works on android   
  },
  listData: {
    padding: 10
  },
  cardInDeck:{

  },
  saveButton: {
    height: 40,
    width: 100,
    backgroundColor: "blue",
    margin: 20,
    textAlign: 'center'
  },
  boxItem: {
    flex: 0.2, 
    backgroundColor: "red"
  }
})

export default Screen;
