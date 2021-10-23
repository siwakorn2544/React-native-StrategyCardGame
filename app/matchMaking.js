import React, { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import { database } from './database/db';

function MatchMaking({route, navigation}){
  const [Loading, setLoading] = useState(0);
  const [findRoom, setFinding] = useState(false);
  const [myQueue, setMyQueue] = useState("");
  const [user, setUser] = useState()

  async function checkQueue(UID){
    let queue = [];
    await database()
      .ref('/Queue')
      .once('value')
      .then(snapshot => {
        queue = snapshot.val();
    });
    if((queue["user_01"] != "not player" && queue["user_02"] != "not player") && queue.QueueID == myQueue){
      setFinding(true);
      await database().ref(`/Queue`).update({
        QueueID: '_' + Math.random().toString(36).substr(2, 9),
        user_01: "not player",
        user_02: "not player"
      });
      setTimeout( () =>
        navigation.navigate("PlayRoom")
      , 3000)
    }
    else {
      addToQueue(UID, queue)
    }
  }

  async function addToQueue(UID, Queue){
      try {
        if(Queue["user_01"] == "not player" && Queue["user_02"] != UID){
          await database().ref(`/Queue`).update({user_01:UID});
          console.log('Add User 01')
        }
        else if(Queue["user_02"] == "not player" && Queue["user_01"] != UID){
          await database().ref(`/Queue`).update({user_02:UID});
          console.log('Add User 02')
        }
        setMyQueue(Queue.QueueID);
      } catch (err) {
          console.log('Add fail:  '+err);
      }
  }

  useEffect(()=>{
    if (Loading >= 5){
      checkQueue(route.params.UID);
    }

    let interval = null
    if (!findRoom){
      interval = setInterval(
        () => {
            setLoading(Loading => Loading+1);
        }
      , 1000);
    }
    if (findRoom && Loading != 0){
      setLoading(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);  
  },
  [Loading, findRoom])

  return (
    <View style={{alignItems:"center"}}>
      {findRoom && <Text style={{fontSize: 60}}>Match Found!!</Text>}
      { !findRoom && <Text style={{fontSize: 60}}>{Loading}</Text>}
    </View>
  )
}


export default MatchMaking;