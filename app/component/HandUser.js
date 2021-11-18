import React, { useEffect, useState } from "react";
import { database, firestore } from '../database/db';
import { Button, Text, View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import storage from "@react-native-firebase/storage";
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Entypo';

export default function MyHand(props) {
    const [img, setImage] = useState("");
    const [show, setShow] = useState(false);
    const [summon, setSummon] = useState(false);
    const [selectClass, setSelectClass] = useState(false);

    const ClassOfCards = {
        "Defender": require(`../assets/classIcons/Defender.png`),
        "Knight":require(`../assets/classIcons/Knight.png`),
        "Ranger":require(`../assets/classIcons/Ranger.png`),
        "Mage":require(`../assets/classIcons/Mage.png`),
        "Healer":require(`../assets/classIcons/Healer.png`),
        "Berserker": require(`../assets/classIcons/Berserker.png`)
    }

    const summonFunction = () => {
        if (!summon) {
            setSummon(!summon);
        }
        else if (summon){
            setSelectClass(true);
            setShow(true)
            setSummon(!summon);
        }
    }

    const image = async () => {
        const Card = await storage().ref(`CardLists/${props.id}`).getDownloadURL()
          .then((url) => {
            return url;
        });
        setImage(Card);
    }

    useEffect(() =>{
        // console.log(props.Class)
         image()
    },[])

    return (
        <View style={{flex: 1}}>
            <Modal style={{alignItems: "center"}} isVisible={show} onBackdropPress={() => setShow(false)}>
                <View style={{flexDirection: "row", flex: 1}}>
                    <View style={styles.viewSelectClass}>
                        <Image source={ClassOfCards[props.Class[0]]} style={styles.IconSelectClass}/>
                        <Button 
                            title="►SELECT◄" 
                            color="#B91646"
                            onPress={() => {props.summonUnit(props.Class[0],props.id,props.index); setShow(false);}}
                        />
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <Icon name="arrow-bold-left" size={60} color="blue" style={{marginTop: 75}}/>
                        <Image source={(img != "") ? { uri: img } : require("../assets/backCard.jpg")} 
                            style={styles.cardEnlarge}
                        />
                        <Icon name="arrow-bold-right" size={60} color="red" style={{marginTop: 75}}/>
                    </View>
                    <View style={styles.viewSelectClass}>
                        <Image source={ClassOfCards[props.Class[1]]} style={styles.IconSelectClass}/>
                        <Button 
                            title="►SELECT◄" 
                            color="#B91646"
                            onPress={() => {props.summonUnit(props.Class[1],props.id,props.index); setShow(false);}}
                        />
                    </View>
                </View>
            </Modal>
            <View>
            <TouchableOpacity onLongPress={() => {setShow(true)}} onPress={summonFunction}>
                {(summon) && <Icon name="flag" size={30} color="red" style={{
                        alignSelf: "center", position: "absolute",
                        left: 10,
                        top: 10,
                        elevation: 3
                    }}
                />} 
                <Image source={(img != "") ? { uri: img } : require("../assets/backCard.jpg") } 
                    style={styles.cardInHand}
                />
            </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardInHand: {
        resizeMode: "contain",
        height: 65,
        width: 45
    },
    cardEnlarge: {
        width: 200,
        height: 260,
        resizeMode: 'contain',
    },
    Class: {
        width: 100,
        height: 100,
        resizeMode: "contain"
    },
    IconSelectClass: {
        height: 80,
        width: 80,
        marginBottom: 8
    },
    viewSelectClass: {
        alignItems: "center",
        paddingTop: 60,
        marginHorizontal: 10,
    }
});