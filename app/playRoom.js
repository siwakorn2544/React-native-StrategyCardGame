import React, { useState, useRef, useEffect } from "react";
import { database, firestore } from './database/db';
import { getCardInformation } from './database/User';
import { Button, Text, View, TouchableOpacity, FlatList, Image, StyleSheet, ImageBackground, Animated,PanResponder } from "react-native";
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Entypo';
import MyHand from "./component/HandUser"
import FieldMonster from "./component/FieldMonster"
import {_setFieldUnit, _receiveGameData} from './database/User'

function PlayRoom({route , navigation}){
    //firebase sync
    const [Player01, setPlayer01] = useState({Hand: [], Field: []});
    const [Player02, setPlayer02] = useState({Hand: [], Field: []});
    const [Turn, setTurn] = useState("");
    
    //Local Varible
    const [Phase, setPhase] = useState(1);
    const [Attacking, setAttacking] = useState(null);
    const [selectedfield, setFieldColor] = useState([0,0,0,0,0]);
    const [MageAttacking, setMageAttacking] = useState([]);
    const [TextPhase, setTextPhase] = useState("Main Phase");

    //Animation DrawCard
    const pan = useRef(new Animated.ValueXY()).current; //step01
    const maxVal = -50;
  
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gesture) => {
          const newVal =  (gesture.dx < maxVal) ? maxVal : ((gesture.dx > 0) ? 0 : gesture.dx);
          pan.setValue({x: newVal, y: 0 });
        },
        onPanResponderRelease: async(e, gesture) => {
            drawCard();
            let newfield = Player01;
            for (let i = 0; i < newfield.Field.length; i++) {
              newfield.Field[i].canAttack = 1;
            }
            await database().ref(`/PlayRoom/${route.params.roomID}/players/${Player01.UID}/Field`).set(player.Field);
            setPhase(1);
            setTextPhase("Main Phase");
        },
    }); //step02

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
        setPlayer01(player01)
        setPlayer02(player02)
        console.log(player02)
        return [player01, player02]
    }

    const DrawCardStartGame = async (deck, i) => {
        deck.Hand.shift();
        for (let index = 0; index < i; index++) {
                //ทำตัวแปร hand field มารับค่าบนสนาม เเล้วsetเข้าdb
                let todraw = await getCardInformation(deck.Deck[0]);
                deck.Hand.push(todraw);
                deck.Deck.shift();
        } 
            // await _asynsPlayer(route.params.UID);
            await database().ref(`PlayRoom/${route.params.roomID}/players/${deck.UID}/Hand`).set(deck.Hand);
            await database().ref(`PlayRoom/${route.params.roomID}/players/${deck.UID}/Deck`).set(deck.Deck);
    }

    useEffect(async () => {
        let players = await _setDataGame(route.params.roomID);

        database()
            .ref(`PlayRoom/${route.params.roomID}/players/${players[0].UID}/Deck`)
            .on('value', snapshot => {
                //render ค่าใหม่
                var player = Player01
                player.Deck = snapshot.val()
                setPlayer01(player)
        });

        database()
            .ref(`PlayRoom/${route.params.roomID}/players/${players[0].UID}/name`)
            .on('value', snapshot => {
                //render ค่าใหม่
                var player = Player01
                player.name = snapshot.val()
                setPlayer01(player)
        });

        database()
            .ref(`PlayRoom/${route.params.roomID}/players/${players[1].UID}/name`)
            .on('value', snapshot => {
                //render ค่าใหม่
                var player = Player02
                player.name = snapshot.val()
                setPlayer01(player)
        });

        database()
            .ref(`PlayRoom/${route.params.roomID}/players/${players[0].UID}/MaxMana`)
            .on('value', snapshot => {
                //render ค่าใหม่
                var player = Player01
                player.MaxMana = snapshot.val()
                setPlayer01(player)
        });

        database()
            .ref(`PlayRoom/${route.params.roomID}/Turn`)
            .on('value', async(snapshot) => {
              if (snapshot.val() == players[0].UID){
                setPhase(0);
                setTextPhase("Draw Phase")
                await database().ref(`PlayRoom/${route.params.roomID}/players/${players[0].UID}/Mana`).set(Player01.MaxMana);
              }else{
                setTextPhase("Enemy Turn")
              }
                console.log("Turn: ", snapshot.val());
                setTurn(snapshot.val());          
        });

        database()
            .ref(`PlayRoom/${route.params.roomID}/players/${players[0].UID}/Mana`)
            .on('value', snapshot => {
                //render ค่าใหม่
                var player = Player01
                player.Mana = snapshot.val()
                setPlayer01(player)
        });

        database()
            .ref(`PlayRoom/${route.params.roomID}/players/${players[0].UID}/Field`)
            .on('value', snapshot => {
                console.log('field 01: ', snapshot.val());
                //render ค่าใหม่
                var player = Player01
                player.Field = snapshot.val()
                setPlayer01(player);
        }); 

        database()
            .ref(`PlayRoom/${route.params.roomID}/players/${players[1].UID}/Field`)
            .on('value', snapshot => {
                console.log('field 02: ', snapshot.val());
                //render ค่าใหม่
                var player = Player02
                player.Field = snapshot.val()
                setPlayer02(player);
        });

        database()
            .ref(`PlayRoom/${route.params.roomID}/players/${players[0].UID}/Hand`)
            .on('value', snapshot => {
                console.log('hand 01: ', snapshot.val());
                //render ค่าใหม่
                var player = Player01
                player.Hand = snapshot.val()
                setPlayer01(player);
        });

        database()
            .ref(`PlayRoom/${route.params.roomID}/players/${players[1].UID}/Hand`)
            .on('value', snapshot => {
                console.log('hand 02: ', snapshot.val());
                //render ค่าใหม่
                var player = Player02
                player.Hand = snapshot.val()
                setPlayer02(player);
            });

          database()
            .ref(`PlayRoom/${route.params.roomID}/players/${players[0].UID}/LiftPoint`)
            .on('value', snapshot => {
                console.log('LP 01: ', snapshot.val());
                //render ค่าใหม่
                var player = Player01
                player.LiftPoint = snapshot.val()
                setPlayer01(player);
            });

        database()
            .ref(`PlayRoom/${route.params.roomID}/players/${players[1].UID}/LiftPoint`)
            .on('value', snapshot => {
                console.log('LP 02: ', snapshot.val());
                //render ค่าใหม่
                var player = Player02
                player.LiftPoint = snapshot.val()
                setPlayer02(player);
            });

        await DrawCardStartGame(players[0], 3);
    }, [])

    //component
    const fieldEnemy = (data) => {
        return (
            <FieldMonster 
                index={data.index} target={targetAttack} 
                width={selectedfield[data.index]} ATK={data.item.atk} 
                HP={data.item.hp} Class={data.item.class} 
                imgURL= {data.item.imgURL} 
            />)
        // return (<Image source={require("./assets/backCard.jpg")} style={styles.cardInField}/>)
    }
    
    const fieldUser = (data) => {
        return (
            <FieldMonster 
                index = {data.index} target = {handleFieldAction} 
                width = {-1} ATK={data.item.atk} HP = {data.item.hp} 
                Class = {data.item.class} imgURL = {data.item.imgURL} 
            />)
        // return (<Image source={require("./assets/backCard.jpg")} style={styles.cardInField}/>)
    }
    
    const handEnemy = (data) => {
        return (<Image source={require("./assets/backCard.jpg")} style={styles.cardInHand}/>)
    }
    
    const myHand = (data) => {
        return (<MyHand atk={data.item.atks} hp={data.item.hps} 
            id={data.item.imgURL} Class={data.item.Classes} index={data.index} cost={data.item.cost}
            summonUnit = { summonCard }/>)
    }

    const MaxManaGem = () => {
      let components = []
      for (let i = 1; i < Player01.MaxMana+1; i++) {
        if (i > Player01.Mana){
          components.push(<Image source={require("./assets/mana(use).png")}  style = { styles.mana } key = {"mana-"+i} />)
        }
        else if (i <= Player01.Mana){
          components.push(<Image source={require("./assets/mana.png")} style = { styles.mana } key = {"mana-"+i}/>)
        }
      }
      return (components.map((value) => {return value}));
    }

    //function
    const drawCard = async() => {
      console.log(Player01);
      var newdeck = new Object(Player01.Deck);
      var newHand = new Object(Player01.Hand);
        //ทำตัวแปร hand field มารับค่าบนสนาม เเล้วsetเข้าdb
      var todraw = await getCardInformation(newdeck[0]);
        newHand.push(todraw);
        newdeck.shift();
        console.log("Hand: ", newHand);
        console.log("Deck: ", newdeck);
  
      await database().ref(`PlayRoom/${route.params.roomID}/players/${Player01.UID}/Hand`).set(newHand);
      await database().ref(`PlayRoom/${route.params.roomID}/players/${Player01.UID}/Deck`).set(newdeck);
    }


    const targetAttack = (index) => {
        if((Phase == 2 && Attacking != null) && (Turn == Player01.UID)){
          Attack(Attacking, index);
        }
    }

    const nextPhase = async () => {
      if(Turn == Player01.UID){
        if(Phase+1 == 2){
          setPhase(Phase+1);
          setTextPhase("Battle Phase")
          console.log(2)
        }
        else if(Phase+1 == 3){
          await database().ref(`/PlayRoom/${route.params.roomID}/Turn`).set(Player02.UID);
          setTextPhase("Enemy Turn")
          console.log("End")
          if(MaxMana < 6){
            var newmax = MaxMana+1;
            await database().ref(`/PlayRoom/${route.params.roomID}/players/${Player01.UID}/MaxMana`).set(newmax);
          }
        }
      }
    }

    const summonCard = async (classSelect, img, index, atk, hp, cost) => {
      if(Turn == Player01.UID){
        if(Player01.Mana >= cost){
          var player = Player01
          var isberserk = (classSelect == "Berserker") ? 1 : 0;
          //change Field
          if (player.Field[0] == ""){
              player.Field = []
          }
          let newUnit = new Object({class: classSelect, imgURL: img, canAttack: isberserk, hp: hp, atk: atk});
          player.Field = [...player.Field, newUnit]
          console.log('Field: ', player.Field);
          //change Hand
          let newHand = Player01.Hand;
            // newHand.splice(index, 1)
          newHand = player.Hand.filter((i, index_i) => index_i != index);
          player.Hand = newHand
          console.log('Hand: ', newHand);

          player.Mana -= cost;
          
          try {
              await database().ref(`/PlayRoom/${route.params.roomID}/players/${Player01.UID}/Mana`).set(player.Mana);
              await database().ref(`/PlayRoom/${route.params.roomID}/players/${Player01.UID}/Field`).set(player.Field);
              await database().ref(`/PlayRoom/${route.params.roomID}/players/${Player01.UID}/Hand`).set(player.Hand);
          } catch(e){console.log(e)}
        }
          
        }
      }

    const handleFieldAction = (index) => {
        // console.log(index)
        if(Turn == Player01.UID){
          if(Player01.Field[index]){
            if(Phase == 1){
              useSkill(index, Player01.Field[index].class);
            }
            else if(Phase == 2 && Player01.Field[index].canAttack >= 1){
              var isHaveDefender = Player02.Field.some((u) => u.class == "Defender");
              var newColorfield = [0,0,0,0,0];
              for (let i = 0; i < Player02.Field.length; i++) {
                if((!isHaveDefender || Player02.Field[i].class  == "Defender") ||  Player01.Field[index].class == "Ranger"){
                  newColorfield[i] = 2;
                }
              }
              setFieldColor(newColorfield);
              setAttacking(index);
            }
          }
        }
      }

    const useSkill = async (index, Class) => {
        let updatedUnit = Player01.Field;
        let newMana = Player01.Mana;
        if(Class == "Knight" && Player01.Mana >= 1){
          updatedUnit[index].canAttack++; newMana -= 1;
        }
        else if(Class == "Healer" && Player01.Mana >= 2){
          for (let i = 0; i < updatedUnit.length; i++) {
            let carddata = await firestore().collection('CardList').doc(updatedUnit[i].imgURL.split('.')[0]).get() //???
            var maxHpOfCard = carddata._data.Classes.indexOf(updatedUnit[i].class)
            // console.log(cardata._data.hps[a], updatedUnit[i].hp+updatedUnit[index].atk)
            if(carddata._data.hps[maxHpOfCard] >= updatedUnit[i].hp+updatedUnit[index].atk){
              updatedUnit[i].hp += updatedUnit[i].class != "Healer" ? updatedUnit[index].atk : 0;
            }else{
              updatedUnit[i].hp = updatedUnit[i].class != "Healer" ? carddata._data.hps[maxHpOfCard] : updatedUnit[i].hp;
            }
          }
          updatedUnit[index].canAttack = 0;
          newMana -= 2;
        }
        else if(Class == "Mage" && Player01.Mana >= 1){
          setMageAttacking([...MageAttacking, index]); newMana-=2;
        }
        // console.log(updatedUnit)
        await database().ref(`/PlayRoom/${route.params.roomID}/players/${Player01.UID}/Mana`).set(newMana);
        await _setFieldUnit(Player02.Field, updatedUnit);
    }

    const Attack = (index1, index2) => {
      if(Phase == 2){
          let enemyUnit = Player02.Field;
          if(MageAttacking.indexOf(index1) != -1){
            for (let i = 0; i < enemyUnit.length; i++) {
              enemyUnit[i].hp -= Player01.Field[index1].atk;
            }
            setMageAttacking(MageAttacking.filter((i) => i == MageAttacking.indexOf(index1)))
          }else{
              enemyUnit[index2].hp -= Player01.Field[index1].atk;
          }
          var player01 = Player01
          player01.Field[index1].canAttack -= 1;
  
          setFieldColor([0,0,0,0,0]);
  
          updateField(player01.Field, enemyUnit);
      }
    }

    async function updateField(p1, p2){
      var MyUnit = p1.filter(checkdeath);
      var enemyUnit = p2.filter(checkdeath);
      let newlife1 = Player01.LiftPoint-(Player01.Field.length-MyUnit.length);
      await database().ref(`/PlayRoom/${route.params.roomID}/players/${Player01.UID}/LifePoint`).set(newlife1);
  
      let newlife2 = Player02.LiftPoint-(Player02.Field.length-enemyUnit.length);
      await database().ref(`/PlayRoom/${route.params.roomID}/players/${Player02.UID}/LifePoint`).set(newlife2);
  
      // setPlayer02(player02); setPlayer01(player01);
      await _setFieldUnit(enemyUnit, MyUnit)
      // updated2 = true;
    }

    const checkdeath = (item) => {
      return item.hp > 0;
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
                      <Text style={ {fontWeight: "bold", fontSize: 20, color:"white"}}>{ Player01.Mana + " / "+ Player01.MaxMana}</Text>
                  </View>
                </View>
              </View>
              <View style={{justifyContent: "space-between", margin: 10}}>
                <View style={{height: "25%", width: 80}}>
                  <ImageBackground source={require("./assets/UserProfile.png")} resizeMode="cover" style={styles.user}>
                      <View style={styles.NameTagBox}>
                        <Text style={styles.NameTag}>{Player02.name}</Text>
                      </View>
                      <Text style={styles.lifepoint}>{Player02.LiftPoint}</Text>
                  </ImageBackground>
                </View>
                <View style={{height: "25%", width: 80}}>
                  <ImageBackground source={require("./assets/UserProfile.png")} resizeMode="cover" style={styles.user}>
                    <View style={styles.NameTagBox}>
                      <Text style={styles.NameTag}>{Player01.name}</Text>
                    </View> 
                      <Text style={styles.lifepoint}>{Player01.LiftPoint}</Text>
                  </ImageBackground>
                </View>
              </View>
            </View>
            <View style={{flex: 0.5, justifyContent: "space-between"}}>    
              <View style={{height: "20%",marginHorizontal: 30, alignItems: "center"}}>
              { (Player02.Hand != []) &&
                  <FlatList
                    data={Object.values(Player02.Hand)}
                    renderItem={handEnemy}
                    numColumns={6}
                    style={styles.handStyle}
                    keyExtractor={index => index}
                  /> 
                }
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
                    { (Player02.Field[0] != ""  && Player02.Field != []) &&
                        <FlatList
                        data={Player02.Field}
                        renderItem={fieldEnemy}
                        numColumns={5}
                        keyExtractor={item => {item.imgURL+":"}}
                        />
                    }
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
                  { (Player01.Field[0] != ""  && Player01.Field != []) &&
                    <FlatList
                      data={Player01.Field}
                      renderItem={fieldUser}
                      numColumns={5}
                    />
                   }
                  </ImageBackground>
                </View>
              </View>
              <View style={{height: "20%",marginHorizontal: 30, alignItems: "center"}}>
                  { (Player01.Hand[0] != ""  && Player01.Hand != []) &&
                  <FlatList
                    data={Player01.Hand}
                    renderItem={myHand}
                    numColumns={6}
                    style={styles.handStyle}
                  />
                  }
              </View>
            </View>
            <View style={{flex: 0.25, justifyContent: "space-between"}}>
              <View style={{height: "25%", width: 80, marginVertical: 10, marginLeft: 40}}>
                  <Image source={require("./assets/backCard.jpg")} 
                        style={styles.deckCard}
                  />
              </View>
                <View style={{height: 100, width: 100, borderRadius: 100, marginLeft: 30 ,backgroundColor: "white"}}>
                  <TouchableOpacity onPress={() => nextPhase()} style={{height: 100, width: 100, borderRadius: 100,backgroundColor: "black", alignItems: "center", paddingTop: "40%"}}>
                      <Text style={{color: "white", fontWeight: "bold"}}>
                        { TextPhase  }
                      </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.deckLocation}>
                  <Image source={require("./assets/backCard.jpg")} 
                        style={styles.deckCard}
                  />
                </View>
              {(Phase == 0) &&
              <Animated.View
                style={[pan.getLayout(), {height: "25%", width: 80, marginVertical: 10, marginLeft: 40, elevation: 5}]}
                {...panResponder.panHandlers}
              >
                  <Image source={require("./assets/backCard.jpg")} 
                        style={styles.deckCard}
                  />
              </Animated.View>}
              {(Phase != 0) &&
              <View
                style={{height: "25%", width: 80, marginVertical: 10, marginLeft: 40, elevation: 5}}
              >
                  <Image source={require("./assets/backCard.jpg")} 
                        style={styles.deckCard}
                  />
              </View>}
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
export default PlayRoom;