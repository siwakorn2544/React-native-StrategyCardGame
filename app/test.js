import React, { useState } from "react";
import { Button, Text, View, TouchableOpacity, FlatList, Image, StyleSheet, ImageBackground } from "react-native";
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Entypo';
import MyHand from "./component/HandUser"
import FieldMonster from "./component/FieldMonster"

function Testing() {
  const MaxMana = 6;
  const Mana = 3;
  const HP_1 = 20;
  const HP_2 = 20;
  const handEnemy_Data = [
    {imgURL: "0001.jpg"},
    {imgURL: "0002.jpg"},
    {imgURL: "0003.jpg"},
    {imgURL: "0004.jpg"},
    {imgURL: "0005.jpg"},
    {imgURL: "0006.jpg"},
  ]
  const myHand_Data = [
    {imgURL: "0001.jpg"},
    {imgURL: "0002.jpg"},
    {imgURL: "0003.jpg"},
  ]

  const EnemyUnit = [
    {imgURL: "0001.jpg", class: "Knight", atk: 5, hp: 10 },
    {imgURL: "0002.jpg", class: "Defender", atk: 5, hp: 10 },
    {imgURL: "0003.jpg", class: "Mage", atk: 5, hp: 10 },
    {imgURL: "0002.jpg", class: "Mage", atk: 5, hp: 10 },
    
  ]

  const myUnit = [
    {imgURL: "0010.jpg", class: "Knight", atk: 5, hp: 10 },
    {imgURL: "0012.jpg", class: "Knight", atk: 5, hp: 10 },
    {imgURL: "0013.jpg", class: "Knight", atk: 5, hp: 10 },    
  ]

  const fieldEnemy = (data) => {
    return (<FieldMonster ATK={data.item.atk} HP={data.item.hp} Class={data.item.class} imgURL= {data.item.imgURL} />)
    // return (<Image source={require("./assets/backCard.jpg")} style={styles.cardInField}/>)
  }

  const fieldUser = (data) => {
    return (<FieldMonster ATK={data.item.atk} HP={data.item.hp} Class={data.item.class} imgURL= {data.item.imgURL} />)
    // return (<Image source={require("./assets/backCard.jpg")} style={styles.cardInField}/>)
  }

  const handEnemy = (data) => {
    return (<Image source={require("./assets/backCard.jpg")} style={styles.cardInHand}/>)
  }

  const myHand = (data) => {
    return (<MyHand id={data.item.imgURL} />)
  }

  const MaxManaGem = () => {
    let components = []
    for (let i = 1; i < MaxMana+1; i++) {
      if (i > Mana){
        components.push(<Image source={require("./assets/mana(use).png")}  style = { styles.mana } />)
      }
      else if (i <= Mana){
        components.push(<Image source={require("./assets/mana.png")} style = { styles.mana }/>)
      }
    }
    return (components.map((value) => {return value}));
  }

  return (
      <ImageBackground source={require("./assets/bg.jpg")} resizeMode="cover" style={styles.background}>
      <View style={{ flex: 1 , flexDirection: "row"}}>
        <View style={{flexDirection: "row", flex: 0.25}}>
          <View style={{ marginLeft:10, marginVertical: 10}}>
            <View style={{height: "15%", width: 60, marginBottom: 15, paddingLeft: 5 ,alignItems: "center"}}>
              <Icon name="menu" size={50} color="white"/> 
            </View>
            <View style={{ width: 60, height: "70%"}}>
              <View style={styles.manaBarGem}>
                <MaxManaGem/>
              </View>
              <View style={styles.manaBarText}>
                  <Text style={ {fontWeight: "bold", fontSize: 20, color:"white"}}>{ Mana + " / "+ MaxMana}</Text>
              </View>
            </View>
          </View>
          <View style={{justifyContent: "space-between", margin: 10}}>
            <View style={{height: "25%", width: 80}}>
              <ImageBackground source={require("./assets/UserProfile.png")} resizeMode="cover" style={styles.user}>
                  <View style={styles.NameTagBox}>
                    <Text style={styles.NameTag}>SirNine</Text>
                  </View>
                  <Text style={styles.lifepoint}>{HP_2}</Text>
              </ImageBackground>
            </View>
            <View style={{height: "25%", width: 80}}>
              <ImageBackground source={require("./assets/UserProfile.png")} resizeMode="cover" style={styles.user}>
                <View style={styles.NameTagBox}>
                  <Text style={styles.NameTag}>GodInwZa</Text>
                </View> 
                  <Text style={styles.lifepoint}>{HP_2}</Text>
              </ImageBackground>
            </View>
          </View>
        </View>
        <View style={{flex: 0.5, justifyContent: "space-between"}}>    
          <View style={{height: "20%",marginHorizontal: 30, alignItems: "center"}}>
              <FlatList
                data={handEnemy_Data}
                renderItem={handEnemy}
                numColumns={6}
                style={styles.handStyle}
              />
          </View>
          <View style={{height: "55%"}}>
            <View style={{height: "50%", alignItems: "center"}}>
              <ImageBackground source={require("./assets/battlezone.png")} 
                resizeMode="cover" 
                style={{
                  resizeMode: "contain",
                  height: 90,
                  width: 300,
                  alignItems: (EnemyUnit.length % 2 == 0) ? "flex-start": "center"
              }}>
                <FlatList
                  data={EnemyUnit}
                  renderItem={fieldEnemy}
                  numColumns={5}
                />
              </ImageBackground>
            </View>
            <View style={{height: "50%", alignItems: "center"}}>
              <ImageBackground source={require("./assets/battlezone.png")} 
                resizeMode="cover" 
                style={{
                  resizeMode: "contain",
                  height: 90,
                  width: 300,
                  alignItems: (myUnit.length % 2 == 0) ? "flex-start": "center"
              }}>
                <FlatList
                  data={myUnit}
                  renderItem={fieldUser}
                  numColumns={5}
                />
              </ImageBackground>
            </View>
          </View>
          <View style={{height: "20%",marginHorizontal: 30, alignItems: "center"}}>
              <FlatList
                data={myHand_Data}
                renderItem={myHand}
                numColumns={6}
                style={styles.handStyle}
              />
          </View>
        </View>
        <View style={{flex: 0.25, justifyContent: "space-between"}}>
          <View style={{height: "25%", width: 80, marginVertical: 10, marginLeft: 40}}>
              <Image source={require("./assets/backCard.jpg")} 
                    style={styles.deckCard}
              />
            </View>
            <View style={{height: 100, width: 100, borderRadius: 100, marginLeft: 30 ,backgroundColor: "white"}}>
              <TouchableOpacity style={{height: 100, width: 100, borderRadius: 100,backgroundColor: "black", alignItems: "center", paddingTop: "40%"}}>
                  <Text style={{color: "white", fontWeight: "bold"}}>เจอได้ไอ้สัส</Text>
              </TouchableOpacity>
            </View>
          <View style={{height: "25%", width: 80, marginVertical: 10, marginLeft: 40}}>
              <Image source={require("./assets/backCard.jpg")} 
                    style={styles.deckCard}
              />
          </View>
        </View>

      </View>
      </ImageBackground>
    );
  }

const styles = StyleSheet.create({
  mana: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  manaBarGem: {
    alignItems:"center",
    height: "82%",
    flexDirection: "column-reverse"
  },
  manaBarText: {
    alignItems:"center",
    paddingTop: 10
  },
  user: {
    flex: 1,
    justifyContent: "center"
  },
  lifepoint: {
    position: "absolute",
    left: 56,
    top: 59,
    fontWeight: "bold",
    fontSize: 16,
    color: "red"
  },
  NameTag: {
    fontWeight: "bold",
    fontSize: 12,
    color: "black" 
  },
  NameTagBox: {
    top: 30,
    width: 52,
    height: 21,
    paddingTop: 2,
    paddingLeft: 2
  },
  handStyle: {
    flex: 1,
    flexDirection: "row",
  },
  cardInHand: {
    resizeMode: "contain",
    height: 65,
    width: 45
  },
  deckCard: {
    resizeMode: "contain",
    height: 95,
    width: 75
  },
  background: {
    flex: 1
  }
})

export default Testing;