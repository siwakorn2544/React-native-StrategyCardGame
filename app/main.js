import React, { useState, useEffect} from 'react';
import {_receiveDeckData, _receiveName} from './database/User'
import { Button, SafeAreaView, StyleSheet, Text, View, Image, ImageBackground, Alert ,TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import _Deck from './class/Deck';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome5'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon4 from 'react-native-vector-icons/MaterialIcons'
import { get } from 'react-native/Libraries/Utilities/PixelRatio';

function Screen({route , navigation}) {
    const [myDeck, setDeck] = useState([]);
    const [Name, setName] = useState("");
    const [UID, setUID] = useState("");
    const [cardChecking, setCardChecking] = useState(0);
    const [matchMaking, setMatchMaking] = useState(false);
    const [finding, setFinding] = useState(false);
    const [imgUrl, setImg] = useState("");

    const _retrieveData = async () => {
      try {
        //GET DATA
        const value = route.params.UID;
        const image = route.params.image
        const name = await _receiveName(value);
        await _getDeck(value)
        //SET DATA
        setUID(value);
        setName(name);
        setImg(image);
        
        // console.log(image, name, deck);
      } catch (error) {
        // Error retrieving data
        console.log('error')
      }
      
    }

    const _getDeck = async (value) => {
      const deck = await _receiveDeckData(value);
      console.log(deck.length)
      setDeck(deck);
      return deck
    }

    const DeckChecking = async() => {
      const deck = await _getDeck(UID);
      setMatchMaking(true);
      setCardChecking(deck.length); 
      setFinding(false);
    }

    const GoToDeckCreate = async() => {
      const deck = await _getDeck(UID);
      navigation.navigate('DeckC', {UID: UID ,DECK: deck})
    }
    const MyXicon = () => {
      return(
        <Icon name="close" size={15} color="red" > </Icon>
      )
    }

    const MyOicon = () => {
      return(
        <Icon name="check" size={15} color="green"> </Icon>
      )
    }


    const MyFicon = () => {
      return(
        <Icon2 name="gamepad" size={25} color="black"> </Icon2>
      )
    }
    
    const MYDicon = () => {
      return(
        <Icon3 name="cards" size={25} color="black"> </Icon3>
      )
    }
    const MYEicon = () => {
      return(
        <Icon4 name="keyboard-return" size={25} color="black"> </Icon4>
      )
    }
    useEffect(() => {
      _retrieveData();
    //   return function cleanup() {
    //     mounted = false
    // }
    }, [])
  
    // useEffect(() => {
    //   let interval = null;
    //   if (matchMaking) {
    //     interval = setInterval(
    //         () => {
    //             setCardChecking(cardChecking => cardChecking+1);
    //         }
    //     , 20);
    // } else if (!matchMaking && cardChecking !== 0) {
    //     clearInterval(interval);
    //     setCardChecking(0);
    // }

    // if (cardChecking == myDeck.length || cardChecking == 40){
    //   clearInterval(interval);
    // }
    // return () => clearInterval(interval);
    // }, [matchMaking, cardChecking])
  
    return ( 
        <View style={{flex:1}}>
          <ImageBackground source={require('./assets/imggif/2.gif')} resizeMode="cover" style={styles.imageBG}>
            <View style={styles.imgForUser}>
                <View style={styles.backGroundIMG}>
                      <Image source={{uri:(imgUrl != "") ? imgUrl : 'https://picsum.photos/800/1200.jpg'}} style={styles.iconUser}/>
                </View>
                <View style={{position:"relative"}}>
                  <Text> {Name} </Text>
                </View>
            </View>
            <View style={styles.IMGICON}>
              <Image source={require('./assets/DOTLS.png')} style={styles.imageIconLOGO}/>
            </View>

        <View style={styles.viewbutton}>
          <View>
              <TouchableOpacity style={styles.buttonPlay}
              onPress= { DeckChecking }
              > 
              
              <Text style={styles.textinbutton}><MyFicon/>Play</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonDeck}
              onPress={ GoToDeckCreate }> 
              <Text style={styles.textinbutton}><MYDicon/>Deck</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonExit}
               onPress={() => navigation.navigate('LogIn')}> 
              <Text style={styles.textinbutton}><MYEicon/>Exit</Text>
              </TouchableOpacity>
            </View> 
        <Modal
          isVisible={matchMaking}
          backdropOpacity={0.5}
          style={{flex:1, justifyContent:'center',alignItems:'center'}}
        >
          <View style={styles.modal}>
            <Text>Data Checking</Text>
              { !finding &&
                <View style={styles.iconText}>
                  <Text>Deck card</Text>
                <Text>[ {cardChecking} /40]</Text>
                {/* ทำเพิ่มเปลี่ยน Text เป็น icon X O _Deck.maxDeck() */ }
                  { (cardChecking != _Deck.maxDeck()) && <MyXicon/>} 
                  { (cardChecking == _Deck.maxDeck()) && <MyOicon/>} 
                </View>
              }
          </View>
          <View style={{flexDirection:"row", justifyContent:"space-evenly", alignItems:"center"}}>
              <TouchableOpacity style={styles.cancelinPlay} onPress={ () => setMatchMaking(false) }>
                 <Text style={{color:"white"}}> cancal </Text>
              </TouchableOpacity>
              {(cardChecking == _Deck.maxDeck()) &&
              <TouchableOpacity style={styles.findRoom} onPress={ 
                () => navigation.navigate("MatchMaking", {
                  UID: UID,
                })
                } 
              >
                <Text style={{color:"white"}}>
                  Find Room
                </Text>
              </TouchableOpacity>
              }
            </View>
        </Modal>
        </View>     
        </ImageBackground> 
      </View>
    );
}

