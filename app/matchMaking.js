import React, { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet  } from "react-native";
import { database } from './database/db';

function MatchMaking({route, navigation}){
  const [Loading, setLoading] = useState(0);
  const [findRoom, setFinding] = useState(false);
  const [myQueue, setMyQueue] = useState("");
  const [user, setUser] = useState()

  const addData  = async () => {
    await database().ref(`/Queue`).child(route.params.UID).set("");
  }

  const subscibeQueue = async () => {
    
  }

  useEffect( ()=> {
    addData();
    subscibeQueue();
  },[])

  return (
    <View style={{alignItems:"center"}}>
      <Text style={{fontSize: 60}}>{Loading}</Text>
    </View>
  )
}


export default MatchMaking;