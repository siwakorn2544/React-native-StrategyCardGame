import React, { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet,ImageBackground} from "react-native";
import { database } from './database/db';

function MatchMaking({route, navigation}){
  const [Loading, setLoading] = useState("0");
  const [findRoom, setFinding] = useState(false);
  const [myQueue, setMyQueue] = useState("");
  const [user, setUser] = useState()
  const [roomID, setRoomID] = useState("")

  const addData  = async () => {
    await database().ref(`/Queue`).child(route.params.UID).set("");
  }

  const subscibeQueue = async () => {
    
  }

  database()
        .ref(`/Queue/${route.params.UID}`)
        .on('value', snapshot => {
            //มีการเปลี่ยนค่า
            if (snapshot.val() != "" && snapshot.val() != null){
              setLoading("Match Found!");
              setRoomID(snapshot.val());
              console.log("roomID: ", snapshot.val());
            }
    });

    database()
      .ref(`/PlayRoom`)
      .on('value', snapshot => {
        if(roomID in snapshot.val())

        setTimeout(async () => {
          navigation.navigate("PlayRoom", {UID: route.params.UID, roomID: roomID})
          await database().ref(`/Queue/${route.params.UID}`).remove();
        }, 3000)
      })

  useEffect( ()=> {
    addData();
    // subscibeQueue();
  },[])

  return (
        <ImageBackground source={require('./assets/imggif/loading2.gif')} resizeMode="center" style={styles.imageBG}>
          <View style={styles.jst_Center}>
            <Text style={styles.fontLoading}>{Loading}</Text>
            {/* <Text style={styles.fontLoading}>{Loading}</Text> */}
          </View>
        </ImageBackground>
  )
}

const styles = StyleSheet.create({
  imageBG:{
    flex:1,
  },
  jst_Center:{
    flex:1,
    alignItems:"center",
  },
  fontLoading:{
    fontSize:60,
  }
})

export default MatchMaking;