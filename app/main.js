// import React, { useState, useEffect } from 'react';
// import { database } from './database/db';
// import { Button, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// function Screen({navigation}) {
//     const [Deck, setDeck] = useState([]);
//     const [Name, setName] = useState("")
//     const [UID, setUID] = useState("");

    // const _retrieveData = async () => {
    //   try {
    //     const value = await AsyncStorage.getItem('logIn_User');
    //     setUID(value)

import React, { useState, useEffect} from 'react';
import {_receiveDeckData, _receiveName} from './database/User'
import { Button, SafeAreaView, StyleSheet, Text, View, Image, Alert } from 'react-native';
import Modal from "react-native-modal";
import _Deck from './class/Deck';

function Screen({route , navigation}) {
    const [myDeck, setDeck] = useState([]);
    const [Name, setName] = useState("");
    const [UID, setUID] = useState("");
    const [cardChecking, setCardChecking] = useState(0);
    const [matchMaking, setMatchMaking] = useState(false);
    const [finding, setFinding] = useState(false);

    const _retrieveData = async () => {
      try {
        //GET DATA
        const value = route.params.UID;
        const name = await _receiveName(value);
        const deck = await _receiveDeckData(value);
        //SET DATA
        setUID(value);
        setName(name);
        setDeck(deck);
      } catch (error) {
        // Error retrieving data
        console.log('error')
      }
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
        , 1000);
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
        <View>
        {/* popup หลังกด PLAY (หน้าหมุนโหลดรอผู้เล่น -> ค้นหาเจอเเล้ว -> ส่งไปหน้าเล่น) */}
          <Text>
            User-{Name}: {UID}
          </Text>
          <Button title='PLAY' onPress= { () => {setMatchMaking(true); setFinding(false);} }/>
          <Button title='DECK' onPress={ () => navigation.navigate('Deck')}/>
          <Button title='EXIT' onPress= { () => navigation.navigate('LogIn')}/>
        <Modal
          isVisible={matchMaking}
        >
          <View style={styles.modal}>
            <Text>Data Checking</Text>
              { !finding &&
                <View style={styles.iconText}>
                  <Text>Deck card</Text>
                <Text>[ {cardChecking} /40]</Text>
                {/* ทำเพิ่มเปลี่ยน Text เป็น icon X O */ }
                  { (cardChecking != _Deck.maxDeck()) && <Text> X </Text>} 
                  { (cardChecking == _Deck.maxDeck()) && <Text> O </Text>} 
                </View>
              }
            <View style={{flexDirection: "row"}}>
              <Button title="cancal" onPress={ () => setMatchMaking(false)} />
              {(cardChecking == _Deck.maxDeck()) &&
              <Button title="Find Room" onPress={ 
                () => navigation.navigate("MatchMaking", {
                  UID: UID,
                })
                } 
              />}
            </View>
          </View>
        </Modal>
        </View>      
      
    );
}

const styles = StyleSheet.create({
  cards: {
    height: "25%",
    width: "10%", 
  },
  modal: {
    flex: 1, 
    backgroundColor: 'white',
    justifyContent: 'space-around', 
    alignItems: 'center' 
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
  }
})

export default Screen;

    // useEffect(() => {
    //   _retrieveData();
    // }, [])
  
    // return (
    //   <SafeAreaView style={styles.container} >
    //       <Text>
    //         {UID}
    //       </Text>
    //         <View style={styles.viewbutton}>
    //           <TouchableOpacity style={styles.buttonPlay}
    //           // onPress={() => navigation.navigate('Play')}
    //           > 
    //           <Text style={styles.textinbutton}> Play </Text> 
    //           </TouchableOpacity>
    //           <TouchableOpacity style={styles.buttonDeck}
    //           onPress={() => navigation.navigate('Deck')}> 
    //           <Text style={styles.textinbutton}> Deck </Text> 
    //           </TouchableOpacity>
    //           <TouchableOpacity style={styles.buttonExit}
    //            onPress={() => navigation.navigate('LogIn')}> 
    //           <Text style={styles.textinbutton}> Exit </Text> 
    //           </TouchableOpacity>
    //         </View> 
    //   </SafeAreaView>
    // );
