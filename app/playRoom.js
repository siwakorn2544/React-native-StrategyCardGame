import React, { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import { _receiveGameData, getCardInformation } from "./database/User";
import { database, firestore } from './database/db';

function PlayRoom({route , navigation}){
    const [_firstTime, setFirstTime] = useState(true);
    const [Player01, setPlayer01] = useState([]);
    const [Player02, setPlayer02] = useState([]);


    const _setDataGame = async (id) => {
        let player01, player02;
        const defaultGameData = await _receiveGameData(id); 
        for (let [key, values] of Object.entries(defaultGameData.players)) {
            if (key == route.params.UID){
                player01 = values
            }
            else {
                player02 = values
            }
        }
        // setPlayer01(player01);
        setPlayer02(player02);
        setPlayer01(player01);
        // await DrawCardStartGame(player01, 3);
        console.log("01:  ", Player01);
        console.log("02: ", Player02);
        return [player01, player02]
    }

    const DrawCardStartGame = async (deck, i) => {
        for (let index = 0; index < i; index++) {
                //ทำตัวแปร hand field มารับค่าบนสนาม เเล้วsetเข้าdb
                let todraw = await getCardInformation(deck.Deck[0]);
                deck.Hand.push(todraw);
                deck.Deck.shift();
            } 
            // await _asynsPlayer(route.params.UID);
            console.log(deck);
            setPlayer01(deck)
        }

    const drawCard =  async(i) => {
        console.log("Deck: ", Player01);
        // for (let index = 0; index < i; index++) {
        //     //ทำตัวแปร hand field มารับค่าบนสนาม เเล้วsetเข้าdb
        //     let todraw = await getCardInformation(Player01.Deck[0]);
        //     Player01.hand.push(todraw);
        //     Player01.deck.shift();  
        // }
        // await _asynsPlayer(route.params.UID);
    }

    

    useEffect(async () => {
        let players = await _setDataGame(route.params.roomID);
        setPlayer01(players[0])
        setPlayer02(players[1])
        await DrawCardStartGame(players[0], 3);
        
        database()
            .ref(`/PlayRoom/${route.params.roomID}/players/${players[0].UID}/Field`)
            .on('value', snapshot => {
                console.log('field 01: ', snapshot.val());
                //render ค่าใหม่
                Player01.field = snapshot.val()
        });    
        database()
            .ref(`/PlayRoom/${route.params.roomID}/players/${players[1].UID}/Field`)
            .on('value', snapshot => {
                console.log('field 02: ', snapshot.val());
                //render ค่าใหม่
                Player02.field = snapshot.val()
        });

        database()
            .ref(`/Playroom/${route.params.roomID}/players/${players[1].UID}/Hand`)
            .on('value', snapshot => {
                console.log('hand 02: ', snapshot.val());
                //render ค่าใหม่
                Player02.field = snapshot.val()
        });
    }, [])

    // const endGame = () => {
    //     navigation.navigate.dispatch
    // }

    return(
    <View>
        <Text>
           a
        </Text>
    </View>
    )
}
export default PlayRoom;