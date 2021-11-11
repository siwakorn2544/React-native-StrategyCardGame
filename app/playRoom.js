import React, { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import { _receiveGameData } from "./database/User";


function PlayRoom({route , navigation}){
    const [Player01, setPlayer01] = useState([]);
    const [Player02, setPlayer02] = useState([]);


    const _setDataGame = async (id) => {
        let player01, player02;
        const defaultGameData = await _receiveGameData(id); 
        for (let [key, values] of defaultGameData.players) {
            if (key == route.params.UID){
                player01 = values
            }
            else {
                player02 = values
            }
        }
        setPlayer01(player01);
        setPlayer02(player02);
    }

    const drawCard =  async(i) => {
        for (let index = 0; index < i; index++) {
            setTimeout(()=>{
                let todraw = new Monster(...Player01.deck[0]);
                Player01.hand.push(todraw);
                Player01.deck.shift();  
            }, 200 )          
        }
        await _asynsPlayer(route.params.UID);
    }

    const preparetation = async () => {
        await _setDataGame(route.params.roomID);
        await drawCard(3);
    }

    database()
        .ref(`/playroom/${route.params.roomID}/players/${Player01}/field`)
        .on('value', snapshot => {
            console.log('field: ', snapshot.val());
            //render ค่าใหม่
            Player01.field = snapshot.val()
    });

    database()
        .ref(`/playroom/${route.params.roomID}/players/${Player02}/field`)
        .on('value', snapshot => {
            console.log('field: ', snapshot.val());
            //render ค่าใหม่
            Player02.field = snapshot.val()
    });

    database()
        .ref(`/playroom/${route.params.roomID}/players/${Player02}/hand`)
        .on('value', snapshot => {
            console.log('hand: ', snapshot.val());
            //render ค่าใหม่
            Player02.field = snapshot.val()
    });

    useEffect(() => {
        preparetation()
    }, [])

    // const endGame = () => {
    //     navigation.navigate.dispatch
    // }

    return(
    <View>
        {
        Player01.map((val) => {
            return (
            <Text>
                {val}
            </Text>
            )
        })}
    </View>
    )
}
export default PlayRoom;