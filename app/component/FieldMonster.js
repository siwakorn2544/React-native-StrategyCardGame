import React, { useEffect, useState, useRef } from "react";
import { Button, Text, View, StyleSheet, TouchableOpacity, Image, Animated,PanResponder } from "react-native";
import Modal from "react-native-modal";
import storage from "@react-native-firebase/storage";

export default function FieldMonster(props){
    const [img, setImage] = useState("");
    const ClassOfCards = {
        "Defender": require(`../assets/classIcons/Defender.png`),
        "Knight":require(`../assets/classIcons/Knight.png`),
        "Ranger":require(`../assets/classIcons/Ranger.png`),
        "Mage":require(`../assets/classIcons/Mage.png`),
        "Healer":require(`../assets/classIcons/Healer.png`),
        "Berserker": require(`../assets/classIcons/Berserker.png`)
    }
    
    const image = async () => {
        const Card = await storage().ref(`CardLists/${props.imgURL}`).getDownloadURL()
          .then((url) => {
            return url;
        });
        setImage(Card);
    }

    useEffect(() =>{
        image()
    },[])

    return (
    <View style={{paddingLeft: 4, height: 80}}>
        <View style={{elevation: 3}}>
            <Image source={ClassOfCards[props.Class]} style={styles.iconCard}/>
            <View style={styles.atkBox}>
                <Text style={{fontWeight:"bold"}}>{props.ATK}</Text>
            </View>
            <View style={styles.hpBox}>
                <Text style={{fontWeight:"bold"}}>{props.HP}</Text>
            </View>
        </View>
        {(props.width == 2) && <TouchableOpacity onPress={() => props.target(props.index)}>
            <View style={{borderWidth: props.width, borderColor: "green", backgroundColor: "red",
            height: 50,
            width: 54,
            marginTop: 19,
            overflow: "hidden",
            marginRight: 2,}}>
                {(img != "") && (
                <Image 
                    source={{ uri: img }}
                    style={styles.cardInField}
                />)}
            </View>
        </TouchableOpacity>}
        {(props.width == 0) && 
            <View style={styles.card}>
                {(img != "") && (
                <Image 
                    source={{ uri: img }}
                    style={styles.cardInField}
                />)}
            </View>}
        {(props.width == -1) && <TouchableOpacity onPress={() => props.target(props.index)}>
            <View style={styles.card}>
                {(img != "") && (
                <Image 
                    source={{ uri: img }}
                    style={styles.cardInField}
                />)}
            </View>
        </TouchableOpacity>}
    </View>)
}

const styles = StyleSheet.create({
    cardInField: {
        height: 120,
        width: 70,
        top: -15,
        left: -8.5
    },
    card: {
        backgroundColor: "red",
        height: 50,
        width: 54,
        marginTop: 19,
        overflow: "hidden",
        marginRight: 2,
    },
    iconCard: {
        resizeMode: "contain",
        width: 20,
        height: 20,
        position: "absolute",
        top: 8,
        right: 18
    },
    atkBox: {
        position: "absolute",
        top: 60,
        left: -1,
        height: 20, 
        width: 20, 
        borderRadius: 100,
        backgroundColor: "blue", 
        alignItems: "center", 
        paddingTop: 1
    },
    hpBox: {
        position: "absolute",
        top: 60,
        right: 1,
        height: 20, 
        width: 20, 
        borderRadius: 100,
        backgroundColor: "red", 
        alignItems: "center", 
        paddingTop: 1
    }
})