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
        DrawCardStartGame(player01, 3);
        console.log("01:  ", player01);
        console.log("02: ", player02);
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

    // database()
    //     .ref(`/playroom/${route.params.roomID}/players/${Player01.UID}/field`)
    //     .on('value', snapshot => {
    //         console.log('field: ', snapshot.val());
    //         //render ค่าใหม่
    //         Player01.field = snapshot.val()
    // });

    // database()
    //     .ref(`/playroom/${route.params.roomID}/players/${Player02.UID}/field`)
    //     .on('value', snapshot => {
    //         console.log('field: ', snapshot.val());
    //         //render ค่าใหม่
    //         Player02.field = snapshot.val()
    // });

    // database()
    //     .ref(`/playroom/${route.params.roomID}/players/${Player02.UID}/hand`)
    //     .on('value', snapshot => {
    //         console.log('hand: ', snapshot.val());
    //         //render ค่าใหม่
    //         Player02.field = snapshot.val()
    // });

    useEffect(() => {
        _setDataGame(route.params.roomID);

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