const styles = StyleSheet.create({
  imageBG:{
    flex:1, 
  },
    viewbutton:{
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    // ปุ่ม Play
    buttonPlay:{
      borderWidth:3,
      borderColor:'rgba(37, 97, 238, 0.8)',
      backgroundColor:'rgba(58, 112, 238, 0.8)',
      borderRadius:2,
      margin:10,
      paddingHorizontal: 200,
      paddingVertical: 10,
    },
    // ปุ่ม Deck 
    buttonDeck:{
      borderWidth:3,
      borderColor:'rgba(31, 183, 7, 0.7)',
      backgroundColor:'rgba(48, 226, 20, 0.7)',
      borderRadius:2,
      margin:10,
      paddingHorizontal: 200,
      paddingVertical: 10
    },
    // ปุ่ม Exit 
    buttonExit:{
      borderWidth:3,
      borderColor:'rgba(158, 15, 15, 0.85)',
      backgroundColor:'rgba(108, 6, 6, 0.85)',
      borderRadius:2,
      margin:10,
      paddingHorizontal: 200,
      paddingVertical: 10
    },
    textinbutton:{
      color:"black",
      textAlign:'center',
      fontFamily: "takoyaki"
    },
    cancelinPlay:{
      backgroundColor:"#69041a",
      borderRadius:2,
      margin:10,
      paddingHorizontal: 30,
      paddingVertical: 5
    },
    findRoom:{
      backgroundColor:"green",
      borderRadius:2,
      margin:5,
      paddingHorizontal: 20,
      paddingVertical: 5
    },
    cards: {
      height: "25%",
      width: "10%", 
    },
    modal: {
      backgroundColor: 'white',
      justifyContent: 'space-around', 
      alignItems: 'center',
      borderRadius:30,
      paddingHorizontal:30,
      paddingVertical:20
    },
    DeckBox: {
      // flexDirection: "row",
      height: "69%",
      width: "90%",
      backgroundColor: "black"
    },
    iconText: {
      paddingVertical: 15,
      paddingHorizontal: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: 'baseline',
    },
    iconUser: {
      margin: 15,
      width: 66,
      height: 58,
      alignSelf: "center",
      backgroundColor:"white",
    },
    imgForUser:{
      position:"absolute",
      justifyContent:'center',
      alignItems:'center',
      left:30
    },
    backGroundIMG:{
      position:"relative",
      backgroundColor:"rgba(169, 160, 166, 0.26)",
      marginTop:10, 
      marginBottom:10,
      borderBottomEndRadius:20,
      borderTopLeftRadius:20,
    },
    //หน้า ICON ชื่อเกม
    imageIconLOGO:{
      width:250,
      height:250,
      marginTop:20
    },
    IMGICON:{
      flex:0.5,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center'},
    //------------------
    GameName: { 
      fontSize:20, 
      color:'white',
      fontFamily: "Megloria"
  }
  });

export default Screen;