// }


// const styles = StyleSheet.create({
//   // SafeAreaView
//   container: {
//     flex: 1,
//     backgroundColor:"white"
//   },
//     viewbutton:{
//       flex:1,
//       alignItems: 'center',
//       justifyContent: 'center'
//     },
//     // ปุ่ม Play
//     buttonPlay:{
//       borderWidth:3,
//       borderColor:'#0086f5',
//       backgroundColor:'#4286f5',
//       borderRadius:2,
//       margin:10,
//       paddingHorizontal: 30,
//       paddingVertical: 5
//     },
//     // ปุ่ม Deck 
//     buttonDeck:{
//       borderWidth:3,
//       borderColor:'#40D60E',
//       backgroundColor:'#84D60E',
//       borderRadius:2,
//       margin:10,
//       paddingHorizontal: 30,
//       paddingVertical: 5
//     },
//     // ปุ่ม Exit 
//     buttonExit:{
//       borderWidth:3,
//       borderColor:'#A00E0E',
//       backgroundColor:'#D60E0E',
//       borderRadius:2,
//       margin:10,
//       paddingHorizontal: 30,
//       paddingVertical: 5
//     },
//     textinbutton:{
//       color:"black",
//       fontWeight:'bold',
//       textAlign:'center'
//     }

//     useEffect(() => {
//       let interval = null;
//       if (matchMaking) {
//         interval = setInterval(
//             () => {
//                 setCardChecking(cardChecking => cardChecking+1);
//             }
//         , 1000);
//     } else if (!matchMaking && cardChecking !== 0) {
//         clearInterval(interval);
//         setCardChecking(0);
//     }

//     if (cardChecking == myDeck.length){
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//     }, [matchMaking, cardChecking])
  
//     return ( 
//         <View>
//         {/* popup หลังกด PLAY (หน้าหมุนโหลดรอผู้เล่น -> ค้นหาเจอเเล้ว -> ส่งไปหน้าเล่น) */}
//           <Text>
//             User-{Name}: {UID}
//           </Text>
//           <Button title='PLAY' onPress= { () => {setMatchMaking(true); setFinding(false);} }/>
//           <Button title='DECK' onPress={ () => navigation.navigate('Deck')}/>
//           <Button title='EXIT' onPress= { () => navigation.navigate('LogIn')}/>
//         <Modal
//           isVisible={matchMaking}
//         >
//           <View style={styles.modal}>
//             <Text>Data Checking</Text>
//               { !finding &&
//                 <View style={styles.iconText}>
//                   <Text>Deck card</Text>
//                 <Text>[ {cardChecking} /40]</Text>
//                   { (cardChecking != _Deck.maxDeck()) && <Text> X </Text>} 
//                   { (cardChecking == _Deck.maxDeck()) && <Text> O </Text>} 
//                 </View>
//               }
//               {
//                 finding && 
//                 <Text>ไอคอนหมุนๆๆจนกว่าจะเจอคน</Text>
//               }
//             <View style={{flexDirection: "row"}}>
//               <Button title="cancal" onPress={ () => setMatchMaking(false)} />
//               {(cardChecking == 6) &&
//               <Button title="Find Room" onPress={ 
//                 () => navigation.navigate("MatchMaking", {
//                   UID: UID,
//                 })
//                 } 
//               />}
//             </View>
//           </View>
//         </Modal>
//         </View>      
      
//     );
// }

// const styles = StyleSheet.create({
//   cards: {
//     height: "25%",
//     width: "10%", 
//   },
//   modal: {
//     flex: 1, 
//     backgroundColor: 'white',
//     justifyContent: 'space-around', 
//     alignItems: 'center' 
//   },
//   DeckBox: {
//     // flexDirection: "row",
//     height: "69%",
//     width: "90%",
//     backgroundColor: "black"
//   },
//   iconText: {
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: 'baseline',
//   }
// })

// export default Screen;
