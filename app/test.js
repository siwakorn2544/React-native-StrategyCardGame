import React, { useState, useRef, useEffect } from "react";
import { database, firestore } from './database/db';
import { getCardInformation } from './database/User';
import { Button, Text, View, TouchableOpacity, FlatList, Image, StyleSheet, ImageBackground, Animated,PanResponder } from "react-native";
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Entypo';
import MyHand from "./component/HandUser"
import FieldMonster from "./component/FieldMonster"
import {_setFieldUnit} from './database/User'

function Testing() {
  const MaxMana = 6;
  const [Mana,setMana] = useState(3);
  const HP_1 = 20;
  const HP_2 = 20;
  const parse = 1;
  const [Deck, setDeck] = useState([["0001.jpg",["Defender","Knight"],[5,7],[10,5]]])

  const pan = useRef(new Animated.ValueXY()).current; //step01
  const maxVal = -50;
  
  const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gesture) => {
          const newVal =  (gesture.dx < maxVal) ? maxVal : ((gesture.dx > 0) ? 0 : gesture.dx);
          pan.setValue({x: newVal, y: 0 });
        },
        onPanResponderRelease: (e, gesture) => {
            drawCard();
            // Animated.spring(
            //     pan, { toValue:{x:0, y:0}, useNativeDriver: false }
            // ).start();
        },
    }); //step02

  

  const handEnemy_Data = [
    {imgURL: "0001.jpg"},
    {imgURL: "0002.jpg"},
    {imgURL: "0003.jpg"},
    {imgURL: "0004.jpg"},
    {imgURL: "0005.jpg"},
    {imgURL: "0006.jpg"},
  ]
  const [myHand_Data, setmyHand] = useState([
    {imgURL: "0001.jpg", class: ["Defender", "Knight"]},
    {imgURL: "0002.jpg", class: ["Ranger", "Mage"]}, 
    {imgURL: "0003.jpg", class: ["Knight", "Ranger"]},
  ])

  const [EnemyUnit,setEnemyUnit] = useState([
    {imgURL: "0001.jpg", class: "Knight", atk: 5, hp: 10 },
    {imgURL: "0002.jpg", class: "Defender", atk: 5, hp: 10 },
    {imgURL: "0003.jpg", class: "Mage", atk: 5, hp: 10 },
    {imgURL: "0002.jpg", class: "Mage", atk: 5, hp: 10 }, 
  ])

  const [myUnit,setmyUnit] = useState([
    {imgURL: "0010.jpg", class: "Knight", atk: 5, hp: 1, canAttack: 1 },
    {imgURL: "0012.jpg", class: "Healer", atk: 5, hp: 1, canAttack: 1 },
    {imgURL: "0013.jpg", class: "Mage", atk: 5, hp: 1, canAttack: 1 },    
    {imgURL: "0013.jpg", class: "Defender", atk: 5, hp: 1, canAttack: 1 },    
  ])

  const [Attacking, setAttacking] = useState(null);
  const [selectedfield, setFieldColor] = useState([0,0,0,0,0]);
  const [MageAttacking, setMageAttacking] = useState([]);
  
  const [Phase, setPhase] = useState(1);
  const [Turn, setTurn] = useState(null);

  const drawCard = () => {
    let newdeck = Deck;
    let toDraw = Deck[0];
    console.log(toDraw)
    setmyHand([...myHand_Data, {imgURL: toDraw[0], class: toDraw[1]}])
    newdeck.shift();
    setDeck(newdeck)
  }

  const fieldEnemy = (data) => {
    return (<FieldMonster index={data.index} target={targetAttack} width={selectedfield[data.index]} ATK={data.item.atk} HP={data.item.hp} Class={data.item.class} imgURL= {data.item.imgURL} />)
    // return (<Image source={require("./assets/backCard.jpg")} style={styles.cardInField}/>)
  }

  const fieldUser = (data) => {
    return (<FieldMonster index={data.index} target={handleFieldAction} width={-1} ATK={data.item.atk} HP={data.item.hp} Class={data.item.class} imgURL= {data.item.imgURL} />)
    // return (<Image source={require("./assets/backCard.jpg")} style={styles.cardInField}/>)
  }

  const handEnemy = (data) => {
    return (<Image source={require("./assets/backCard.jpg")} style={styles.cardInHand}/>)
  }

  const myHand = (data) => {
    return (<MyHand id={data.item.imgURL} Class={data.item.class} index={data.index} summonUnit = {async (classSelect,img,index) => {
      console.log("TEST")
      let newUnit = {imgURL: img, class: classSelect, atk: 5, hp: 10, canAttack: 1};
      setmyUnit([...myUnit, newUnit])
      let newHand = myHand_Data;
      newHand.splice(index,1)
      setmyHand([...newHand])
      try{
        await database().ref(`/Test/myUnit`).set([...myUnit, newUnit]);
        await database().ref(`/Test/myhand`).set([...newHand]);
      }catch(e){console.log(e)}
    }}/>)
  }

  const MaxManaGem = () => {
    let components = []
    for (let i = 1; i < MaxMana+1; i++) {
      if (i > Mana){
        components.push(<Image source={require("./assets/mana(use).png")}  style = { styles.mana } key = {"mana-"+i} />)
      }
      else if (i <= Mana){
        components.push(<Image source={require("./assets/mana.png")} style = { styles.mana } key = {"mana-"+i}/>)
      }
    }
    return (components.map((value) => {return value}));
  }

  const handleFieldAction = (index) => {
    // console.log(index)
    if(myUnit[index]){
      if(Phase == 1){
        useSkill(index, myUnit[index].class);
      }
      else if(Phase == 2 && myUnit[index].canAttack >= 1){
        var isHaveDefender = EnemyUnit.some((u) => u.class == "Defender");
        var newColorfield = [0,0,0,0,0];
        for (let i = 0; i < EnemyUnit.length; i++) {
          if((!isHaveDefender || EnemyUnit[i].class  == "Defender") || myUnit[index].class == "Ranger"){
            newColorfield[i] = 2;
          }
        }
        setFieldColor(newColorfield);
        setAttacking(index);
      }
    }
  }

  const targetAttack = (index) => {
    if(Phase == 2 && Attacking != null){
      Attack(Attacking, index);
    }
  }

  const Attack = (index1, index2) => {
    if(Phase == 2){
        let enemyUnit = EnemyUnit;
        if(MageAttacking.indexOf(index1) != -1){
          for (let i = 0; i < enemyUnit.length; i++) {
            enemyUnit[i].hp -= myUnit[index1].atk;
          }
          setMageAttacking(MageAttacking.filter((i) => i == MageAttacking.indexOf(index1)))
        }else{
          enemyUnit[index2].hp -= myUnit[index1].atk;
        }
        myUnit[index1].canAttack -= 1;
        setFieldColor([0,0,0,0,0]);
        setEnemyUnit[enemyUnit]
        updateField();
    }
  }

  async function updateField(){
    const enemyUnit = EnemyUnit.filter(checkdeath);
    const MyUnit = myUnit.filter(checkdeath);
    setEnemyUnit(enemyUnit); setmyUnit(MyUnit);
    await _setFieldUnit(enemyUnit, MyUnit)
  }

  const checkdeath = (item) => {
      return item.hp > 0;
  }

  const useSkill = async (index, Class) => {
    let updatedUnit = myUnit;
    if(Class == "Knight" && Mana >= 1){
      updatedUnit[index].canAttack++; setMana(Mana-1);
    }
    else if(Class == "Healer" && Mana >= 2){
      for (let i = 0; i < updatedUnit.length; i++) {
        let cardata = await firestore().collection('CardList').doc(updatedUnit[i].imgURL.split('.')[0]).get()
        var maxhpofcard = cardata._data.Classes.indexOf(updatedUnit[i].class)
        // console.log(cardata._data.hps[a], updatedUnit[i].hp+updatedUnit[index].atk)
        if(cardata._data.hps[maxhpofcard] >= updatedUnit[i].hp+updatedUnit[index].atk){
          updatedUnit[i].hp += updatedUnit[i].class != "Healer" ? updatedUnit[index].atk : 0;
        }else{
          updatedUnit[i].hp = updatedUnit[i].class != "Healer" ? cardata._data.hps[maxhpofcard] : updatedUnit[i].hp;
        }
      }
      updatedUnit[index].canAttack = 0;
      setMana(Mana-2);
    }
    else if(Class == "Mage" && Mana >= 1){
      setMageAttacking([...MageAttacking, index]); setMana(Mana-2);
    }
    // console.log(updatedUnit)
    setmyUnit(updatedUnit)
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
                keyExtractor={index => index}
              />
          </View>
          <View style={{height: "50%"}}>
            <View style={{height: "50%", alignItems: "center"}}>
              <ImageBackground source={require("./assets/battlezone.png")} 
                resizeMode="cover" 
                style={{
                  resizeMode: "contain",
                  height: 90,
                  width: 300,
                  alignItems: "flex-start"
              }}>
                <FlatList
                  data={EnemyUnit}
                  renderItem={fieldEnemy}
                  numColumns={5}
                  keyExtractor={item => {item.imgURL+":"}}
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
                  alignItems: "flex-start"
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
              <TouchableOpacity onPress={() => setPhase(2)} style={{height: 100, width: 100, borderRadius: 100,backgroundColor: "black", alignItems: "center", paddingTop: "40%"}}>
                  <Text style={{color: "white", fontWeight: "bold"}}>เจอได้ไอ้สัส</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.deckLocation}>
              <Image source={require("./assets/backCard.jpg")} 
                    style={styles.deckCard}
              />
            </View>
            {/* {(parse == 1) && 
            <View style={{position:"absolute", bottom: 40, right: 130}}>
              <Text style={{fontSize: 14, fontWeight: "bold", color:"white"}} >{"◄◄ Slide " +'\n'+"     to Draw!"}</Text>
            </View>} */}
          {(parse == 1) &&
          <Animated.View 
            style={[pan.getLayout(), {height: "25%", width: 80, marginVertical: 10, marginLeft: 40, elevation: 5}]}
            {...panResponder.panHandlers}
          >
              <Image source={require("./assets/backCard.jpg")} 
                    style={styles.deckCard}
              />
          </Animated.View>}
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
  },
  deckLocation: {
    position: "absolute",
    right: 55,
    bottom: 0,
    elevation: 1
  }
})

export default Testing;