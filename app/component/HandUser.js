import React, { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import storage from "@react-native-firebase/storage";
import Modal from "react-native-modal";

export default function MyHand(props) {
    const [img, setImage] = useState("");
    const [show, setShow] = useState(false);

    const image = async () => {
        const Card = await storage().ref(`CardLists/${props.id}`).getDownloadURL()
          .then((url) => {
            return url;
        });
        setImage(Card);
    }

    useEffect(() =>{
         image()
    },[])

    return (
        <View>
            <Modal style={{alignItems: "center"}} isVisible={show} onBackdropPress={() => setShow(false)}>
                <View style={{flexDirection: "row"}}>
                    <Image source={(img != "") ? { uri: img } : require("../assets/backCard.jpg")} 
                        style={styles.cardEnlarge}
                    />
                </View>
            </Modal>
            <View>
            <TouchableOpacity onLongPress={() => {setShow(true)}}>
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
        width: 260,
        height: 320,
        resizeMode: 'contain',
    }
});