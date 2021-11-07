import React, { useEffect, useState, useRef } from "react";
import { Button, Text, View, StyleSheet, TouchableOpacity, Image, Animated,PanResponder } from "react-native";
import Modal from "react-native-modal";
import storage from "@react-native-firebase/storage";

function DeckSelect(props){
    const [show, setShow] = useState(false);
    const [source, setSource] = useState(""); 
    const [img, setImage] = useState(""); 

    const showEnlargeImage = (src) => {
        setShow(true);
        setSource(src);
    }

    const image = async () => {
        const Card = await storage().ref(`CardLists/${props.image}`).getDownloadURL()
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
                <Image source={{uri: img}} style={styles.cardEnlarge}/>
            </View>
        </Modal>
        <TouchableOpacity onPress={showEnlargeImage}>
            <View style={{position: "absolute",  elevation: 3, right: 4, width: 20, height: 20, backgroundColor: "grey"}}>
                <Text> x{props.count}</Text>
            </View>
            <Image style={styles.card} source={{uri: (img != "") ? img : 'https://picsum.photos/800/1200.jpg'}} />
        </TouchableOpacity> 
    </View>
    )

}
const styles = StyleSheet.create({
    card: {
        width: 80,
        height: 100,
        resizeMode: 'contain'
    },
    cardEnlarge: {
        width: 260,
        height: 320,
        resizeMode: 'contain',
    },
    cardAnimate:{
        elevation: 1
    }
})
export default DeckSelect;