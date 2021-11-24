import React, { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet,ImageBackground, Image,TouchableOpacity} from "react-native";
import { database } from './database/db';
import Icon from 'react-native-vector-icons/AntDesign';

function MatchMaking({route, navigation}){
  const [Loading, setLoading] = useState("");
  const [findRoom, setFinding] = useState(false);
  const [myQueue, setMyQueue] = useState("");
  const [user, setUser] = useState()
  const [roomID, setRoomID] = useState("")

  const addData  = async () => {
    await database().ref(`/Queue`).child(route.params.UID).set("");
  }

  const subscibeQueue = async () => {
    
  
  
  }
  const BacktoM = async() => {
    console.log('UNSUB firebase');
    await queueDt.off();
    await Pregame.off();
    navigation.navigate("LogIn");

  }
  
  const CheckIcon = () => {
    return(
      <Icon name="check" size={35} color="rgba(255, 0, 132, 0.8)"> </Icon>
    )
  }

  const queueDt = database().ref(`/Queue/${route.params.UID}`);
        
        queueDt.on('value', snapshot => {
            //มีการเปลี่ยนค่า
            if (snapshot.val() != "" && snapshot.val() != null){
              setFinding(true);
              setLoading("Match Found")
              setRoomID(snapshot.val());
              console.log("roomID: ", snapshot.val());
            }
        });

  const Pregame = database().ref(`/PlayRoom`);
      
      Pregame.on('value', snapshot => {
        if(roomID in snapshot.val())

        setTimeout(async () => {
          
          navigation.navigate("PlayRoom", {UID: route.params.UID, roomID: roomID})
          // await database().ref(`/Queue/${route.params.UID}`).remove();
        }, 3000)
      })

  useEffect( ()=> {
    addData();
    // subscibeQueue();
    return function cleanup() {
      mounted = false
  }
  },[])

  return (

        <View style={styles.container}>
          <ImageBackground source={require('./assets/imggif/Wallpaper-Fantasy.jpg')} resizeMode="cover" style={styles.imageBG}>
          <View style={{height:"80%",width:"80%",marginHorizontal:'10%',marginVertical:'5%',alignItems:'center',justifyContent:'center'}}>
          {findRoom ? (
            <View style={styles.itemInBox}>
                <Text style={styles.TextMatchF}>{Loading} <CheckIcon/></Text>
            </View>
          ):
            <View style={styles.itemInBox}>
                <Image source={require('./assets/imggif/loading.gif')} style={styles.imgConfig}></Image>
            </View>
        }
            <TouchableOpacity
            style={styles.buttonBack}
            onPress={BacktoM}
            >
              <Text style={styles.fontConfig}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          </ImageBackground>
        </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  itemInBox:{
    alignItems:'center',
    justifyContent:'center',
    
  },
  imageBG:{
    flex:1,
  },
  TextMatchF:{
    fontSize:30,
    color:'rgba(255, 0, 132, 0.8)'
  },
  imgConfig:{
    height:150,
    width:150
  },
  buttonBack:{
    borderWidth:3,
    borderColor:'rgba(110, 0, 0, 0.9)',
    backgroundColor:'rgba(0, 0, 0, 0.9)',
    borderRadius:15,
    margin:10,
    alignItems:'center',
    justifyContent:'center',
    width:120,
    height:50
  },
    fontLoading:{
    fontSize:60,
  },
  fontConfig:{
    fontSize:25,
    fontFamily: "MEGLORIA",
    color:'white'
  }

})

export default MatchMaking;

