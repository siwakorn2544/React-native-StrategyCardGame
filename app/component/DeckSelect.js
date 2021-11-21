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
                props.DeleteFromDeck(props.cardId);
            }
            Animated.spring(
                pan, { toValue:{x:0, y:0},useNativeDriver: false }
            ).start();
        },
    }); //step02

    const image = async () => {
        const Card = await storage().ref(`CardLists/${props.image}`).getDownloadURL()
          .then((url) => {
            return url;
        });
        setImage(Card);
    }

    const isDropZone = (gesture) => {
        var dropzone = props.dropzone;
        console.log(gesture.moveY);
        return gesture.moveY > dropzone.height 
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
        <Animated.View 
            key={props.cardId}
            style={[pan.getLayout(), styles.cardAnimate]}
            {...panResponder.panHandlers}
        >  
        <TouchableOpacity onPress={showEnlargeImage}>
            <View style={{position: "absolute",  elevation: 3, right: 4, width: 20, height: 20, backgroundColor: "grey"}}>
                <Text> x{props.count}</Text>
            </View>
            <Image style={styles.card} source={{uri: (img != "") ? img : 'https://picsum.photos/800/1200.jpg'}} />
        </TouchableOpacity>
        </Animated.View>
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