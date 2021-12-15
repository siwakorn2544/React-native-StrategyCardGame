import React, { useState, useEffect } from 'react';
import {getCardLists, _receiveDeckData, getCardData, _saveDataDeck} from './database/User'
import CardItem from './component/CardItem';
import DeckSelect from './component/DeckSelect'
import { Button, SafeAreaView, StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity,ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useSelector, useDispatch } from "react-redux";
import { setdeck } from './redux/userAction';

function Screen({route, navigation}) {
    const reduxUid = useSelector( (state) => state.user.uid );
    const reduxDeck = useSelector( (state) => state.user.deck );
    const reduxData = useSelector( (state) => state.user );
    const dispatch = useDispatch()
    const [Deck, setDeck] = useState([]);
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
          if (cardCheckLimit(id)){
            console.log('Add Card:', id, 'to Deck!!');
            setDeck([...Deck, id]);
          }
        }}
      />)
    }

    const cardCheckLimit = (id) => {
      //case1: card in deck equal 40
      if(cardCount == 40){
        alert("you can't add card in deck more then 40");
        return false
      }
      //case2: card in duplicate more then 3
        const card = cardInDeck.filter((card) => {
          if(card.id == id){
            return card;
          }
        });
        if (card[0] == undefined){
          return true
        }
        else if (card[0].count < 3){
          return true
        }
        alert("you can't add card duplicate more than 3");
        return false
    }

    const renderDeckSelect = (data) => {
      
      return (<DeckSelect
        image={data.item.imgURL} 
        cardId = {data.item.id} 
        dropzone={dropZoneValues}
        count = {data.item.count}
        DeleteFromDeck = {(id) => {
          console.log('Delete Card:', id, 'from Deck...');
          var check = Deck.indexOf(id);
          var dummy = Deck.filter((i, index) => {return index != check})
          setDeck(dummy);
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
      _saveDataDeck(reduxUid, Deck);
      dispatch(setdeck(Deck))
      alert("SAVE DECK!")
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
      if (reduxDeck != null){
        setDeck(reduxDeck);
      }
      _retrieveCardLists();
    }
    ,[])

    useEffect(() =>{
      _retrieveCardInDeck(Deck, reduxDeck);
      setCardCount(Deck.length);
    },[Deck])

    const BackIcon = () => {
      return(
        <Icon name="keyboard-return" size={25} color="black"> </Icon>
      )
    }

    return (
      <View style={{
        flex: 1
      }}>
        <ImageBackground source={require('./assets/3.jpg')} resizeMode="cover" style={styles.imageBG}>
        <View
          onLayout = {(event) => setDeckZoneLocations(event)} 
          style={styles.selectDeck}>
                <TouchableOpacity  
                  onPress={() => navigation.navigate('Main')}
                    style={styles.ViewText} 
                >
                  <Text>Back</Text>
                  <BackIcon/>
                </TouchableOpacity>
            <View style={{flex: 0.7, backgroundColor: "rgba(61, 16, 16, 0.80)"}}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
              <FlatList
                data={cardInDeck}
                renderItem={renderDeckSelect} numColumns={40}
                style = {styles.cardInDeck}
              />
            </ScrollView >
            </View>
            <View style={styles.boxItem}>
              <View style={{flex: 1, alignItems: "center" ,justifyContent:"center",flexDirection:'column-reverse'}}>
                <Text >
                  { cardCount } / 40
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
        </ImageBackground>   
      </View>
    );
}

const styles = StyleSheet.create({
  selectDeck: {
      flex: 0.35,
      backgroundColor: "rgba(255, 255, 255, 0)",
      elevation: 2, // works on android
      flexDirection: 'row'
  },
  cardList: {
    flex: 0.65,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    elevation: 2, // works on android   
  },
  listData: {
    padding: 10
  },
  cardInDeck:{

  },
  imageBG:{
    flex:1, 
  },
  saveButton: {
    height: 40,
    width: 100,
    backgroundColor: "rgba(226, 255, 0, 0.8)",
    margin: 20,
    textAlign: 'center',
    justifyContent:'center',
    alignItems:'center',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  boxItem: {
    flex: 0.2, 
    backgroundColor: "rgba(0, 178, 255, 0.8)"
  },
  ViewText:{
    flex: 0.1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: "rgba(255, 77, 0, 0.8)",
  },
})

export default Screen;
