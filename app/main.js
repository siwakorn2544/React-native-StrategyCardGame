import React, { useState, useEffect} from 'react';
import {_receiveDeckData, _receiveName} from './database/User'
import { Button, SafeAreaView, StyleSheet, Text, View, Image, ImageBackground, Alert ,TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import _Deck from './class/Deck';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome5'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon4 from 'react-native-vector-icons/MaterialIcons'

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
        const deck = await _receiveDeckData(value);
        //SET DATA
        setUID(value);
        setName(name);
        setDeck(deck);
        setImg(image);
        
        // console.log(image, name, deck);
      } catch (error) {
        // Error retrieving data
        console.log('error')
      }
      
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
    }, [])
  
    useEffect(() => {
      let interval = null;
      if (matchMaking) {
        interval = setInterval(
            () => {
                setCardChecking(cardChecking => cardChecking+1);
            }
        , 20);
    } else if (!matchMaking && cardChecking !== 0) {
        clearInterval(interval);
        setCardChecking(0);
    }

    if (cardChecking == myDeck.length){
      clearInterval(interval);
    }
    return () => clearInterval(interval);
    }, [matchMaking, cardChecking])
  
    return ( 
        <View style={{flex:1}}>
          <ImageBackground source={require('./assets/imggif/2.gif')} resizeMode="cover" style={styles.imageBG}>
            <View style={{position:"absolute",justifyContent:'center',alignItems:'center',left:30}}>
                <View style={{position:"relative", backgroundColor:"black", borderRadius: 10, width: 90, height: 85}}>
                      <Image source={{uri:(imgUrl != "") ? imgUrl : 'https://picsum.photos/800/1200.jpg'}} style={styles.iconUser}/>
                </View>
                <View style={{position:"relative"}}>
                  <Text> {Name} </Text>
                </View>
            </View>
            <View style={{flex:0.5,flexDirection:'row', justifyContent:'center',alignItems:'center',backgroundColor:'rgba(84, 0, 0, 0.5)'}}>
              <Text style={styles.GameName}>Defender of the Legends</Text>
            </View>

        <View style={styles.viewbutton}>
          <View>
              <TouchableOpacity style={styles.buttonPlay}
              onPress= { () => {setMatchMaking(true); setFinding(false);} }
              > 
              
              <Text style={styles.textinbutton}><MyFicon/>Play</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonDeck}
              onPress={() => navigation.navigate('DeckC', {UID: UID ,DECK: myDeck})}> 
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
              <TouchableOpacity style={styles.cancelinPlay} onPress={ () => setMatchMaking(false)}>
                 <Text style={{color:"white"}}> cancal </Text>
              </TouchableOpacity>
              {(cardChecking >= _Deck.maxDeck()) &&
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
  // SafeAreaView
  // container: {
  //   flex: 1,
  //   backgroundColor:"white"
  // },
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
      borderColor:'#0086f5',
      backgroundColor:'#4286f5',
      borderRadius:2,
      margin:10,
      paddingHorizontal: 200,
      paddingVertical: 10,
    },
    // ปุ่ม Deck 
    buttonDeck:{
      borderWidth:3,
      borderColor:'#40D60E',
      backgroundColor:'#84D60E',
      borderRadius:2,
      margin:10,
      paddingHorizontal: 200,
      paddingVertical: 10
    },
    // ปุ่ม Exit 
    buttonExit:{
      borderWidth:3,
      borderColor:'#A00E0E',
      backgroundColor:'#D60E0E',
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
    GameName: { 
      fontSize:20, 
      color:'white',
      fontFamily: "Megloria"
  }
  });

export default Screen;