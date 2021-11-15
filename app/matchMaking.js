import React, { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet  } from "react-native";
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
            if (snapshot.val() != ""){
              setLoading("Match Found!");
              setRoomID(snapshot.val());
              console.log("roomID: ", snapshot.val());
            }
    });

    database()
      .ref(`/PlayRoom`)
      .on('value', snapshot => {
        if(roomID in snapshot.val())
          


        setTimeout(() => {
          navigation.navigate("PlayRoom", {UID: route.params.UID, roomID: roomID})
        }, 3000)
      })

  useEffect( ()=> {
    addData();
    // subscibeQueue();
  },[])

  return (
    <View style={{alignItems:"center"}}>
      <Text style={{fontSize: 60}}>{Loading}</Text>
    </View>
  )
}


export default MatchMaking;