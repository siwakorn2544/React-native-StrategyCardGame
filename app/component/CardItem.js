import React, { useEffect, useState, useRef } from "react";
import { Button, Text, View, StyleSheet, TouchableOpacity, Image, Animated,PanResponder } from "react-native";
import Modal from "react-native-modal";
import storage from "@react-native-firebase/storage";

function CardItem(props){
    const [source, setSource] = useState(""); 
    const [img, setImage] = useState(""); 

    const pan = useRef(new Animated.ValueXY()).current; //step01
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (dy, dx) => true,
        onPanResponderGrant: () => {
            pan.setOffset({ x: pan.x._value, y: pan.y._value});
            pan.setValue({x:0, y:0});
        },
        onPanResponderMove: Animated.event([null, {dx: pan.x, dy:pan.y}],{useNativeDriver: false}),
        onPanResponderRelease: (e, gesture) => {
            if (isDropZone(gesture)){
                props.addCardToDeck(props.cardId);
            }
            Animated.spring(
                pan, { toValue:{x:0, y:0},useNativeDriver: false }
            ).start();
        },
    }); //step02

    const isDropZone = (gesture) => {
        var dropzone = props.dropzone;
        console.log(gesture.moveY);
        return gesture.moveY < dropzone.height+20 
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
        <Animated.View 
            key={props.cardId}
            style={[pan.getLayout(), styles.cardAnimate]}
            {...panResponder.panHandlers}
        >    
            <Image style={styles.card} source={{uri: (img != "") ? img : 'https://picsum.photos/800/1200.jpg'}} />
        </Animated.View>
    </View>
    )

}
const styles = StyleSheet.create({
    card: {
        width: 110,
        height: 150,
        resizeMode: 'contain',
        margin: 8
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
export default CardItem;